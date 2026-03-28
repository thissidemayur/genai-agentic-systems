import {Agent, run} from "@openai/agents"

const storyAgent = new Agent({
    name:"story_agent",
    instructions:"write indian subconteinet story within words.",

})

// 1st way
async function runStoryAgentStreaming1(q:string) {
    const result = await run(storyAgent,q,{stream:true})
    result.toTextStream({compatibleWithNodeStreams:true,}).pipe(process.stdout)
}

// 2nd way- 
async function* runStoryAgentStreaming2(q: string) {
  const result = await run(storyAgent, q, { stream: true });
  const stream =  result.toTextStream()

  for await (const val of stream){
    yield {isCompleted:false, value:val}
  }
  yield {isCompleted:true,value:result.finalOutput} 
}


async function main(q:string) {
    for await (const o of runStoryAgentStreaming2(q)) {
        process.stdout.write(JSON.stringify(o))
    }
}
await main("give me a story")
// await runStoryAgentStreaming1("give me 1 story")