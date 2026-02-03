import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  // This array is THE conversation memory.
  // Every request must include EVERYTHING that happened so far.
  const messages = [
    {
      role: "system",
      content:
        "You are a smart personal assistant who answers the asked questions efficiently, precisely and briefly",
    },
    {
      role: "user",
      content: "What is current weather of phagwara, Punjab",
    },
  ];

  // First LLM call
  // The model may either:
  // 1. Answer directly
  // 2. Ask for a tool (webSearchTool)
  const chatCompletion = await groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "webSearchTool",
          description:
            "Search the latest information and realtime data on the web",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  // VERY IMPORTANT:
  // We append the assistant message so the next request
  // knows what the model already said or requested
  messages.push(chatCompletion.choices[0].message);

  const toolCalls = chatCompletion.choices[0].message.tool_calls;

  // If the model DID NOT request any tool,
  // it already answered → we stop here
  if (!toolCalls) {
    console.log("LLM without tool:", chatCompletion.choices[0].message.content);
    return;
  }

  // If the model DID request tools,
  // we must execute them manually
  for (const tool of toolCalls) {
    const fnName = tool.function.name;
    const args = JSON.parse(tool.function.arguments);

    if (fnName === "webSearchTool") {
      // YOU call Tavily (LLM cannot)
      const tavilyOutput = await webSearchTool(args);

      // Convert Tavily JSON → plain text
      // LLMs reason best on text, not raw JSON
      const textOutput = tavilyOutput.results
        ?.map((res) => res.content)
        .join("\n\n");

      // Send tool result BACK to the LLM
      messages.push({
        role: "tool",
        tool_call_id: tool.id,
        name: "webSearchTool",
        content: textOutput,
      });
    }
  }

  // Second LLM call
  // Now the model:
  // - sees the original question
  // - sees its own tool request
  // - sees Tavily's results
  // → can now produce the FINAL answer
  const chatCompletion2 = await groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    messages,
  });

  console.log("Final Answer:", chatCompletion2.choices[0].message);
}

await main();

async function webSearchTool({ query }) {
  return await tvly.search(query);
}
