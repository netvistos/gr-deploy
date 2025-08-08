import { validateCTeWithAI } from "@/lib/openai-client";
import { generatePolicyPrompt } from "@/lib/policy-rules";

export async function POST(request) {
  try {
    // Pegar dados do CTe do body da requisição
    const { cteData } = await request.json();

    // Validar se dados foram enviados
    if (!cteData) {
      return Response.json(
        { error: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar prompt com regras da apólice
    const policyRules = generatePolicyPrompt();

    // Chamar IA para validação
    const validationResult = await validateCTeWithAI(cteData, policyRules);

    // Log do resultado da validação
    console.log(validationResult);

    // Retornar resultado estruturado
    return Response.json({
      success: true,
      message: "Validação concluída com sucesso",
      validation: validationResult,
      cteInfo: {
        emitente: `${cteData.emitente?.nome || "N/A"} (CNPJ: ${
          cteData.emitente?.cnpj || "N/A"
        })`,
        mercadoria: cteData.mercadoria?.descricao || "N/A",
        valor: cteData.mercadoria?.valor || 0,
        origem: `${cteData.transporte?.origem?.municipio || "N/A"} - ${
          cteData.transporte?.origem?.uf || "N/A"
        }`,
        destino: `${cteData.transporte?.destino?.municipio || "N/A"} - ${
          cteData.transporte?.destino?.uf || "N/A"
        }`,
        informacoesTransporte:
          cteData.transporte?.informacoesTransporte || "N/A",
      },
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
