import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.LOCAL_LLM_URL,
});

const stream = await client.responses.create({
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
  stream: true,
});

for await (const event of stream) {
  switch (event.type) {
    case "response.output_text.delta":
      process.stdout.write(event.delta);
      break;

    case "response.created":
      console.log("--- Response Started ---");
      break;

    case "response.completed":
      console.log("\n--- Response Completed ---");
      console.log("Model use: ", event.response.model);
      break;

    case "error":
      console.error("Stream Error: ", event.message);
  }
}
