import { validateCTeWithAI } from "@/lib/openai-client";
import { POLICY_RULES } from "@/lib/policyRules";
import { formatDataForAI } from "@/lib/xmlParser"; // novo
import { normalizeCNPJ, isDateWithinPolicy } from './validateCTe';


export async function POST(request) {
  try {
    const { cteData } = await request.json();
    
    // Verifica se os dados do CTe foram fornecidos
    if (!cteData) {
      return Response.json(
        { error: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    // Validações if/else sequenciais
    async function cteValidator(cteData) {

      // TODO: implementar try catch

      // 1. Validação do CNPJ
      const cnpjXML = normalizeCNPJ(cteData.emitente.cnpj);
      const cnpjPolicy = normalizeCNPJ(POLICY_RULES.emitente.cnpj);
      if (cnpjXML !== cnpjPolicy) {
        return { aprovado: false, motivo: "CNPJ do emitente não autorizado pela apólice.", campo: "cnpj" };
      }

      // 2. Validação da data
      const transportDate = cteData.dataTransporte;
      const coverStart = POLICY_RULES.emitente.vigencia.inicio;
      const coverEnd = POLICY_RULES.emitente.vigencia.fim;
      if (!isDateWithinPolicy(transportDate, coverStart, coverEnd)) {
        return { aprovado: false, motivo: "Data do transporte fora do período de vigência da apólice.", campo: "data" };
      }

      // Inicio de validação com IA
      const cteDataForAI = formatDataForAI(cteData);

      // 3. Validação de bens e mercadorias excluídas
      const excludedGoods = POLICY_RULES.bens_mercadorias_excluidas;
      const userPrompt = `
      Compare as mercadorias do CTe com a lista de mercadorias excluídas da apólice.
      Se houver qualquer mercadoria excluída, reprove e detalhe o motivo.
      Retorne EXCLUSIVAMENTE um objeto JSON válido com a estrutura:
      {
        "status": "aprovado" | "reprovado",
        "motivo": "string explicando o motivo"
      }
      Não inclua texto adicional, apenas o objeto json.

      DADOS DO CTe PARA VALIDAÇÃO:
      ${JSON.stringify(cteData, null, 2)}

      LISTA DE MERCADORIAS EXCLUÍDAS:
      ${JSON.stringify(excludedGoods, null, 2)}

      `;
      const excludedGoodsResult = await validateCTeWithAI(userPrompt);

      if(excludedGoodsResult.status === "reprovado") {
        return {
          aprovado: false,
          motivo: `Mercadoria excluída da apólice: ${excludedGoodsResult.motivo}`,
        };
      }

      // 4. Regras de Gerenciamento de Risco


      /*
      Preparação de dados para validação com IA:

      - Mercadoria {
          nome: extractedData.mercadoria.nome,
          valor: extractedData.mercadoria.valor
      }

      
      - Origem { 
        cidade: extractedData.origem.cidade,
        estado: extractedData.origem.estado
        }
        - Destino {
          cidade: extractedData.destino.cidade,
          estado: extractedData.destino.estado
          }
          
          
          - Dados do Embarcador: {
            nome: extractedData.emitente.nome,
            cnpj: extractedData.emitente.cnpj
            }
            
            -> mapping de "RJ -> Rio de Janeiro" <-
      -> arrumar apólice com dados do veículo transportador <-
      */


      // 5. Validação de regras

    }


    
    // Chamada para validação com OpenAI
    const validationResult = await validateCTeWithAI(aiInput, POLICY_RULES);

    // Retornar resultado estruturado
    return Response.json({
      success: true,
      message: "Validação concluída com sucesso",
      validation: validationResult
    });
  } catch (error) {
    console.error("Erro na validação:", error);

    return Response.json(
      {
        error: "Erro interno na validação",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
