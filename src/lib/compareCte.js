import { validateCTeWithAI } from "@/lib/openaiClient";
import { POLICY_RULES } from "@/lib/policyRules";
import { formatDataForAI } from "@/lib/xmlParser";
import { normalizeCNPJ, isDateWithinPolicy } from "./validateCteUtils";
import { formatDateBR } from "./validateCteUtils";

// Validações if/else sequenciais
export async function compareCteSequencial(cteData) {
  try {
    // TODO: implementar try catch

    // 1. Validação do CNPJ
    const cnpjXML = normalizeCNPJ(cteData.emitente.cnpj);
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

    // 2. Validação da data
    const transportDate = cteData.data_transporte;
    const coverStart = POLICY_RULES.emitente.vigencia.inicio;
    const coverEnd = POLICY_RULES.emitente.vigencia.fim;
    if (!isDateWithinPolicy(transportDate, coverStart, coverEnd)) {
      return {
        status: "reprovado",
        validation: [
          {
            etapa: "Data",
            status: "reprovado",
            motivo:
              "Data do transporte fora do período de vigência da apólice.",
            data_xml: formatDateBR(transportDate),
            data_policy: `${coverStart} a ${coverEnd}`,
          },
        ],
      };
    }

    // Inicio de validação com IA
    const cteDataForAI = formatDataForAI(cteData);

    // 3. Validação de bens e mercadorias excluídas
    const excludedGoods = POLICY_RULES.bens_mercadorias_excluidas;
    const excludedGoodsPrompt = `
    Compare as informações do CTe com as condições e regras de exclusão de bens e mercadorias da apólice.
    - Mercadorias, valor de mercadorias, embarcadores, trajetos de origem e destino: poderão ter restrições específicas.
    - status: "reprovado" -> se houver qualquer "regra" que não seja cumprida na apólice
    - Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:

    {
      "status": "aprovado" | "reprovado",
      "motivo": "string explicando o motivo"
    }

    - Não inclua texto adicional, apenas o objeto JSON.

    DADOS DO CTe PARA VALIDAÇÃO:
    ${JSON.stringify(cteData, null, 2)}

    DADOS DE BENS E MERCADORIAS EXCLUÍDAS DA APÓLICE:
    ${JSON.stringify(excludedGoods, null, 2)}

    `;
    const excludedGoodsResult = await validateCTeWithAI(excludedGoodsPrompt);

    if (excludedGoodsResult.status === "reprovado") {
      return {
        status: "reprovado",
        validation: [
          {
            etapa: "Bens e Mercadorias",
            status: "reprovado",
            motivo: `Validação reprovada em bens e mercadorias excluídas: ${excludedGoodsResult.motivo}`,
          },
        ],
      };
    }

    // 4. Regras de Gerenciamento de Risco e LMG
    const riskManagementRules = POLICY_RULES.regras_gerenciamento_de_risco;
    const limitGuarantee = POLICY_RULES.limite_maximo_garantia.value;
    const riskManagementRulesPrompt = `
    1) Compare as informações do CTe com as condições (enumeradas e ordenadas sequencialmente).
    2) Analise se as informações do CTe se enquadram em alguma "limitacao". Caso se enquadrem:
    - analise o "valor da mercadoria" do CTe com as regras de "valor_mercadoria" da apólice e retorne:
    - "status": "atenção"
    - "limite_maximo_garantia" = maior valor mencionado na regra da "condicao" específica.
    - "motivo": "string explicando o motivo".
    3) Se não houver enquadramento: 
      "status": "aprovado"
      "limite_maximo_garantia": R$ ${limitGuarantee}
      "motivo": "string explicando o motivo"
    4) Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:
    {
      "status": "aprovado" | "atenção",
      "limite_maximo_garantia": "R$ 0,00",
      "motivo": "string explicando o motivo"
    }
    - Não inclua texto adicional, apenas o objeto JSON.

    DADOS DO CTe PARA VALIDAÇÃO:
    ${JSON.stringify(cteData, null, 2)}

    DADOS DE GERENCIAMENTO DE RISCO DA APÓLICE:
    ${JSON.stringify(riskManagementRules, null, 2)}
    `;
    const riskManagementResult = await validateCTeWithAI(
      riskManagementRulesPrompt
    );

    if (riskManagementResult.status === "reprovado") {
      return {
        status: "reprovado",
        validation: [
          {
            etapa: "Gerenciamento de Risco",
            status: "reprovado",
            motivo: `Validação reprovada em gerenciamento de risco: ${riskManagementResult.motivo}`,
          },
        ],
      };
    }

    return {
      status: "aprovado",
      validation: [
        {
          etapa: "Final",
          status: "aprovado",
          motivo: "CTe aprovado conforme regras da apólice.",
        },
      ],
    };
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

// Validações if/else completas
export async function compareCteCompleta(cteData) {
  try {
    const results = [];

    // 1. Validação do CNPJ
    const cnpjXML = normalizeCNPJ(cteData.emitente.cnpj);
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

    // 2. Validação da data
    const transportDate = cteData.data_transporte;
    const coverStart = POLICY_RULES.emitente.vigencia.inicio;
    const coverEnd = POLICY_RULES.emitente.vigencia.fim;
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

    // 3. Validação de bens e mercadorias excluídas
    const excludedGoods = POLICY_RULES.bens_mercadorias_excluidas;
    const excludedGoodsPrompt = `
    Compare as informações do CTe com as condições e regras de exclusão de bens e mercadorias da apólice.
    - Mercadorias, valor de mercadorias, embarcadores, trajetos de origem e destino: poderão ter restrições específicas.
    - status: "reprovado" -> se houver qualquer "regra" que não seja cumprida na apólice
    - Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:

    {
      "status": "aprovado" | "reprovado",
      "motivo": "string explicando o motivo"
    }

    - Não inclua texto adicional, apenas o objeto JSON.

    DADOS DO CTe PARA VALIDAÇÃO:
    ${JSON.stringify(cteData, null, 2)}

    DADOS DE BENS E MERCADORIAS EXCLUÍDAS DA APÓLICE:
    ${JSON.stringify(excludedGoods, null, 2)}

    `;
    const excludedGoodsResult = await validateCTeWithAI(excludedGoodsPrompt);

    if (excludedGoodsResult.status === "reprovado") {
      results.push({
        etapa: "Bens e Mercadorias",
        status: "reprovado",
        motivo: `Validação reprovada em bens e mercadorias excluídas: ${excludedGoodsResult.motivo}`,
      });
    } else {
      results.push({
        etapa: "Bens e Mercadorias",
        status: "aprovado",
        motivo: "Mercadoria permitida pela apólice.",
      });
    }

    // 4. Regras de Gerenciamento de Risco e LMG
    const riskManagementRules = POLICY_RULES.regras_gerenciamento_de_risco;
    const limitGuaranteeValue = POLICY_RULES.limite_maximo_garantia.valor;
    const riskManagementRulesPrompt = `
    1) Compare as informações do CTe com as condições (enumeradas e ordenadas sequencialmente).
    2) Analise se as informações do CTe se enquadram em alguma "limitacao". Caso se enquadrem:
    - analise o "valor da mercadoria" do CTe com as regras de "valor_mercadoria" da apólice e retorne:
    - "status": "atencao"
    - "limite_maximo_garantia" = maior valor mencionado na regra da "condicao" específica.
    - "motivo": "string explicando o motivo".
    3) Se não houver enquadramento: 
      "status": "aprovado"
      "limite_maximo_garantia": R$ ${limitGuaranteeValue}
      "motivo": "string explicando o motivo"
    4) Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:
    {
      "status": "aprovado" | "atencao",
      "limite_maximo_garantia": "R$ 0,00",
      "motivo": "string explicando o motivo"
    }
    - Não inclua texto adicional, apenas o objeto JSON.

    DADOS DO CTe PARA VALIDAÇÃO:
    ${JSON.stringify(cteData, null, 2)}

    DADOS DE GERENCIAMENTO DE RISCO DA APÓLICE:
    ${JSON.stringify(riskManagementRules, null, 2)}
    `;

    const riskManagementResult = await validateCTeWithAI(
      riskManagementRulesPrompt
    );

    if (riskManagementResult.status === "atencao") {
      results.push({
        etapa: "Regras de Gerenciamento de Risco",
        status: "atencao",
        motivo: `Estre transporte possui alerta em Regras de Gerenciamento de Risco: ${riskManagementResult.motivo}`,
      });
    } else {
      results.push({
        etapa: "Regras de Gerenciamento de Risco",
        status: "aprovado",
        motivo:
          "Regras de Gerenciamento de Risco não possui pontos de atenção.",
      });
    }

    // Determina status geral
    const statusGeral = results.some((r) => r.status === "reprovado")
      ? "reprovado"
      : "aprovado";

    //Resultado: Fim do fluxo
    return {
      status: statusGeral,
      validation: results,
    };
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
