// src/tests/runCteTests.js
import fs from "fs";
import { CTE_SCENARIOS } from "./cteTestScenarios.js";
import { compareCteCompleta } from "../lib/compareCte.js";

console.log("===== Iniciando testes de CTe (validação COMPLETA) =====\n");

function toNumber(n) {
  return typeof n === "number" ? n : Number(n ?? 0);
}

async function runAllTests() {
  const allResults = [];
  let idx = 0;

  for (const scenario of CTE_SCENARIOS) {
    idx += 1;

    // Normaliza estrutura do cenário (aceita cteData, cte, ou objeto já no formato de CTe)
    const cteData = scenario?.cteData || scenario?.cte || scenario;
    const id = scenario?.id || `cenario-${idx}`;

    let description;
    try {
      description =
        scenario?.description ||
        `${cteData?.goods?.name ?? "sem-nome"} (${toNumber(
          cteData?.goods?.value_brl
        )} BRL)`;
    } catch {
      description = "inválido";
    }

    console.log(`\n--- Cenário: ${id} ---`);
    console.log(`Descrição: ${description}`);
    console.log("Rodando validação...\n");

    // Validação rápida de estrutura mínima
    if (!cteData || !cteData.goods) {
      const errMsg = "Cenário inválido: objeto CTe ausente ou sem 'goods'.";
      console.error(errMsg);
      allResults.push({ id, description, error: errMsg });
      console.log("Status final: erro");
      console.log("---------------------------------------------");
      continue;
    }

    try {
      const result = await compareCteCompleta(cteData);

      console.dir(result, { depth: null, colors: true });

      allResults.push({
        id,
        description,
        result,
      });

      console.log(`Status final: ${result.status}`);
      console.log("---------------------------------------------");
    } catch (err) {
      console.error(`Erro ao validar cenário "${id}":`, err);
      allResults.push({
        id,
        description,
        error: err.message,
      });
      console.log("Status final: erro");
      console.log("---------------------------------------------");
    }
  }

  // Salvar arquivo JSON
  const filePath = "./src/tests/cteTestResults.json";
  fs.writeFileSync(filePath, JSON.stringify(allResults, null, 2), "utf-8");
  console.log(`\n📁 Resultados salvos em: ${filePath}`);
  console.log("\n===== Testes finalizados =====");
}

runAllTests();
