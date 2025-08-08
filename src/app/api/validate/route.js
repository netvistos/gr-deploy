import { validateCTeWithAI } from "@/lib/openai-client";
import { generatePolicyPrompt } from "@/lib/policy-rules";
import { formatDataForAI } from "@/lib/xml-parser"; // novo

export async function POST(request) {
  try {
    const { cteData } = await request.json();
    if (!cteData) {
      return Response.json(
        { error: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    const policyRules = generatePolicyPrompt();

    // Padroniza os dados antes de ir para a IA
    const aiInput = formatDataForAI(cteData);

    const validationResult = await validateCTeWithAI(aiInput, policyRules);

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
