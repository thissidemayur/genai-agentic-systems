// it store previous chat
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: `${process.env.LOCAL_LLM_URL}/engines/v1`,
});

// In Memory
const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a helpful assistant. Keep answers short.",
  },
];

async function chat(userMsg:string) {
  // Add userMsg to history
  messages.push({
    role: "user",
    content: userMsg,
  });

  // send full history to LLM
  const stream = await client.chat.completions.create({
    model: "ai/llama3.2:3B-Q4_0",
    messages: messages,
    stream: true,
  });

  // collect full replay
  let fullReplay = "";
  for await (const chunk of stream) {
    const word = chunk.choices[0]?.delta.content ?? "";
    process.stdout.write(word);
    fullReplay += word;
  }
  console.log("\n");

  // save assistant replay to history
  messages.push({
    role:"assistant",
    content:fullReplay
  })
}

console.log("You: My name is Ali and I use Bun with TypeScript.");
await chat("My name is Ali and I use Bun with TypeScript.");

