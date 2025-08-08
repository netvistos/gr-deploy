import dotenv from "dotenv";
import OpenAI from "openai";

// Carregar variáveis de ambiente
dotenv.config();

// Cliente OpenAI configurado
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função para validar CTe com IA
export async function validateCTeWithAI(cteData, policyRules) {
  try {
    // System prompt com instruções técnicas específicas para a IA
    const systemPrompt = `
Você é um especialista em validação de conformidade de CTe (Conhecimento de Transporte Eletrônico) com apólices de seguro de transporte.
Use variações semânticas para validar as informações.

INSTRUÇÕES TÉCNICAS:
1 - cnpj: Validar se o CNPJ do CTe é o mesmo do CNPJ da apólice.
2 - vigencia: Validar se a vigência do CTe está dentro da vigência da apólice.
3 - mercadoria_excluida: Validar se a mercadoria do CTe está excluída da apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na "regra" e "mercadoria" correspondente da apólice.
4 - regras_gerenciamento_de_riscos: Validar se as informações do CTe estão fora às regras de gerenciamento de riscos da apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.
5 - clausula_especifica_de_exclusao: Validar se a clausula específica de exclusão do CTe está aplicável à apólice. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.
6 - limite_de_cobertura: Se as mercadoridas tiverem status "aprovado" nas regras 3, 4, 5: o valor padrão de garantia será de R$3.000.000,00 . Caso contrário, seu limite de cobertura será o valor informado na apólice a partir do seu enquadramento em regras_gerencia_de_riscos. Se sim, seu status deve ser "reprovado" e você deve justificar o "motivo" com base na condição/ regra que foi violada.

IMPORTANTE: Você DEVE retornar sua resposta exclusivamente em formato json válido.

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne apenas um objeto json estruturado com os seguintes campos:
{
  cnpj: {
    "status": "aprovado|reprovado",
    "cnpj_cte": "00.000.000/0000-00",
    "cnpj_apolice": "00.000.000/0000-00",
  }

  vigencia: {
    "status": "aprovado|reprovado",
    "data_cte": "01/01/2021",
    "vigencia_apolice": "01/01/2021 - 01/01/2022",
  }

  mercadoria_excluida: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  }

  regras_gerencia_de_riscos: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  }

  clausula_especifica_de_exclusao: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  }

  limite_de_cobertura: {
    "status": "aprovado|reprovado",
    "valor": "valor da regra|3.000.000,00"
  }
}`;

    // User prompt com dados específicos
    const userPrompt = `
DADOS DO CTe PARA VALIDAÇÃO:
${JSON.stringify(cteData, null, 2)}

REGRAS DA APÓLICE DE SEGURO:
${policyRules}

Por favor, execute a validação completa seguindo as instruções do sistema e retorne EXCLUSIVAMENTE uma resposta em formato json válido com a estrutura especificada. Não inclua texto adicional, apenas o objeto json.`;

    // Enviar prompt para a IA
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.1, // Baixa temperatura para respostas mais consistentes
      response_format: { type: "json_object" }, // Força resposta em JSON
    });

    // Extrair resposta da IA
    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("Resposta vazia da OpenAI");
    }

    // Tentar fazer parse do JSON
    try {
      const result = JSON.parse(response);
      return result;
    } catch (parseError) {
      throw new Error(`Erro ao fazer parse da resposta: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Erro na validação com IA:", error);
    throw new Error(`Falha na validação: ${error.message}`);
  }
}
