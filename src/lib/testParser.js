import fs from "fs";
import path from "path";
import { parseCTeXML } from "./xmlParser.js";

async function testParser() {
  const xmlPath = path.resolve("files", "teste1.xml");
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");

  try {
    const parsed = await parseCTeXML(xmlContent);
    console.log("Resultado do parser:", parsed);
    console.log("Origin:", parsed.origin);
    console.log("Destination:", parsed.destination);
    console.log("Goods:", parsed.goods);
  } catch (error) {
    console.error("Erro ao testar parser:", error);
  }
}

testParser();
