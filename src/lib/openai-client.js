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

1 - cnpj:
   - Comparar apenas os 14 dígitos numéricos.
   - Exemplo: "32.606.932/0001-79" = "32606932000179".
   - SEMPRE normalizar removendo pontuação antes da comparação.
   - Status: "aprovado": caso o CNPJ do CTe corresponda ao CNPJ da apólice.
   - Status: "reprovado": caso contrário.
   - cnpjCte: cnpj fornecido no CTe.
   - cnpjApolice = fixo, cnpj fornecido na apólice.

2 - vigencia:
   - dataCte = A data extraída do CTe e deve estar em "DD/MM/YYYY" (já fornecida nos dados).
   - dataApolice = fixo, vigência fornecida na apólice "19/10/2024 até 31/10/2026"
   - Status "aprovado" se: dataCte >= dataInicial AND dataCte <= dataFinal (limites inclusivos).
   - Status "reprovado" caso contrário.

3 - mercadoriaExcluida:
   - comparar dados do CTe com "bensOuMercadoriasExcluidas" da apólice.
   - status: "aprovado" -> caso todas as condições (1, 2, 3) estejam aprovadas ao comparar com os dados do CTe.
   - motivo: "N/A" -> caso não haja motivo para reprovação.
   - "reprovado" -> caso haja alguma condição (1, 2 ou 3) reprovada ao comparar com os dados do CTe.
   - motivo: Breve descrição do motivo da reprovação.

4 - regrasDeGerenciamentoDeRisco:
   - comparar dados do CTe com "regrasDeGerenciamentoDeRisco" da apólice.
   - status: "aprovado" -> caso todas as condições (1, 2, 3,... 10) estejam aprovadas ao comparar com os dados do CTe.
   - motivo: "N/A" -> caso não haja motivo para reprovação.
   - "reprovado" -> caso haja alguma condição (1, 2, 3 ou 4) reprovada ao comparar com os dados do CTe.
   - motivo: Breve descrição do motivo da reprovação.

PADRÕES DE RESPOSTA:
- Sempre retornar JSON válido.
- Status deve ser SEMPRE "aprovado" ou "reprovado" (strings), nunca booleanos.

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne apenas um objeto json estruturado com os seguintes campos:
{
  cnpj: {
    "status": "aprovado|reprovado",
    "cnpjCte": "00.000.000/0000-00",
    "cnpjApolice": "13.657.062/0001-12"
  },

  vigencia: {
    "status": "aprovado|reprovado",
    "dataCte": "01/01/2021",
    "vigenciaApolice": "19/10/2024 até 31/10/2026"
  },

  mercadoriaExcluida: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  },

  regrasDeGerenciamentoDeRisco: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da reprovação"
  }

}`;

    // User prompt com dados específicos
    const userPrompt = `
DADOS DO CTe PARA VALIDAÇÃO:
${JSON.stringify(cteData, null, 2)}

REGRAS DA APÓLICE DE SEGURO:
${policyRules}

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
