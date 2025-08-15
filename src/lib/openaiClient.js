import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function validateCTeWithAI(userPrompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: userPrompt }],
      // temperature: 0.0, // validação estável
      response_format: { type: "json_object" },
    });

    // Calculate costs based on GPT-5 pricing
    const inputCostPer1M = 1.25; // $1.25 per 1M input tokens
    const outputCostPer1M = 10.0; // $10.00 per 1M output tokens
    const usdToBrl = 5.42; // Exchange rate: 1 USD = 5.42 BRL

    const inputCost =
      (completion.usage.prompt_tokens / 1000000) * inputCostPer1M;
    const outputCost =
      (completion.usage.completion_tokens / 1000000) * outputCostPer1M;
    const totalCost = inputCost + outputCost;

    // Convert to BRL
    const inputCostBRL = inputCost * usdToBrl;
    const outputCostBRL = outputCost * usdToBrl;
    const totalCostBRL = totalCost * usdToBrl;

    // Log total tokens consumed and costs
    console.log(`Total tokens consumed: ${completion.usage.total_tokens}`);
    console.log(`Prompt tokens: ${completion.usage.prompt_tokens}`);
    console.log(`Completion tokens: ${completion.usage.completion_tokens}`);
    console.log(`--- COST BREAKDOWN ---`);
    console.log(
      `Input cost: $${inputCost.toFixed(6)} / R$ ${inputCostBRL.toFixed(6)} (${
        completion.usage.prompt_tokens
      } tokens)`
    );
    console.log(
      `Output cost: $${outputCost.toFixed(6)} / R$ ${outputCostBRL.toFixed(
        6
      )} (${completion.usage.completion_tokens} tokens)`
    );
    console.log(
      `Total cost: $${totalCost.toFixed(6)} / R$ ${totalCostBRL.toFixed(6)}`
    );

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error("Resposta vazia da OpenAI");
    return JSON.parse(response);
  } catch (error) {
    console.error("Erro na validação com IA:", error);
    throw new Error(`Falha na validação: ${error.message}`);
  }
}
