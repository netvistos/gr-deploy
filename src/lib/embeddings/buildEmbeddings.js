// src/lib/embeddings/buildEmbeddings.js
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { POLICY_RULES } from "../policyRules.js"; // ajusta o caminho relativo conforme seu projeto
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large", // usamos large
    input: text,
  });
  return embedding.data[0].embedding;
}

async function buildPolicyEmbeddings() {
  const embeddingsData = [];

  for (const rule of POLICY_RULES.exclusions) {
    // Garante que criteria seja array de objetos com "value"
    const criteriaValues = Array.isArray(rule.criteria)
      ? rule.criteria.map((c) => c.value || "")
      : [];

    const textForEmbedding = [rule.title, ...criteriaValues]
      .filter(Boolean) // remove strings vazias
      .join(" - ");

    embeddingsData.push({
      id: rule.id,
      text: textForEmbedding,
      embedding: await generateEmbedding(textForEmbedding),
    });
  }

  const outputPath = path.join(__dirname, "policyEmbeddings.json");
  fs.writeFileSync(outputPath, JSON.stringify(embeddingsData, null, 2));

  console.log(`✅ Policy embeddings saved to: ${outputPath}`);
}

buildPolicyEmbeddings();
