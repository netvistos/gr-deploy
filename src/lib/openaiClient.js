import dotenv from "dotenv";
import OpenAI from "openai";

// Carregar variáveis de ambiente
dotenv.config();

// Cliente OpenAI configurado
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função para validar CTe com IA
export async function validateCTeWithAI(userPrompt) {
  try {
    // System prompt com instruções técnicas específicas para a IA
    const systemPrompt = `
    Você é um especialista em validação de conformidade de CTe (Conhecimento de Transporte Eletrônico) com apólices de seguro de transporte.
    Use variações semânticas para validar as informações e siga estritamente as regras organizadas abaixo.
    PADRÕES DE RESPOSTA:
    - Sempre retornar JSON válido conforme orientado.
}`;

    // Enviar prompt para a IA
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        // { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const tokenUsage = {
      prompt_tokens: completion.usage.prompt_tokens,
      completion_tokens: completion.usage.completion_tokens,
    };

    // Token usage
    console.log("Token usage:", tokenUsage);
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
