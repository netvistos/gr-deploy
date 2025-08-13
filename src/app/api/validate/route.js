import { compareCteCompleta } from "@/lib/compareCte.js";

export async function POST(request) {
  try {
    // Extrai o objeto cteData do corpo da requisição (front)
    const { cteData, mode } = await request.json();

    // 1. Validação básica: verifica se veio o objeto
    if (!cteData) {
      // Retorna erro 400 se os dados do CTe não forem fornecidos
      return Response.json(
        { status: "erro", motivo: "Dados do CTe são obrigatórios" },
        { status: 400 }
      );
    }

    // 2. Chama a função de validação sequencial ou completa
    let validationResult;
    if (mode === "sequencial") {
      validationResult = await compareCteSequencial(cteData);
    } else {
      validationResult = await compareCteCompleta(cteData);
    }

    // 3. Resposta flexível para ambos os modos
    return Response.json(validationResult, { status: 200 });
  } catch (error) {
    return Response.json(
      { status: "erro", motivo: error.message },
      { status: 500 }
    );
  }
}
