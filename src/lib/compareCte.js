// src/lib/compareCte.v2.js
import { POLICY_RULES } from "@/lib/policyRules"; // ainda usado p/ CNPJ e vigência (determinístico)
import { SEMANTIC_POLICY_V2 } from "@/lib/policyRules.semantic.v2";
import { validateCTeWithAI } from "@/lib/openaiClient";
import {
  normalizeCNPJ,
  isDateWithinPolicy,
  formatDateBR,
} from "@/lib/validateCteUtils";
import {
  buildExclusionsPrompt,
  buildRiskPrompt,
  buildLmgPrompt,
} from "@/lib/prompts/semanticValidationPrompt.v2";

/**
 * Auxiliar: garante que campos de arrays existam (evita [Array] nos logs compactos do Node).
 */
function asArray(x) {
  if (Array.isArray(x)) return x;
  if (x == null) return [];
  return [x];
}

/**
 * Consolida status geral:
 * - Se exclusões = reprovado => reprovado
 * - Senão, se risco = atenção => atenção
 * - Senão => aprovado
 */
function consolidateStatus(results) {
  const hasReprovado = results.some((r) => r.status === "reprovado");
  if (hasReprovado) return "reprovado";
  const hasAtencao = results.some((r) => r.status === "atenção");
  if (hasAtencao) return "atenção";
  return "aprovado";
}

/**
 * Retorna o LMG final a partir do bloco LMG (com fallback para default da policy).
 */
function extractLmg(lmgBlock) {
  if (!lmgBlock) return SEMANTIC_POLICY_V2.lmg?.default_brl ?? 0;
  if (typeof lmgBlock.lmg_brl === "number") return lmgBlock.lmg_brl;
  return SEMANTIC_POLICY_V2.lmg?.default_brl ?? 0;
}

/**
 * Validação "modo completo" com 1 prompt por bloco:
 * 1) CNPJ (exato)
 * 2) Data (exato)
 * 3) Exclusões (IA)
 * 4) Gerenciamento de Risco (IA)
 * 5) LMG (IA)
 * Retorna objeto { status, validation[] } (compatível com seu frontend atual).
 */
export async function compareCteCompletaV2(cteData) {
  try {
    const results = [];

    // ---------- 1) CNPJ ----------
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

    // ---------- 2) Data ----------
    const transportDateISO = cteData.transport_date; // "YYYY-MM-DD"
    const coverStart = POLICY_RULES.emitente.vigencia.inicio; // dd/mm/yyyy
    const coverEnd = POLICY_RULES.emitente.vigencia.fim; // dd/mm/yyyy

    if (!isDateWithinPolicy(transportDateISO, coverStart, coverEnd)) {
      results.push({
        etapa: "Data",
        status: "reprovado",
        motivo: "Data do transporte fora do período de vigência da apólice.",
        data_xml: formatDateBR(transportDateISO),
        data_policy: `${coverStart} a ${coverEnd}`,
      });
    } else {
      results.push({
        etapa: "Data",
        status: "aprovado",
        motivo: "Data do transporte dentro do período de vigência da apólice.",
        data_xml: formatDateBR(transportDateISO),
        data_policy: `${coverStart} a ${coverEnd}`,
      });
    }

    // ---------- 3,4,5) IA: 1 prompt por bloco ----------
    const [exclRaw, riskRaw, lmgRaw] = await Promise.all([
      validateCTeWithAI(buildExclusionsPrompt(cteData, SEMANTIC_POLICY_V2)),
      validateCTeWithAI(buildRiskPrompt(cteData, SEMANTIC_POLICY_V2)),
      validateCTeWithAI(buildLmgPrompt(cteData, SEMANTIC_POLICY_V2)),
    ]);

    // --- Exclusões ---
    if (exclRaw) {
      results.push({
        etapa: "Bens e Mercadorias",
        status: exclRaw.status || "aprovado",
        motivo:
          exclRaw.status === "reprovado"
            ? asArray(exclRaw.violations).join("; ") ||
              "Enquadramento em exclusões."
            : "Sem enquadramento em exclusões.",
        matched_rule_ids: asArray(exclRaw.matched_rule_ids),
      });
    }

    // --- Risco ---
    if (riskRaw) {
      results.push({
        etapa: "Gerenciamento de Risco",
        status: riskRaw.status || "aprovado",
        motivo:
          riskRaw.status === "atenção"
            ? "Ponto(s) de atenção identificado(s)."
            : "Sem enquadramento em pontos de atenção.",
        matched_rule_ids: asArray(riskRaw.matched_rule_ids),
        obligations: asArray(riskRaw.obligations),
        bands_applied: asArray(riskRaw.bands_applied),
      });
    }

    // --- LMG ---
    const lmgFinal = extractLmg(lmgRaw);
    results.push({
      etapa: "LMG",
      status: "aprovado",
      motivo:
        lmgRaw?.basis === "override"
          ? `LMG definido por override (${lmgRaw.override_id}).`
          : "LMG padrão da apólice aplicado.",
      lmg_brl: lmgFinal,
      basis: lmgRaw?.basis || "default",
      override_id: lmgRaw?.override_id || null,
      matched_rule_ids: asArray(lmgRaw?.matched_rule_ids),
    });

    // ---------- Status geral ----------
    const statusGeral = consolidateStatus(results);

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

/**
 * Versão sequencial: mesma lógica, mas para no primeiro "reprovado".
 */
export async function compareCteSequencialV2(cteData) {
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
  const transportDateISO = cteData.transport_date;
  const coverStart = POLICY_RULES.emitente.vigencia.inicio;
  const coverEnd = POLICY_RULES.emitente.vigencia.fim;
  if (!isDateWithinPolicy(transportDateISO, coverStart, coverEnd)) {
    return {
      status: "reprovado",
      validation: [
        {
          etapa: "Data",
          status: "reprovado",
          motivo: "Data do transporte fora do período de vigência da apólice.",
          data_xml: formatDateBR(transportDateISO),
          data_policy: `${coverStart} a ${coverEnd}`,
        },
      ],
    };
  }

  // 3) Exclusões
  const exclRaw = await validateCTeWithAI(
    buildExclusionsPrompt(cteData, SEMANTIC_POLICY_V2)
  );
  if (exclRaw?.status === "reprovado") {
    return {
      status: "reprovado",
      validation: [
        {
          etapa: "Bens e Mercadorias",
          status: "reprovado",
          motivo: (exclRaw.violations || []).join("; "),
          matched_rule_ids: exclRaw.matched_rule_ids || [],
        },
      ],
    };
  }

  // 4) Risco
  const riskRaw = await validateCTeWithAI(
    buildRiskPrompt(cteData, SEMANTIC_POLICY_V2)
  );
  const riskBlock = {
    etapa: "Gerenciamento de Risco",
    status: riskRaw?.status || "aprovado",
    motivo:
      riskRaw?.status === "atenção"
        ? "Ponto(s) de atenção identificado(s)."
        : "Sem enquadramento em pontos de atenção.",
    matched_rule_ids: riskRaw?.matched_rule_ids || [],
    obligations: riskRaw?.obligations || [],
    bands_applied: riskRaw?.bands_applied || [],
  };

  // 5) LMG
  const lmgRaw = await validateCTeWithAI(
    buildLmgPrompt(cteData, SEMANTIC_POLICY_V2)
  );
  const lmgBlock = {
    etapa: "LMG",
    status: "aprovado",
    motivo:
      lmgRaw?.basis === "override"
        ? `LMG definido por override (${lmgRaw.override_id}).`
        : "LMG padrão da apólice aplicado.",
    lmg_brl: extractLmg(lmgRaw),
    basis: lmgRaw?.basis || "default",
    override_id: lmgRaw?.override_id || null,
    matched_rule_ids: lmgRaw?.matched_rule_ids || [],
  };

  const statusGeral = riskBlock.status === "atenção" ? "atenção" : "aprovado";
  return { status: statusGeral, validation: [riskBlock, lmgBlock] };
}
