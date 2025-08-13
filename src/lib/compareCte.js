// src/lib/compareCte.js
import { validateCTeWithAI } from "@/lib/openaiClient";
import { POLICY_RULES } from "@/lib/policyRules";
import { SEMANTIC_POLICY } from "@/lib/policyRules.semantic";
import {
  normalizeCNPJ,
  isDateWithinPolicy,
  formatDateBR,
} from "./validateCteUtils";
import { buildSemanticValidationPrompt } from "@/lib/prompts/semanticValidationPrompt";

// --------- MODO COMPLETO: executa todas as etapas ---------
export async function compareCteCompleta(cteData) {
  try {
    const results = [];

    // 1) CNPJ
    const cnpjXML = normalizeCNPJ(cteData.issuer.cnpj);
    const cnpjPolicy = normalizeCNPJ(POLICY_RULES.emitente.cnpj);
    if (cnpjXML !== cnpjPolicy) {
      results.push({
        etapa: "CNPJ",
        status: "reprovado",
        motivo: "CNPJ do emitente não autorizado pela apólice.",
        cnpj_xml: cnpjXML,
        cnpj_policy: cnpjPolicy,
      });
    } else {
      results.push({
        etapa: "CNPJ",
        status: "aprovado",
        motivo: "CNPJ do emitente autorizado pela apólice.",
        cnpj_xml: cnpjXML,
        cnpj_policy: cnpjPolicy,
      });
    }

    // 2) Data
    const transportDate = cteData.transport_date; // ISO
    const coverStart = POLICY_RULES.emitente.vigencia.inicio; // dd/mm/yyyy
    const coverEnd = POLICY_RULES.emitente.vigencia.fim; // dd/mm/yyyy
    if (!isDateWithinPolicy(transportDate, coverStart, coverEnd)) {
      results.push({
        etapa: "Data",
        status: "reprovado",
        motivo: "Data do transporte fora do período de vigência da apólice.",
        data_xml: formatDateBR(transportDate),
        data_policy: `${coverStart} a ${coverEnd}`,
      });
    } else {
      results.push({
        etapa: "Data",
        status: "aprovado",
        motivo: "Data do transporte dentro do período de vigência da apólice.",
        data_xml: formatDateBR(transportDate),
        data_policy: `${coverStart} a ${coverEnd}`,
      });
    }

    // 3) IA Semântica (exclusões + risco + LMG)
    const prompt = buildSemanticValidationPrompt(cteData, SEMANTIC_POLICY);
    const ai = await validateCTeWithAI(prompt);

    const excl = ai.stage_results?.find((s) => s.stage === "BENS_EXCLUIDOS");
    const risk = ai.stage_results?.find(
      (s) => s.stage === "GERENCIAMENTO_RISCO"
    );

    if (excl) {
      results.push({
        etapa: "Bens e Mercadorias",
        status: excl.status,
        motivo:
          excl.status === "reprovado"
            ? `Reprovado por exclusões: ${excl.violations?.join("; ")}`
            : "Sem enquadramento em exclusões",
        matched_rule_ids: excl.matched_rule_ids || [],
      });
    }

    if (risk) {
      results.push({
        etapa: "Gerenciamento de Risco",
        status: risk.status,
        motivo:
          risk.status === "atenção"
            ? "Ponto(s) de atenção identificado(s)."
            : "Sem enquadramento em pontos de atenção.",
        matched_rule_ids: risk.matched_rule_ids || [],
        obligations: risk.obligations || [],
        limite_maximo_garantia:
          typeof risk.lmg_brl === "number"
            ? risk.lmg_brl
            : SEMANTIC_POLICY.lmg.default_brl,
      });
    } else {
      results.push({
        etapa: "Gerenciamento de Risco",
        status: "aprovado",
        motivo: "Sem enquadramento em pontos de atenção.",
        matched_rule_ids: [],
        obligations: [],
        limite_maximo_garantia: SEMANTIC_POLICY.lmg.default_brl,
      });
    }

    // 4) Status geral: reprovado > atenção > aprovado
    let statusGeral = "aprovado";
    if (results.some((r) => r.status === "reprovado"))
      statusGeral = "reprovado";
    else if (results.some((r) => r.status === "atenção"))
      statusGeral = "atenção";

    return { status: statusGeral, validation: results };
  } catch (error) {
    return {
      status: "erro",
      validation: [
        {
          etapa: "Geral",
          status: "erro",
          motivo: `Erro na validação do CTe: ${error.message}`,
        },
      ],
    };
  }
}

// --------- MODO SEQUENCIAL: para no primeiro reprovado ---------
export async function compareCteSequencial(cteData) {
  // 1) CNPJ
  const cnpjXML = normalizeCNPJ(cteData.issuer.cnpj);
  const cnpjPolicy = normalizeCNPJ(POLICY_RULES.emitente.cnpj);
  if (cnpjXML !== cnpjPolicy) {
    return {
      status: "reprovado",
      validation: [
        {
          etapa: "CNPJ",
          status: "reprovado",
          motivo: "CNPJ do emitente não autorizado pela apólice.",
          cnpj_xml: cnpjXML,
          cnpj_policy: cnpjPolicy,
        },
      ],
    };
  }

  // 2) Data
  const transportDate = cteData.transport_date; // ISO
  const coverStart = POLICY_RULES.emitente.vigencia.inicio; // dd/mm/yyyy
  const coverEnd = POLICY_RULES.emitente.vigencia.fim; // dd/mm/yyyy
  if (!isDateWithinPolicy(transportDate, coverStart, coverEnd)) {
    return {
      status: "reprovado",
      validation: [
        {
          etapa: "Data",
          status: "reprovado",
          motivo: "Data do transporte fora do período de vigência da apólice.",
          data_xml: formatDateBR(transportDate),
          data_policy: `${coverStart} a ${coverEnd}`,
        },
      ],
    };
  }

  // 3) IA Semântica
  const prompt = buildSemanticValidationPrompt(cteData, SEMANTIC_POLICY);
  const ai = await validateCTeWithAI(prompt);

  const excl = ai.stage_results?.find((s) => s.stage === "BENS_EXCLUIDOS");
  if (excl?.status === "reprovado") {
    return {
      status: "reprovado",
      validation: [
        {
          etapa: "Bens e Mercadorias",
          status: "reprovado",
          motivo: `Reprovado por exclusões: ${excl.violations?.join("; ")}`,
          matched_rule_ids: excl.matched_rule_ids || [],
        },
      ],
    };
  }

  const risk = ai.stage_results?.find((s) => s.stage === "GERENCIAMENTO_RISCO");
  const riskBlock = risk
    ? {
        etapa: "Gerenciamento de Risco",
        status: risk.status,
        matched_rule_ids: risk.matched_rule_ids || [],
        obligations: risk.obligations || [],
        limite_maximo_garantia:
          typeof risk.lmg_brl === "number"
            ? risk.lmg_brl
            : SEMANTIC_POLICY.lmg.default_brl,
        motivo:
          risk.status === "atenção"
            ? "Ponto(s) de atenção identificado(s)."
            : "Sem enquadramento em pontos de atenção.",
      }
    : {
        etapa: "Gerenciamento de Risco",
        status: "aprovado",
        matched_rule_ids: [],
        obligations: [],
        limite_maximo_garantia: SEMANTIC_POLICY.lmg.default_brl,
        motivo: "Sem enquadramento em pontos de atenção.",
      };

  const finalStatus = riskBlock.status === "atenção" ? "atenção" : "aprovado";
  return { status: finalStatus, validation: [riskBlock] };
}
