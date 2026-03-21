import { Agent, tool,run } from "@openai/agents"
import { z } from "zod"
import fs from "node:fs/promises"
const stock_category = z.enum(["sports_shoes", "snikkers", "loffers", "boots", "heels"])

const processRefund = tool({
  name: "process_refund",
  description:
    "this tool process the refunds for customer if it success returned refundIssued as false  ",
  parameters: z.object({
    customer_id: z.string().describe("customer id"),
    reason: z.string().describe("reason for refund"),
    refundable:z.boolean().describe("agent take discussion on user prompt where it should refundable or not")
  }),
  execute: async function ({ customer_id, reason,refundable=false }) {
   
    if (refundable) {
         await fs.appendFile(
           "./refund.txt",
           `Refund for customer having id: ${customer_id} and reasons: ${reason}`,
           "utf-8",
         );
        return {
          refundIssued: true,
        };
    }else {
         await fs.appendFile(
           "./refund.txt",
           `Not Refund for customer having id: ${customer_id} and reasons: ${reason}`,
           "utf-8",
         );
        return {
          refundIssued: false,
        };
    }
  },
});

const refundAgent = new Agent({
  name: "refund Agent",
  instructions: `
        You are an expert in refunds . you can decided wheather you give return or not and mentions every logs using tool: processRefund
        if it is refundable then write log there else also write log there
         
        ## companies polices on returnable items:
        1. only damage product within 5 days of order can refundable
        2. any item within 3 days of order can refundable 
        3. damage product by user side or any external agent by user cannot be replacable nor refundable
        

        You dont want any photos and dont be so strict to ask neccessary data. 

        Your response should follows this:
        returbale: yes/no
        reasons: 
        if returable is no then why not with companies polices in short

        
    `,
  tools: [processRefund],
});


const fetchShoesDetails = tool({
    name: "get_shoes_details",
    description: "get all shoes stocks with its metadata like prices, total_stock,sell_stock,stock_category",
    parameters: z.object({}),
    execute: async function () {
        return [
            {
                stock_id: 1,
                price_in_inr: 3000,
                total_stock: 300,
                sell_stock: 100,
                stock_category: "sports_shoes",
            },
            {
                stock_id: 1,
                price_in_inr: 8000,
                total_stock: 4500,
                sell_stock: 1300,
                stock_category: "snikkers",
            },
            {
                stock_id: 1,
                price_in_inr: 5000,
                total_stock: 200,
                sell_stock: 190,
                stock_category: "loffers",
            },
            {
                stock_id: 1,
                price_in_inr: 2342,
                total_stock: 10,
                sell_stock: 0,
                stock_category: "boots",
            },
            {
                stock_id: 1,
                price_in_inr: 6000,
                total_stock: 50,
                sell_stock: 11,
                stock_category: "heels",
            },
        ];
    }
})

const salesAgent = new Agent({
    name: "Sales Agent",
    instructions: `
  You are expert sales agent for an Shoes company, Mayuri shoes.
  talk to the user and help them with what they need
  `,
    model: "gpt-5-nano",
    tools: [
        fetchShoesDetails,
        refundAgent.asTool({
            toolName: "process_refund",
            toolDescription: "Handle refund questions and requests"
        })
    ]
});


// run agent
async function runSalesAgent(query="") {
    const result  =  await run(salesAgent,query)
    console.log(result.finalOutput)
    console.log("")
    console.log("-----------------------------------");

}

runSalesAgent(
  `i want my money back beacuse my product white snikkers cut by sharps things
  order_no:123,
  purchase_date: 20 march 2025,
  condition is good on order,
  product name: sniqers
  i want refund
  i cant share photo
  `,
);

// runSalesAgent(
//   `i want my money back on black  boots beacuse i recieved damage product on order
//   order_no:1233,
//   purchase_date: 20 march 2025,
//   condition is bad and used on order,
//   product name: boots
//   i want refund my money very worst expiernce
//   i cant share photo beacuse i am not using my photo and as you see i am returing within 5 day of order therefore you cant ask me for proofs
//   `,
// );

// runSalesAgent(
//   "i want my money back beacuse my product loffers beacuse i am returing product on 4th day of order",
// );
// runSalesAgent(
//   "i want my money back beacuse my product i use 7days but i am not satisy by it",
// );

