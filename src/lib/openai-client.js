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
   - SEMPRE normalizar removendo pontuação antes da comparação.
   - Comparar apenas os 14 dígitos numéricos.
   - Exemplo: "32.606.932/0001-79" = "32606932000179".

2 - vigencia:
   - A data do CTe deve estar em "DD/MM/YYYY" (já fornecida nos dados).
   - Extrair data inicial e final da vigência da apólice no texto e validar:
     data_cte >= data_inicial AND data_cte <= data_final (limites inclusivos).

3 - mercadoria_excluida:
   - Usar matching por palavras-chave (não exato), considerar sinônimos (ex.: "celular" ~ "telefone móvel" ~ "smartphone").
   - Regras geográficas: aplicar exclusões específicas APENAS se origem E destino = RJ.

4 - regras_gerenciamento_de_riscos:
   - Normalizar valor da carga removendo formatação ("R$ 40.000,00" → 40000.00).
   - Classificar produto na categoria aplicável (A, B ou específica da apólice) e aplicar os thresholds conforme regras descritas.
   - Exemplos de thresholds: Risco A ≥ 40.000; Risco B ≥ 100.000 (ajuste conforme texto da apólice).

5 - clausula_especifica_de_exclusao:
   - Verificar palavras-chave como "químic", "biológic", "eletromagnét" etc., conforme as cláusulas da apólice.

6 - limite_de_cobertura:
   - SE todas as validações anteriores (3, 4 e 5) estiverem "aprovado" → valor "3.000.000,00".
   - SE qualquer uma for "reprovado" → valor "0,00" (sem cobertura).

PADRÕES DE RESPOSTA:
- Sempre retornar JSON válido.
- Status deve ser SEMPRE "aprovado" ou "reprovado" (strings), nunca booleanos.

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne apenas um objeto json estruturado com os seguintes campos:
{
  cnpj: {
    "status": "aprovado|reprovado",
    "cnpj_cte": "00.000.000/0000-00",
    "cnpj_apolice": "00.000.000/0000-00"
  },

  vigencia: {
    "status": "aprovado|reprovado",
    "data_cte": "01/01/2021",
    "vigencia_apolice": "01/01/2021 - 01/01/2022"
  },

  mercadoria_excluida: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da exclusão"
  },

  regras_gerenciamento_de_riscos: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da reprovação"
  },

  clausula_especifica_de_exclusao: {
    "status": "aprovado|reprovado",
    "motivo": "N/A|motivo da reprovação"
  },

  limite_de_cobertura: {
    "status": "aprovado|reprovado",
    "valor": "0,00|3.000.000,00"
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
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.0, // ajustado para consistência
      response_format: { type: "json_object" },
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
