import fs from "fs";
import path from "path";
import { parseCTeXML } from "./xmlParser.js";

async function testParser() {
  const xmlPath = path.resolve("files", "teste1.xml"); // Troque pelo arquivo desejado
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");

  try {
    const parsed = await parseCTeXML(xmlContent);
    console.log("Resultado do parser:", parsed);
    // Teste campos críticos
    console.log("Origem:", parsed.origem);
    console.log("Destino:", parsed.destino);
  } catch (error) {
    console.error("Erro ao testar parser:", error);
  }
}

testParser();
