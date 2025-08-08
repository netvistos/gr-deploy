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
• Analise TODOS os dados do CTe fornecidos
• Compare rigorosamente com TODAS as regras da apólice
• Avalie se os DADOS DO EMITENTE compatíveis
• Avalie se os dados do CTe se enquadra em alguma CONDIÇÃO PARA EXCLUSÃO DE BENS OU MERCADORIAS
• Avalie se os dados do CTe se enquadra em alguma CLÁUSULA ESPECÍFICA DE EXCLUSÃO
• Avalie se os dados do CTe se enquadra em alguma REGRAS DE GERENCIAMENTO DE RISCOS
• Se a mercadoria não se enquadra em nenhuma condição específica anterior, avalie se o valor da mercadoria está dentro do LIMITE DE COBERTURA

IMPORTANTE: Você DEVE retornar sua resposta exclusivamente em formato json válido.

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne apenas um objeto json estruturado com os seguintes campos:
{
  "emitente": {
    "cnpj": "aprovado|reprovado",
    "nome": "aprovado|reprovado",
    "vigencia": "aprovado|reprovado"
  },
  "mercadoria_excluida": {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  },
  "regras_de_gerencia_de_riscos": {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  },
  "limite_de_cobertura": {
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
