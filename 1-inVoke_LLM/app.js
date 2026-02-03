import Groq from "groq-sdk"

const groq_API_KEY = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const chatCompletion = await groq_API_KEY.chat.completions.create({
        temperature:0.1,
        messages: [
            {
                role:"system",
                content:`You are a interview grader assistant. Your task is to genereate canditate score. Output must be following JSON structure:
                {
                    "confidence": number(1-10 scale),
                    "accuracy": number(1-10 scale),
                    "pass":boolean(true or false)
                }
                The response must:
                1. Include all field shown above
                2. Use only the exact field
                3. Follow the exact data type specifed
                4. Contain only the JSON object and nothing else    
                `
                // content:`You are jarvis, a smart review grader. Your task is to analyse given review and return the sentimental. Classofy the review as positive, neutral or negative.  You must return in JSON strucutre
                // example: {"Sentiment":"negative"}`
            },
            {
                role: "user",
                content:`Q: What does === do in Javasript?
                A: It check strict equality both- value and data type. if both are match then true else false 
                
                Q: How do you create a promise that resolve after 1 second?
                A: const p = new promise(r=>setTimeout(r,1000))

                Q: What is hoisting?
                A:in var we can use variable without declareation but in let and const we cant this is an example of hositing

                Q:Why use let instead of var?
                A: let is blocked scoped, therefore its lifespan is present within the block but var is a global therefoe we can access, redeclared it and it doesnot through error while redeclaring 
                `

                // content: `Review:These headphones arrived very quickly and look great but the left earcup stopped
                // Sentimental`,
            }
        ],
        model:"llama-3.3-70b-versatile"
    })

    console.log(chatCompletion.choices[0].message.content)
}

await main()