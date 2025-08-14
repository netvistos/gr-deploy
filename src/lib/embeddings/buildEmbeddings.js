// src/scripts/buildEmbeddings.js
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { POLICY_RULES } from "../../lib/policyRules.js";

// Corrige __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return embedding.data[0].embedding;
}

async function buildPolicyEmbeddings() {
  const embeddingsData = [];

  for (const rule of POLICY_RULES.exclusions) {
    const textForEmbedding = [
      rule.title,
      ...(rule.criteria?.map((c) => c.value) || []),
    ].join(" - ");

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
