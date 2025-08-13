import { validateCTeWithAI } from "@/lib/openaiClient";
import { POLICY_RULES } from "@/lib/policyRules";
import { normalizeCNPJ, isDateWithinPolicy } from "./validateCteUtils";
import { formatDateBR } from "./validateCteUtils";

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
Você é um validador de CTe para gerenciamento de riscos. Compare os dados do CTe com as condições e exclusões contidas na apólice informada e decida se o transporte deve ser aprovado ou reprovado.

REGRAS DE COMPARAÇÃO
- Leia TODAS as condições da apólice (bens_mercadorias_excluidas, clausulas_especificas_exclusao, ou outras que possam existir no JSON) e aplique exatamente como descritas.
- Correspondência de mercadorias: sem sensibilidade a maiúsculas/minúsculas/acentos. Considere correspondências por igualdade ou inclusão semântica (ex.: “apple watch” bate com “Relógios”).
- Se QUALQUER condição da apólice for violada, o status é "reprovado".
- Se houver múltiplas violações, liste todas no campo "motivo", separadas por "; ".
- Trate todas as condições com a mesma prioridade (sem hierarquias fixas).
- Compare valores monetários com eventuais limites definidos na apólice.
- Compare embarcadores, trajetos, origem/destino e quaisquer outros critérios que a apólice especifique.
- Aplique regras geográficas somente se a apólice especificar restrições desse tipo (ex.: origem e/ou destino em determinado estado ou município).
- O campo de valor da mercadoria virá sempre como string com ponto decimal.

NORMALIZAÇÃO
- Remova acentos e padronize para minúsculas ao comparar textos.
- Ao lidar com listas de mercadorias da apólice, aplique correspondência semântica quando possível (sinônimos, nomes genéricos vs. nomes específicos).

DADOS DE ENTRADA
CTE:
${JSON.stringify(cteData, null, 2)}

APÓLICE:
${JSON.stringify(excludedGoods, null, 2)}

DECISÃO
1) Leia e interprete todas as condições da apólice.
2) Valide cada campo do CTe (mercadoria, valor, embarcador, origem, destino etc.) contra essas condições.
3) Se encontrar qualquer violação, "reprovado"; caso contrário, "aprovado".
4) Se reprovado, o motivo deve listar todas as condições não atendidas.
5) Se aprovado, o motivo deve indicar que todas as condições da apólice foram atendidas.

SAÍDA
Retorne EXCLUSIVAMENTE um objeto JSON válido:
{
  "status": "aprovado" | "reprovado",
  "motivo": "string explicando todas as violações encontradas ou, se aprovado, o motivo objetivo da aprovação"
}
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

    // // 4. Regras de Gerenciamento de Risco e LMG
    // const riskManagementRules = POLICY_RULES.regras_gerenciamento_de_risco;
    // const riskManagementRulesPrompt = `
    // 1. Compare as informações do CTe com as regras de gerenciamento de risco da apólice.
    // 2. Informações do CTeMercadorias, valor de mercadorias, embarcadores, trajetos de origem e destino do CTe poderão se enquadrar em um "ponto_de_atencao" das regras de gerenciamento de risco da apólice.
    // - Se alguma informação se enquadrar em "ponto_de_atencao", analise sua respectiva "regra"
    // 2) Analise se as informações do CTe se enquadram em alguma "limitacao". Caso se enquadrem:
    // - analise o "valor da mercadoria" do CTe com as regras de "valor_mercadoria" da apólice e retorne:
    // - "status": "atencao"
    // - "motivo": "string explicando o motivo".
    // 3) Se não houver enquadramento:
    //   "status": "aprovado"
    //   "motivo": "string explicando o motivo"
    // 4) Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:
    // {
    //   "status": "aprovado" | "atencao",
    //   "motivo": "string explicando o motivo"
    // }
    // - Não inclua texto adicional, apenas o objeto JSON.

    // INFORMAÇÕES DO CTe PARA VALIDAÇÃO:
    // ${JSON.stringify(cteData, null, 2)}

    // DADOS DE GERENCIAMENTO DE RISCO DA APÓLICE:
    // ${JSON.stringify(riskManagementRules, null, 2)}
    // `;

    // const riskManagementResult = await validateCTeWithAI(
    //   riskManagementRulesPrompt
    // );

    // if (riskManagementResult.status === "atencao") {
    //   results.push({
    //     etapa: "Regras de Gerenciamento de Risco",
    //     status: "atencao",
    //     motivo: `Estre transporte possui alerta em Regras de Gerenciamento de Risco: ${riskManagementResult.motivo}`,
    //     limite_maximo_garantia: riskManagementResult.limite_maximo_garantia,
    //   });
    // } else {
    //   results.push({
    //     etapa: "Regras de Gerenciamento de Risco",
    //     status: "aprovado",
    //     motivo:
    //       "Regras de Gerenciamento de Risco não possui pontos de atenção.",
    //     limite_maximo_garantia: riskManagementResult.limite_maximo_garantia,
    //   });
    // }

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

    // 3. Validação de bens e mercadorias excluídas
    const excludedGoods = POLICY_RULES.bens_mercadorias_excluidas;
    const excludedGoodsPrompt = `
Você é um validador de CTe para gerenciamento de riscos. Compare os dados do CTe com as condições e exclusões contidas na apólice informada e decida se o transporte deve ser aprovado ou reprovado.

REGRAS DE COMPARAÇÃO
- Leia TODAS as condições da apólice (bens_mercadorias_excluidas, clausulas_especificas_exclusao, ou outras que possam existir no JSON) e aplique exatamente como descritas.
- Correspondência de mercadorias: sem sensibilidade a maiúsculas/minúsculas/acentos. Considere correspondências por igualdade ou inclusão semântica (ex.: “apple watch” bate com “Relógios”).
- Se QUALQUER condição da apólice for violada, o status é "reprovado".
- Se houver múltiplas violações, liste todas no campo "motivo", separadas por "; ".
- Trate todas as condições com a mesma prioridade (sem hierarquias fixas).
- Compare valores monetários com eventuais limites definidos na apólice.
- Compare embarcadores, trajetos, origem/destino e quaisquer outros critérios que a apólice especifique.
- Aplique regras geográficas somente se a apólice especificar restrições desse tipo (ex.: origem e/ou destino em determinado estado ou município).
- O campo de valor da mercadoria virá sempre como string com ponto decimal.

NORMALIZAÇÃO
- Remova acentos e padronize para minúsculas ao comparar textos.
- Ao lidar com listas de mercadorias da apólice, aplique correspondência semântica quando possível (sinônimos, nomes genéricos vs. nomes específicos).

DADOS DE ENTRADA
CTE:
{{CTE_JSON}}

APÓLICE:
{{APOLICE_JSON}}

DECISÃO
1) Leia e interprete todas as condições da apólice.
2) Valide cada campo do CTe (mercadoria, valor, embarcador, origem, destino etc.) contra essas condições.
3) Se encontrar qualquer violação, "reprovado"; caso contrário, "aprovado".
4) Se reprovado, o motivo deve listar todas as condições não atendidas.
5) Se aprovado, o motivo deve indicar que todas as condições da apólice foram atendidas.

SAÍDA
Retorne EXCLUSIVAMENTE um objeto JSON válido:
{
  "status": "aprovado" | "reprovado",
  "motivo": "string explicando todas as violações encontradas ou, se aprovado, o motivo objetivo da aprovação"
}
- Não inclua nenhum texto adicional fora do JSON.

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
