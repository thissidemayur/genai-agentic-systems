import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.LOCAL_LLM_URL,
});

const response = await client.responses.create({
  model: "ai/llama3.2:3B-Q4_0",
  input: [
    {
      role: "system",
      content: "You are a helpful assistant. Keep answers short.",
    },
    {
      role: "user",
      content: "What is Docker in one sentence?",
    },
  ],
});

console.log("🤖 Response:", response.output_text);
console.log("📊 Tokens used:", response.usage?.total_tokens);