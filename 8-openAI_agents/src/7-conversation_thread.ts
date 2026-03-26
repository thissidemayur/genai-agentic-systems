import {Agent,run,tool, type AgentInputItem} from "@openai/agents"
import {z} from "zod"

let sharedHistory:AgentInputItem[] = []

const executeSQLTool = tool({
    name:"SQL Execution tool",
    description:"get user query and execute SQL",
    parameters:z.object({
        sql:z.string().describe("the sql query ")
    }),
    execute:async function ({sql}) {
        console.log(`[SQL]: Execute ${sql}`);
        return 'done'
    }
})

const sqlAgent = new Agent({
    name:"SQL expert agent",
    instructions:`You are an expert SQL agent that is specialized in genereating SQL queries as per user request.

    Postgres Schema:
    -- user table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name:  VARCHAR(100) NOT NULL,
        email: VARCHAR(100) UNIQUE NOT NULL,
        created_at: TIMESTAMP DEFAULT NOW()
    );


    `,tools:[executeSQLTool]
})

async function main(query:string) {
    sharedHistory.push({role:"user",content:query})
    const result = await run(sqlAgent,sharedHistory)
    sharedHistory=result.history
    console.log("AI: ",result.finalOutput)
}

main("hy this is mayur pal").then(()=>{
    main("get all user with my name")
})


/**
 * Problem: AI doesnot remember the data(chat context) therefore we need to provide all chat context so that in new response it see and give response as per that chat
    SOLUTION: create array, push all chat then pass whole array into query so that ai can understand

    We solve the problem till problem run using sharedMemory
    but what if program closed and we provide context which used before program closed for that we need to use persistency 
    - 2 ways: store data into own database or use Conventions API
  

 */