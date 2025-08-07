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

INSTRUÇÕES TÉCNICAS:
• Analise TODOS os dados do CTe fornecidos
• Compare rigorosamente com TODAS as regras da apólice
• Identifique violações específicas com base nas regras
• Classifique mercadorias por categoria de risco (A, B, específicas)
• Verifique restrições geográficas, de valor e de veículo
• Responda EXCLUSIVAMENTE em JSON válido
• Seja preciso e detalhado nas explicações
• Use valores exatos das regras nas comparações

FORMATO DE RESPOSTA OBRIGATÓRIO:
{
  "conforme": boolean,
  "violacoes": ["lista específica de violações encontradas"],
  "explicacao": "análise detalhada da validação",
  "categoria_risco": "A" | "B" | "específica" | "não_classificada",
  "valor_limite_excedido": boolean,
  "restricoes_geograficas": ["lista de restrições de local"],
  "obrigatoriedades_requeridas": ["lista de requisitos de segurança"],
  "detalhes_mercadoria": {
    "nome": "nome da mercadoria",
    "valor": "valor em reais",
    "categoria": "categoria identificada"
  }
}`;

    // User prompt com dados específicos
    const userPrompt = `
DADOS DO CTe PARA VALIDAÇÃO:
${JSON.stringify(cteData, null, 2)}

REGRAS DA APÓLICE DE SEGURO:
${policyRules}

Execute a validação completa seguindo as instruções do sistema.`;

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

// Função para testar conexão OpenAI
export async function testOpenAIConnection() {
  try {
    // Teste simples de conexão
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "user",
          content: 'Teste de conexão - responda apenas "OK"',
        },
      ],
      max_tokens: 5,
    });

    const response = completion.choices[0]?.message?.content;
    return response && response.trim() === "OK";
  } catch (error) {
    console.error("Erro na conexão OpenAI:", error.message);
    return false;
  }
}
