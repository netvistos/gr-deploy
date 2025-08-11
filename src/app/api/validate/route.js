import { compareCte } from "@/lib/compareCte.js";

export async function POST(request) {
  try {
    // Extrai o objeto cteData do corpo da requisição (front)
    const { cteData } = await request.json();

    // 1. Validação básica: verifica se veio o objeto
    if (!cteData) {
      // Retorna erro 400 se os dados do CTe não forem fornecidos
      return Response.json(
        { status: "erro", motivo: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    // 2. Chama a função de validação sequencial
    const validationResult = await compareCte(cteData);

    // 3. Monta o response conforme o resultado
    if (validationResult.status === "aprovado") {
      // Retorna sucesso
      return Response.json(
        { status: "aprovado", motivo: "CTe validado com sucesso" },
        { status: 200 }
      );
      // Reprovação na regra de negócio
    } else {
      return Response.json(
        { status: "reprovado", motivo: validationResult.motivo },
        { status: 422 }
      );
    }
    // Erro interno
  } catch (error) {
    return Response.json(
      { status: "reprovado", motivo: error.message },
      { status: 500 }
    );
  }
}
