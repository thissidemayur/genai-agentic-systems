

import {Agent, run, RunContext, tool} from "@openai/agents"
import {z} from "zod"

interface userInfoContext{
    name:string
    id:string
}

const getUserInfoTool = tool({
  name: "get_user_info",
  description: "get user info",
  parameters:z.object({}),
  execute: async (
    _args,
    runContext?: RunContext<userInfoContext>,
  ): Promise<string> => {
    return `User ${runContext?.context.name} is 47 years old`;
  },
});
const customerSupportAgent = new Agent<userInfoContext>({
  name: "Customer Support Agent",
  tools: [getUserInfoTool],
  instructions: () => {
    return `You're an expert customer support agent. greet with user name if provied `;
  },
});

async function main(q:string) {
    const userInfo: userInfoContext = { name: "Zhantuuuuu", id: `123` };
    const result =await run(customerSupportAgent,q,{
        context:userInfo
    });
    console.log("AI: ",( result).finalOutput)

}

await main("how can you help me? and whats my name?")