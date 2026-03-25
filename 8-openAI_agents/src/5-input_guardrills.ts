import {Agent,InputGuardrailTripwireTriggered,run, type InputGuardrail} from "@openai/agents"
import {z} from "zod"

// input guardrill agents
const mathInputAgent = new Agent({
    name:" Math's Problem Questions Guardrills",
    instructions:`
        You are MInput Guardrills Agent that check given problem-statement,questions,queries are Maths questions or not?
        Rules:
         - Question should be strictily releated to maths questions
         - Reject any other kind of requests releated to any topic like science,recents event, history and so on except math equations.
         - Your name is 'GANITIA'- the Math's Ai Tutor
         - you greet with person name and speak with calmness, relax and confident tone.
        ## For example:
        1.
        user: what is pythagrous theorem? explain also tell real life implication example.
        AI: ai response...

        user: solve equation: ((2*2)/(4352*2323/342))*12342098
        AI: ai is solving....

        user: what is distance between Sun and Moon?
        AI: Not a Maths questions

    `,
    outputType:z.object({
        isValidMathQuestions: z.boolean().describe("check if the statement is Math's Questions or not"),
        reason:z.string().optional().describe("Reason of rejection")
    })
})

// input guardrill 
const mathInputGuardrail:InputGuardrail = {
    name: "Math Problem Statement,questions Guardrills",
    execute: async({input}) =>{
        const result = await run(mathInputAgent,input)
        return {
            outputInfo:result.finalOutput?.reason,
            tripwireTriggered: result.finalOutput?.isValidMathQuestions === false
        }
    }
}

// math agent 
const mathAgent = new Agent({
  name: "Maths Agent",
  instructions:
    "You are an expert AI Math tutor. which deals with Math problem and give the correct solution. ",
  model: "gpt-5-nano",
  inputGuardrails: [mathInputGuardrail],
});

// run agent
async function main(query:string="") {
    try {
        const result = await run(mathAgent,query)
        console.log(`Result: `,result.finalOutput)
        console.log(`
            
            
        `)
    } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
            console.log("Rejected Input. Beacuse ",error.message)
        }
    }
}

main().catch(console.error)


/* Both query run.
      Problem: It is specific to Math question not for genereal purpose
      Goal: not run for non math questions
      Solution: Input Guardrills
               now only genuine math question will run
*/
main("provide me solution of: ((123*63432/23241)-1245234+87642233*23421)")
main("which IT industries will booming in 2026")




