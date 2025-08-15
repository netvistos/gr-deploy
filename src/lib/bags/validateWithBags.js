import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { POLICY_RULES } from "../policyRules.js";
import { buildSemanticValidationPrompt } from "./semanticPrompt.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const policyBagsPath = path.join(__dirname, "policyBags.json");
const policyBags = JSON.parse(fs.readFileSync(policyBagsPath, "utf-8"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function validateWithBags(cteData) {
  const prompt = buildSemanticValidationPrompt(
    cteData,
    POLICY_RULES,
    policyBags
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}
