import { validateCTeWithAI } from "@/lib/openai-client";
import { POLICY_RULES } from "@/lib/policyRules";
import { formatDataForAI } from "@/lib/xmlParser"; // novo

export async function POST(request) {
  try {
    const { cteData } = await request.json();
    if (!cteData) {
      return Response.json(
        { error: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    // Padroniza os dados antes de ir para a IA
    const aiInput = formatDataForAI(cteData);

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
