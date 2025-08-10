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
Use variações semânticas para validar as informações e siga estritamente as regras organizadas abaixo.

INSTRUÇÕES TÉCNICAS DETALHADAS:

3 - mercadoria:
   - nome: nome exato da mercadoria sendo transportada pelo CTe
   - valor: valor da mercadoria no formato "R$ 30.100,00"

4 - mercadoriasExcluidas:
  - comparar dados do CTe com "mercadoriasExcluidas" da apólice.
   - este é um grupo de mercadorias que estarão excluídos da cobertura da apólice caso uma "regra" seja atendida. "regras" são as condições que definem quais itens estão excluídos e "mercadorias" são as mercadorias que estão proibidas.
   - status: "aprovado" -> caso os dados do transporte (CTe) não estejam incluso em nenhuma condições (1,2,3), considerando suas respectivas "regras" e "mercadorias".
   - motivo: "N/A" -> caso status seja "aprovado"
   - "reprovado" -> caso haja alguma condição (1, 2 ou 3) e sua respectiva "regra" e "mercadoria" reprovada ao comparar com os dados do CTe.
   - motivo: Breve descrição do motivo da reprovação, mencionando a "regra" e a "mercadoria" que causaram a reprovação.

5 - regrasDeGerenciamentoDeRisco:

   - comparar dados do CTe com "regrasDeGerenciamentoDeRisco" da apólice.
   - status: "não se aplica" -> caso os dados do CTe não se enquadrem em nenhuma condicao (1, 2, 3 ... 10) da apólice.
   - motivo: "N/A" -> caso não haja motivo para reprovação.
   - "reprovado" -> caso haja alguma condição (1, 2, 3 ou 4) reprovada ao comparar com os dados do CTe.
   - motivo: Breve descrição do motivo da reprovação.

PADRÕES DE RESPOSTA:
- Sempre retornar JSON válido.
- Status deve ser SEMPRE "aprovado" ou "reprovado" (strings), nunca booleanos.

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne apenas um objeto json estruturado com os seguintes campos:
{
  mercadoria: {
    "nome": "Nome da mercadoria",
    "valor": "R$ 30.100,00",
  },

  mercadoriasExcluidas: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  },

  regrasDeGerenciamentoDeRisco: {
    "status": "não se aplica|ponto de atenção",
    "obrigatoriedade": "N/A|motivo da reprovação"
  }

}`;

    // User prompt com dados específicos
    const userPrompt = `
DADOS DO CTe PARA VALIDAÇÃO:
${JSON.stringify(cteData, null, 2)}

REGRAS DA APÓLICE DE SEGURO:
${JSON.stringify(policyRules, null, 2)}

Por favor, execute a validação completa seguindo as instruções do sistema e retorne EXCLUSIVAMENTE uma resposta em formato json válido com a estrutura especificada. Não inclua texto adicional, apenas o objeto json.
`;

    // User prompt test
    console.log("Prompt enviado para IA:", userPrompt);

    // Enviar prompt para a IA
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
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
