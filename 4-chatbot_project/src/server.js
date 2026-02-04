import express from "express"
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import cors from "cors"
import NodeCache from "node-cache"


const app = express()
const port = 3000;
const cache = new NodeCache()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
  res.send("namashakar duiua")
})
app.post("/llm",async(req,res)=>{
  try {
    const { message,tokenId } = req.body;
    if (!message || !tokenId) {
      return res.status(400).json({
        status: "error",
        error: "Bad Request",
        details: "All content is required.",
      });
    }
    
    const llmResp = await chatWithLLM(message,tokenId)
    return res.status(200).json({
      message:llmResp,
      status:"ok"
      
    })
  } catch (error) {
    console.error("Server Error:", error.message);
    console.log(error)

    // Error Response
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
      details: error.message, 
    });
  }
})

app.listen(port,()=>{
  console.log(`Server is running on port:${port}`)
})






const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function chatWithLLM(userInputData,tokenId) {
  // Safety: limit how many times tools can be called per user query
  let toolIterations = 0;
  const MAX_TOOL_ITERATIONS = 3;

  const baseMsg = [
    {
      role: "system",
      content:
        "You are Yamini, a smart AI assistant. Answer accurately, concisely, and avoid repetition.",
    },
  ];

  const messages = cache.get(tokenId) ?? [...baseMsg]
  // add user messgae
  messages.push({ role: "user", content: userInputData });

  
  while (true) {
    toolIterations++;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      tool_choice: "auto",
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearchTool",
            description:
              "Use this tool when real-time or recent information from the web is required. ",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "string which value data are going to search",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
    });

    const assistantMessage = completion.choices[0].message;
    messages.push(assistantMessage);

    const toolCall = assistantMessage?.tool_calls;
    if (!toolCall) {
      cache.set(tokenId,messages,60*60*24)
      return assistantMessage.content;
    }

    if (toolIterations > MAX_TOOL_ITERATIONS) {
       return "I've searched quite a bit, but I'm hitting my limit. Here is what I know...";
    }

    for (const tool of toolCall) {
      const fnName = tool.function.name;
      const argument = JSON.parse(tool.function.arguments);

      if (fnName === "webSearchTool") {
        const tavilyResult = await webSearchTool(argument);
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

// ********** toolcalling
async function webSearchTool({ query }) {
  return await tvly.search(query);
}