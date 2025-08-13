import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Regras comuns aplicadas em todos os prompts.
 */
const COMMON_RULES = `\
Você é um validador de CTe (Conhecimento de Transporte Eletrônico) que aplica regras de apólice de seguro.

Diretrizes gerais:
- NÃO reavalie CNPJ e datas (já validados fora desta etapa).
- Compare SEMANTICAMENTE apenas os campos textuais relevantes da etapa atual (mercadoria, embarcador, origem/destino).
- Para comparações semânticas:
  * Considere sinônimos, hipônimos, hiperônimos, plurais, abreviações e variações ortográficas.
  * Correspondência deve ter base clara no texto do CTe ou nas regras da apólice.
  * NÃO crie equivalências sem suporte explícito (ex.: não assumir que "bateria" é "peça de veículo elétrico" sem menção direta).
- A descrição completa da mercadoria está em goods.name (pode conter marca, modelo, tipo e finalidade).
- Sempre use os IDs de regras da apólice no campo matched_rule_ids para justificar enquadramentos.
- A saída deve ser EXCLUSIVAMENTE o JSON no formato solicitado, sem texto extra.
`;

export async function validateCTeWithAI(userPrompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: COMMON_RULES },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2, // validação estável
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error("Resposta vazia da OpenAI");
    return JSON.parse(response);
  } catch (error) {
    console.error("Erro na validação com IA:", error);
    throw new Error(`Falha na validação: ${error.message}`);
  }
}
