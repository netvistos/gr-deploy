import { POLICY_RULES } from "./policyRules.js";
import { validateCTeWithAI } from "./openaiClient.js";
import {
  normalizeCNPJ,
  isDateWithinPolicy,
  formatDateBR,
} from "./validateCteUtils.js";
import {
  buildExclusionsPrompt,
  buildRiskAndLmgPrompt,
} from "./prompts/semanticValidationPrompt.js";

/**
 * Consolida o status geral baseado nas etapas:
 * - Se alguma for "reprovado" => reprovado
 * - Senão, se alguma for "atenção" => atenção
 * - Caso contrário => aprovado
 */
function consolidateStatus(results) {
  const hasReprovado = results.some((r) => r.status === "reprovado");
  if (hasReprovado) return "reprovado";
  const hasAtencao = results.some((r) => r.status === "atenção");
  if (hasAtencao) return "atenção";
  return "aprovado";
}

/**
 * Validação COMPLETA:
 * Executa todas as etapas, mesmo que alguma reprove.
 */
export async function compareCteCompleta(cteData) {
  try {
    const results = [];

    // 1) CNPJ
    const cnpjXML = normalizeCNPJ(cteData.issuer.cnpj);
    const cnpjPolicy = normalizeCNPJ(POLICY_RULES.issuer.cnpj);
    results.push({
      etapa: "CNPJ",
      status: cnpjXML === cnpjPolicy ? "aprovado" : "reprovado",
      motivo:
        cnpjXML === cnpjPolicy
          ? "CNPJ do emitente autorizado pela apólice."
          : "CNPJ do emitente não autorizado pela apólice.",
      cnpj_xml: cnpjXML,
      cnpj_policy: cnpjPolicy,
    });

    // 2) Data
    const transportDateISO = cteData.transport_date;
    const coverStart = POLICY_RULES.issuer.coverage.start;
    const coverEnd = POLICY_RULES.issuer.coverage.end;
    results.push({
      etapa: "Data",
      status: isDateWithinPolicy(transportDateISO, coverStart, coverEnd)
        ? "aprovado"
        : "reprovado",
      motivo: isDateWithinPolicy(transportDateISO, coverStart, coverEnd)
        ? "Data do transporte dentro do período de vigência da apólice."
        : "Data do transporte fora do período de vigência da apólice.",
      data_xml: formatDateBR(transportDateISO),
      data_policy: `${coverStart} a ${coverEnd}`,
    });

    // 3) Exclusões
    const exclRaw = await validateCTeWithAI(
      buildExclusionsPrompt(cteData, POLICY_RULES)
    );
    results.push({
      etapa: "Bens e Mercadorias",
      status: exclRaw.status || "aprovado",
      motivo:
        exclRaw.status === "reprovado"
          ? (Array.isArray(exclRaw.violations) ? exclRaw.violations : []).join(
              "; "
            ) || "Enquadramento em exclusões."
          : "Sem enquadramento em exclusões.",
      matched_rule_ids: Array.isArray(exclRaw.matched_rule_ids)
        ? exclRaw.matched_rule_ids
        : [],
    });

    // 4) Gerenciamento de Risco + LMG
    const riskLmgRaw = await validateCTeWithAI(
      buildRiskAndLmgPrompt(cteData, POLICY_RULES)
    );
    results.push({
      etapa: "Gerenciamento de Risco",
      status: riskLmgRaw.status || "aprovado",
      motivo:
        riskLmgRaw.status === "atenção"
          ? "Ponto(s) de atenção identificado(s)."
          : "Sem enquadramento em pontos de atenção.",
      matched_rule_ids: Array.isArray(riskLmgRaw.matched_rule_ids)
        ? riskLmgRaw.matched_rule_ids
        : [],
      obligations: Array.isArray(riskLmgRaw.obligations)
        ? riskLmgRaw.obligations
        : [],
      bands_applied: Array.isArray(riskLmgRaw.bands_applied)
        ? riskLmgRaw.bands_applied
        : [],
    });
    results.push({
      etapa: "LMG",
      status: "aprovado",
      motivo: "LMG calculado a partir das regras de risco aplicáveis.",
      lmg_brl: riskLmgRaw.lmg_brl,
    });

    return { status: consolidateStatus(results), validation: results };
  } catch (error) {
    return {
      status: "erro",
      validation: [{ etapa: "Geral", status: "erro", motivo: error.message }],
    };
  }
}

/**
 * Validação SEQUENCIAL:
 * Para na primeira etapa que retornar "reprovado".
 */
export async function compareCteSequencial(cteData) {
  try {
    // 1) CNPJ
    const cnpjXML = normalizeCNPJ(cteData.issuer.cnpj);
    const cnpjPolicy = normalizeCNPJ(POLICY_RULES.issuer.cnpj);
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
    const coverStart = POLICY_RULES.issuer.coverage.start;
    const coverEnd = POLICY_RULES.issuer.coverage.end;
    if (!isDateWithinPolicy(transportDateISO, coverStart, coverEnd)) {
      return {
        status: "reprovado",
        validation: [
          {
            etapa: "Data",
            status: "reprovado",
            motivo:
              "Data do transporte fora do período de vigência da apólice.",
            data_xml: formatDateBR(transportDateISO),
            data_policy: `${coverStart} a ${coverEnd}`,
          },
        ],
      };
    }

    // 3) Exclusões
    const exclRaw = await validateCTeWithAI(
      buildExclusionsPrompt(cteData, POLICY_RULES)
    );
    if (exclRaw.status === "reprovado") {
      return {
        status: "reprovado",
        validation: [
          {
            etapa: "Bens e Mercadorias",
            status: "reprovado",
            motivo: (Array.isArray(exclRaw.violations)
              ? exclRaw.violations
              : []
            ).join("; "),
            matched_rule_ids: Array.isArray(exclRaw.matched_rule_ids)
              ? exclRaw.matched_rule_ids
              : [],
          },
        ],
      };
    }

    // 4) Gerenciamento de Risco + LMG
    const riskLmgRaw = await validateCTeWithAI(
      buildRiskAndLmgPrompt(cteData, POLICY_RULES)
    );
    const riskBlock = {
      etapa: "Gerenciamento de Risco",
      status: riskLmgRaw.status || "aprovado",
      motivo:
        riskLmgRaw.status === "atenção"
          ? "Ponto(s) de atenção identificado(s)."
          : "Sem enquadramento em pontos de atenção.",
      matched_rule_ids: Array.isArray(riskLmgRaw.matched_rule_ids)
        ? riskLmgRaw.matched_rule_ids
        : [],
      obligations: Array.isArray(riskLmgRaw.obligations)
        ? riskLmgRaw.obligations
        : [],
      bands_applied: Array.isArray(riskLmgRaw.bands_applied)
        ? riskLmgRaw.bands_applied
        : [],
    };

    const lmgBlock = {
      etapa: "LMG",
      status: "aprovado",
      motivo: "LMG calculado a partir das regras de risco aplicáveis.",
      lmg_brl: riskLmgRaw.lmg_brl,
    };

    const statusGeral = riskBlock.status === "atenção" ? "atenção" : "aprovado";
    return { status: statusGeral, validation: [riskBlock, lmgBlock] };
  } catch (error) {
    return {
      status: "erro",
      validation: [{ etapa: "Geral", status: "erro", motivo: error.message }],
    };
  }
}
