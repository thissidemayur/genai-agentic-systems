import Groq from "groq-sdk"

const groq_API_KEY = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const chatCompletion = await groq_API_KEY.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Hi",
            }
        ],
        model:"llama-3.3-70b-versatile"
    })

    console.log(chatCompletion.choices[0])
}

await main()