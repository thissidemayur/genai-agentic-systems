import Groq from "groq-sdk"
import readline from "node:readline/promises"
import {tavily} from "@tavily/core"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tavly = tavily({ apiKey: process.env.TAVILY_API_KEY });


async function main() {
  // CLI interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Conversation memory (STATE)
  // This array must contain EVERYTHING the LLM should remember
  const messages = [
    {
      role: "system",
      content: "You are Maya, a smart AI assistant. Answer accurately, concisely, and avoid repetition.",

    },
  ];

  while (true) {
    const userContent = await rl.question("Q: ");

    if (userContent === "bye") {
      break;
    }

    // Add user message to converstation state
    messages.push({
      role: "user",
      content: userContent,
    });

    // Safety: limit how many times tools can be called per user query
    let toolIterations=0
    const MAX_TOOL_ITERATIONS=3;

    while (true) {
        toolIterations++;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearchTool",
              description:
                "Use this tool when real-time or recent information from the web is required.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query for the web",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });


      // Store assistant response in memory
      // This includes either:
      // - a normal answer
      // - or a tool call request
      const assistantMessage = completion.choices[0].message;
      messages.push(assistantMessage);

      const toolCall = assistantMessage.tool_calls;

      // If no tool was requested, this is the FINAL answer
      if (!toolCall) {
        console.log("\nFinal Answer:");
        console.log(assistantMessage.content);
        console.log("────────────────────────────\n");
        break;
      }

      
    //   Saftey check to prevent infinte loop
     if(toolIterations > MAX_TOOL_ITERATIONS) {
        console.log("⚠️ Tool call limit reached. Stopping.");
        break;
     }

    //  executed requested tool 
      for (const tool of toolCall) {
        const fnName = tool.function?.name;
        const args = JSON.parse(tool.function?.arguments);

        if (fnName === "webSearchTool") {
          console.log("🔍 Calling web search...");

          // we execute the tool (llm cannot)
          const tavilyResult = await webSearchTool(args);
          // Convert structured result → plain text
          // LLMs reason better over text than raw JSON
          const plainResult = tavilyResult.results
            .map((post) => post.content)
            .join("\n\n");

          // send toolresult back to llm
          messages.push({
            role: "tool",
            tool_call_id: tool.id,
            name: "webSearchTool",
            content: plainResult,
          });
        }
      }
    }
  }
  rl.close();
}


    
await main()


async function webSearchTool({query}){
    return  await tavly.search(query)
}