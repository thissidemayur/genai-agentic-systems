import { Agent, run } from "@openai/agents";

// create an agent
const agent = new Agent({
  name: "History tutor",
  instructions:
    "You provide assistance with historical queries. Explain important events and context clearly answer precisely",
});

// run agent
const result = await run(
  agent,
  "name 10 traitors of indin istory if they were not there how was history today",
);
console.log(result.finalOutput);
console.log("Chatgpt whole respose: ");
console.log(result);
