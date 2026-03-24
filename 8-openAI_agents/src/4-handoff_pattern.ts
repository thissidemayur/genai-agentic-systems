import { Agent, handoff, run, Runner, tool } from "@openai/agents"
import { z } from "zod"
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { dbAll, dbGet, dbRun, writeAudit } from "./db/client";



const COMPANY_POLICY = `
- CUSTOMER FIRST: Always be polite and use the customer's name if known.
- DATA PRIVACY: Never share SKU numbers or internal DB IDs unless necessary.
- REFUNDS: Only for delivered items. Never for 'shipped' or 'cancelled' items.
- SALES: Offer a 10% discount code 'WELCOME10' to Bronze tier members only.
`;


const refundMetadatadataSchema = z.object({
  orderId: z.number().describe("The numberic ID of the orders"),
  reason: z.string().describe("why the customer want to refund"),
  customerTier: z.enum(['bronze', 'silver', 'gold']).describe("The tier of the customer").default("bronze")
})

type refundMetadata = z.infer<typeof refundMetadatadataSchema>;

const salesMetadataSchema = z.object({
  customerEmail: z.email().describe("Customer email address"),
  interest: z.string().describe("what category is the user intreseted in?")
})

const RefundAgent = new Agent({
  name: "Refund Agent",
  instructions: `
        ${RECOMMENDED_PROMPT_PREFIX}
        ${COMPANY_POLICY}
        You are Refund specialist
        - use 'process_refund' only verifying order exists and it follow company policy on Order refund
        - If the order is 'shipped', tell the user they must wait for delivery first.
    `,
  tools: [
    tool({
      name: "process_refund",
      description: "Process a refund for a specific order ID.",
      parameters: z.object({ orderId: z.number(), reason: z.string() }),
      execute: async ({ orderId, reason }) => {
        const order = dbGet("SELECT total, status FROM orders where id = ? ", [
          orderId,
        ] as any);
        if (!order) return "Order not found";

        if (order.status === "shipped")
          return "Cannot refund a shipped order untill it is delivered";

        dbRun(
          "INSERT INTO refunds(order_id,reason,status,amount) VALUES (?,?,'pending',?) ",
          [orderId, reason, order.total as number],
        );

        writeAudit({
          agent: "RefundAgent",
          action: "INITIATE_REFUND",
          entity: "order",
          entity_id: orderId,
          note: reason,
        });

        return `Refund of ₹${order.total} for Order #${orderId} is now PENDING `;
      }
    }
  )
    ]
   
})

const SalesAgent = new Agent({
  name: "SalesAgent",
  instructions: `
        ${RECOMMENDED_PROMPT_PREFIX}
        ${COMPANY_POLICY}
        You are a Sales Expert. Your goal is to recommend products.
        1. use 'get_recommendations' to find products in category
        2. check the customer tier. If 'bronze' give them the 'WELCOME10' code.
    `,
  tools: [
    tool({
      name: "get_recommendations",
      description: "Find products by category (e.g., Electronics, Clothing).",
      parameters: z.object({ category: z.string() }), // Use the correct parameter schema!
      execute: async ({ category }) => {
        // Change args to match parameters
        const products = dbAll(
          "SELECT name, price, stock_qty FROM products p JOIN categories c on p.category_id = c.id WHERE c.name LIKE ?",
          [`%${category}%`],
        );
        return products.length > 0
          ? products
          : "No products found in that category";
      },
    }),
  ],
});



const triageAgent = Agent.create({
  name: "TeiageAgent",
  instructions: `
        ${COMPANY_POLICY}
       You are a Refund Specialist.
        STEP 1: Use 'process_refund' to check the order status in the database.
        STEP 2: If the tool says it is 'shipped', explain the policy.
        STEP 3: If the tool is successful, provide the confirmation.
    `,
  handoffs: [
    handoff(RefundAgent, {
      inputType: refundMetadatadataSchema,
      toolDescriptionOverride: "Use when user want refund(want money back).",
      onHandoff: (ctx, input) => {
        console.log(
          `\n[SYSTEM]: handing off to Refund Dept for order ${input?.orderId}...`,
        );
      },
    }),

    handoff(SalesAgent, {
      inputType: salesMetadataSchema,
      toolDescriptionOverride:
        "use when user asks about products, prices or recommendations",
      onHandoff: (ctx, input) => {
        console.log(
          `\n[SYSTEM]: Handing off to Sales for user ${input?.customerEmail}...`,
        );
      },
    }),
  ],
});


// stimulation
async function simulate(query: string) {
  console.log(`\nUser Query: "${query}"`)
  try {
    const result = await run(triageAgent, query)
    console.log(`Agent Response: ${result.finalOutput}`);

  } catch (error) {
    console.error("CRITICAL ERROR in Agent Workflow:", error);
  }
}


async function main() {
  // test 1
  await simulate("Hi, I'm Rahul (rahul@example.com). Do you have any cool electronics?")

  await simulate("I am Arjun. My order #1 was broken. I need a refund. order already is delievered");
}

main().catch(console.error)