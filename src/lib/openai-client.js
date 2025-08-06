import dotenv from 'dotenv';
import OpenAI from 'openai';

// Carregar variáveis de ambiente
dotenv.config();

// Cliente OpenAI configurado
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função para validar CTe com IA
export async function validateCTeWithAI(cteData, policyRules) {
  try {
    // Prompt estruturado para a IA
    const prompt = `
ANALISE OS DADOS DO CTe E COMPARE COM AS REGRAS DA APÓLICE:

DADOS DO CTe:
${JSON.stringify(cteData, null, 2)}

REGRAS DA APÓLICE:
${policyRules}

RESPONDA EM JSON COM A SEGUINTE ESTRUTURA:
{
  "conforme": true/false,
  "violacoes": ["lista de violações encontradas"],
  "explicacao": "explicação detalhada da validação",
  "riscos": {
    "riscoA": ["mercadorias de risco A"],
    "riscoB": ["mercadorias de risco B"]
  }
}
`;

    // Enviar prompt para a IA
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content:
            'Você é um especialista em análise de conformidade de CTe com apólices de seguro. Analise os dados e responda APENAS em JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1, // Baixa temperatura para respostas mais consistentes
    });

    // Extrair resposta da IA
    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('Resposta vazia da OpenAI');
    }

    // Tentar fazer parse do JSON
    try {
      const result = JSON.parse(response);
      return result;
    } catch (parseError) {
      throw new Error(`Erro ao fazer parse da resposta: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Erro na validação com IA:', error);
    throw new Error(`Falha na validação: ${error.message}`);
  }
}

// Função para testar conexão OpenAI
export async function testOpenAIConnection() {
  try {
    // Teste simples de conexão
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'user',
          content: 'Teste de conexão - responda apenas "OK"',
        },
      ],
      max_tokens: 5,
    });

    const response = completion.choices[0]?.message?.content;
    return response && response.trim() === 'OK';
  } catch (error) {
    console.error('Erro na conexão OpenAI:', error.message);
    return false;
  }
}
