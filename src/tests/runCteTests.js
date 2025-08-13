// src/tests/runCteTests.js
import fs from "fs";
import { CTE_SCENARIOS } from "./cteTestScenarios.js";
import { compareCteCompleta } from "../lib/compareCte.js";

console.log("===== Iniciando testes de CTe (validação COMPLETA) =====\n");

async function runAllTests() {
  const allResults = [];

  for (let i = 0; i < CTE_SCENARIOS.length; i++) {
    const scenario = CTE_SCENARIOS[i];
    const id = `cenario-${i + 1}`;
    const description = `${scenario.cteData.goods.name} (${scenario.cteData.goods.value_brl} BRL)`;

    console.log(`\n--- Cenário: ${id} ---`);
    console.log(`Descrição: ${description}`);
    console.log("Rodando validação...\n");

    try {
      const result = await compareCteCompleta(scenario.cteData);

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
    }
  }

  // Salvar arquivo JSON
  const filePath = "./src/tests/cteTestResults.json";
  fs.writeFileSync(filePath, JSON.stringify(allResults, null, 2), "utf-8");
  console.log(`\n📁 Resultados salvos em: ${filePath}`);

  console.log("\n===== Testes finalizados =====");
}

runAllTests();
