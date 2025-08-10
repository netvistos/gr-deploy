import { isValidXML, parseCTeXML } from "@/lib/xmlParser";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Validar se o request tem um arquivo
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Ler o conteúdo do arquivo
    const fileContent = await file.text();

    // Validação básica do XML
    if (!isValidXML(fileContent)) {
      return NextResponse.json(
        { error: "Arquivo XML inválido ou não é um CTe" },
        { status: 400 }
      );
    }

    // Fazer parse do XML e extrair dados
    const extractedData = await parseCTeXML(fileContent);

    // Retornar dados extraídos
    return NextResponse.json({
      success: true,
      message: "Arquivo processado com sucesso",
      data: extractedData,
    });
  } catch (error) {
    console.error("Erro no upload:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
