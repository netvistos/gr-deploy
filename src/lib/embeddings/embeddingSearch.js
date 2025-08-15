// src/lib/embeddings/embeddingSearch.js
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Calcula similaridade de cosseno
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

// Busca top K regras mais parecidas
async function findMostSimilar(queryText, topK = 5) {
  const embeddingsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "policyEmbeddings.json"), "utf8")
  );

  const queryEmbedding = (
    await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: queryText,
    })
  ).data[0].embedding;

  const results = embeddingsData
    .map((rule) => ({
      ...rule,
      similarity: cosineSimilarity(queryEmbedding, rule.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}

// Teste rápido
(async () => {
  const testTerms = [
    "taco de golfe",
    "chuteira de futebol",
    "raquete de tênis",
    "relógio oakley",
  ];

  for (const term of testTerms) {
    const matches = await findMostSimilar(term, 3);
    console.log(`\n🔍 Termo: "${term}"`);
    matches.forEach((m) =>
      console.log(` - ${m.text} | Similaridade: ${m.similarity.toFixed(4)}`)
    );
  }
})();
