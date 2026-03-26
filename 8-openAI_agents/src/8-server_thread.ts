
import {Agent,run,tool, type AgentInputItem} from "@openai/agents"
import {z} from "zod"

const executeSQLTool = tool({
  name: "SQL Execution tool",
  description: "get user query and execute SQL",
  parameters: z.object({
    sql: z.string().describe("the sql query "),
  }),
  execute: async function ({ sql }) {
    console.log(`[SQL]: Execute ${sql}`);
    return "done";
  },
});

const sqlAgent = new Agent({
  name: "SQL expert agent",
  instructions: `You are an expert SQL agent that is specialized in genereating SQL queries as per user request.

    Postgres Schema:
    -- user table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name:  VARCHAR(100) NOT NULL,
        email: VARCHAR(100) UNIQUE NOT NULL,
        created_at: TIMESTAMP DEFAULT NOW()
    );


    `,
  tools: [executeSQLTool],
});

async function main(query: string) {
  const result = await run(sqlAgent, query, {
    conversationId: "conv_69c55a692f0c8196a15d584748103cdc0f4cebbea1872451",
  });
  console.log("AI: ", result.finalOutput);
}

main("hy this is mayur pal").then(() => {
  main("get all user with my name");
});

main("now tell me what was last query i asked?")


/**
 * Instead of creating another vector DB and server where we store conversation for persistency
 * we use conversation api by chatgpt for server persistency
 */