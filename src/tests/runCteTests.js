// src/tests/runCteTests.js

import fs from "fs";
import { CTE_SCENARIOS } from "./cteTestScenarios.js";
import { compareCteCompleta } from "../lib/compareCte.js";

console.log("===== Iniciando testes de CTe (validação COMPLETA) =====\n");

async function runAllTests() {
  const allResults = [];

  for (const scenario of CTE_SCENARIOS) {
    console.log(`\n--- Cenário: ${scenario.id} ---`);
    console.log(`Descrição: ${scenario.description}`);
    console.log("Rodando validação...\n");

    try {
      const result = await compareCteCompleta(scenario.cte);

      console.dir(result, { depth: null, colors: true });

      allResults.push({
        id: scenario.id,
        description: scenario.description,
        result,
      });

      console.log(`Status final: ${result.status}`);
      console.log("---------------------------------------------");
    } catch (err) {
      console.error(`Erro ao validar cenário "${scenario.id}":`, err);
      allResults.push({
        id: scenario.id,
        description: scenario.description,
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
