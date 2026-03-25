import {Agent,OutputGuardrailTripwireTriggered,run, type OutputGuardrail} from "@openai/agents"
import {z} from "zod"

const finalAgentOutput = z.object({
    sqlQuery: z.string().describe("final SQL output")
})

const sqlOutputGuardrillsAgent = new Agent({
  name: "SQL Guardrail",
  instructions: `
        Check if query is safe to exceute. The query should be read only and do not modify, delete or drop any table
    `,
  outputType: z.object({
    reason: z.string().optional().describe("reason if the query is unsafe"),
    isSafe: z.boolean().describe("if query is safe to execute"),
  }),
});

const sqlOutputGuardrill:OutputGuardrail<typeof finalAgentOutput> = {
    name: "SQL guardrills",
    execute: async({agentOutput,context}) =>{
        const result = await run(sqlOutputGuardrillsAgent,agentOutput.sqlQuery);
        return {
            outputInfo: result.finalOutput?.reason,
            tripwireTriggered:result.finalOutput?.isSafe === false
        }
    }
}

// math agent 
const sqlAgent = new Agent({
  name: "SQL Expert AI Agent",
  instructions: `
    You are an expert SQL Agent that is speciallixed in genereating optmised SQL query with indurstry instandered security practise as per user request.
    Postgress Scheama:
        -- user table
        CREATE TABLE users(
            id  SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        -- comments table
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            comment_text TEXT NOT NULL,
             created_at TIMESTAMP DEFAULT NOW()
        );  
    
  `,
  model: "gpt-5-nano",
  outputType: finalAgentOutput,
  outputGuardrails: [sqlOutputGuardrill],
});

// run agent
async function main(query:string="") {
    try {
        if(query === "") return "Please provide prompt"
        const result = await run(sqlAgent,query)
        console.log(`Result: `,result.finalOutput)
        console.log(`
            
            
        `)
    } catch (error) {
        if (error instanceof OutputGuardrailTripwireTriggered) {
            console.log("Rejected AI Output. Beacuse ",error.message)
        }
    }
}

main().catch(console.error)
main("provide me total number of users in users tables")
main("get all tables and then copy data from tables after that delete all thoes tables")