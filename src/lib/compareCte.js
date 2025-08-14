import { POLICY_RULES } from "./policyRules.js";
import { validateCTeWithAI } from "./openaiClient.js";
import {
  normalizeCNPJ,
  isDateWithinPolicy,
  formatDateBR,
  calculateLMG,
} from "./validateCteUtils.js";
import { buildExclusionsPrompt, buildRiskPrompt } from "./prompts.js";

function consolidateStatus(results) {
  const hasReprovado = results.some((r) => r.status === "reprovado");
  if (hasReprovado) return "reprovado";
  const hasAtencao = results.some((r) => r.status === "atenção");
  if (hasAtencao) return "atenção";
  return "aprovado";
}

// --- COMPLETA ---
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
      data_policy: `${formatDateBR(coverStart)} a ${formatDateBR(coverEnd)}`,
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

    // 4) Gerenciamento de Risco
    const riskRaw = await validateCTeWithAI(
      buildRiskPrompt(cteData, POLICY_RULES)
    );
    results.push({
      etapa: "Gerenciamento de Risco",
      status: riskRaw.status || "aprovado",
      motivo:
        riskRaw.status === "atenção"
          ? "Ponto(s) de atenção identificado(s)."
          : "Sem enquadramento em pontos de atenção.",
      matched_rule_ids: Array.isArray(riskRaw.matched_rule_ids)
        ? riskRaw.matched_rule_ids
        : [],
      obligations: Array.isArray(riskRaw.obligations)
        ? riskRaw.obligations
        : [],
      bands_applied: Array.isArray(riskRaw.bands_applied)
        ? riskRaw.bands_applied
        : [],
    });

    // 5) LMG (calculado no backend)
    const { lmg_brl, lmg_sources } = calculateLMG(
      riskRaw.bands_applied,
      POLICY_RULES
    );

    let lmgStatus = "aprovado";
    let lmgMotivo = "LMG calculado a partir das regras de risco aplicáveis.";

    // Verifica se o valor da carga excede o LMG
    if (cteData.goods.value_brl > lmg_brl) {
      lmgStatus = "reprovado";
      lmgMotivo = `Valor da mercadoria (R$ ${cteData.goods.value_brl.toLocaleString(
        "pt-BR"
      )}) excede o LMG aplicável (R$ ${lmg_brl.toLocaleString("pt-BR")}).`;
    }

    results.push({
      etapa: "LMG",
      status: lmgStatus,
      motivo: lmgMotivo,
      lmg_brl,
      lmg_sources,
    });

    return { status: consolidateStatus(results), validation: results };
  } catch (error) {
    return {
      status: "erro",
      validation: [{ etapa: "Geral", status: "erro", motivo: error.message }],
    };
  }
}

// --- SEQUENCIAL ---
export async function compareCteSequencial(cteData) {
  try {
    const results = [];

    // 1) CNPJ - primeira verificação
    const cnpjXML = normalizeCNPJ(cteData.issuer.cnpj);
    const cnpjPolicy = normalizeCNPJ(POLICY_RULES.issuer.cnpj);
    const cnpjResult = {
      etapa: "CNPJ",
      status: cnpjXML === cnpjPolicy ? "aprovado" : "reprovado",
      motivo:
        cnpjXML === cnpjPolicy
          ? "CNPJ do emitente autorizado pela apólice."
          : "CNPJ do emitente não autorizado pela apólice.",
      cnpj_xml: cnpjXML,
      cnpj_policy: cnpjPolicy,
    };
    results.push(cnpjResult);

    // Para na primeira falha (não incluir LMG quando parar cedo)
    if (cnpjResult.status === "reprovado") {
      return {
        status: "reprovado",
        validation: results,
        stopped_at: "CNPJ",
        reason: "Validação interrompida devido a reprovação em etapa anterior.",
      };
    }

    // 2) Data - só executa se CNPJ passou
    const transportDateISO = cteData.transport_date;
    const coverStart = POLICY_RULES.issuer.coverage.start;
    const coverEnd = POLICY_RULES.issuer.coverage.end;
    const dataResult = {
      etapa: "Data",
      status: isDateWithinPolicy(transportDateISO, coverStart, coverEnd)
        ? "aprovado"
        : "reprovado",
      motivo: isDateWithinPolicy(transportDateISO, coverStart, coverEnd)
        ? "Data do transporte dentro do período de vigência da apólice."
        : "Data do transporte fora do período de vigência da apólice.",
      data_xml: formatDateBR(transportDateISO),
      data_policy: `${formatDateBR(coverStart)} a ${formatDateBR(coverEnd)}`,
    };
    results.push(dataResult);

    // Para na segunda falha (não incluir LMG quando parar cedo)
    if (dataResult.status === "reprovado") {
      return {
        status: "reprovado",
        validation: results,
        stopped_at: "Data",
        reason: "Validação interrompida devido a reprovação em etapa anterior.",
      };
    }

    // 3) Exclusões - só executa se Data passou
    const exclRaw = await validateCTeWithAI(
      buildExclusionsPrompt(cteData, POLICY_RULES)
    );
    const exclusoesResult = {
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
    };
    results.push(exclusoesResult);

    // Para se houve reprovação em exclusões (não incluir LMG quando parar cedo)
    if (exclusoesResult.status === "reprovado") {
      return {
        status: "reprovado",
        validation: results,
        stopped_at: "Bens e Mercadorias",
        reason: "Validação interrompida devido a reprovação em etapa anterior.",
      };
    }

    // 4) Gerenciamento de Risco - só executa se Exclusões passou
    const riskRaw = await validateCTeWithAI(
      buildRiskPrompt(cteData, POLICY_RULES)
    );
    const riskResult = {
      etapa: "Gerenciamento de Risco",
      status: riskRaw.status || "aprovado",
      motivo:
        riskRaw.status === "atenção"
          ? "Ponto(s) de atenção identificado(s)."
          : "Sem enquadramento em pontos de atenção.",
      matched_rule_ids: Array.isArray(riskRaw.matched_rule_ids)
        ? riskRaw.matched_rule_ids
        : [],
      obligations: Array.isArray(riskRaw.obligations)
        ? riskRaw.obligations
        : [],
      bands_applied: Array.isArray(riskRaw.bands_applied)
        ? riskRaw.bands_applied
        : [],
    };
    results.push(riskResult);

    // 5) LMG - executa apenas quando chega aqui (há validação de risk rules)
    const { lmg_brl, lmg_sources } = calculateLMG(
      riskResult.bands_applied || [],
      POLICY_RULES
    );

    let lmgStatus = "aprovado";
    let lmgMotivo =
      riskResult.bands_applied && riskResult.bands_applied.length > 0
        ? "LMG calculado a partir das regras de risco aplicáveis."
        : "LMG padrão aplicado (nenhuma regra de risco específica aplicável).";

    // Verifica se o valor da carga excede o LMG
    if (cteData.goods.value_brl > lmg_brl) {
      lmgStatus = "reprovado";
      lmgMotivo = `Valor da mercadoria (R$ ${cteData.goods.value_brl.toLocaleString(
        "pt-BR"
      )}) excede o LMG aplicável (R$ ${lmg_brl.toLocaleString("pt-BR")}).`;
    }

    const lmgResult = {
      etapa: "LMG",
      status: lmgStatus,
      motivo: lmgMotivo,
      lmg_brl,
      lmg_sources,
    };
    results.push(lmgResult);

    // Status final considera atenção + aprovação/reprovação
    const finalStatus = consolidateStatus(results);

    return {
      status: finalStatus,
      validation: results,
      completed: true,
    };
  } catch (error) {
    return {
      status: "erro",
      validation: [{ etapa: "Geral", status: "erro", motivo: error.message }],
      stopped_at: "Erro",
      reason: "Erro durante execução da validação.",
    };
  }
}
