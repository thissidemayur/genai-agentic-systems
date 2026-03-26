import OpenAI from "openai"


const client = new OpenAI()

 client.conversations.create({}).then((e)=>{
    console.log(`Conversation thread created id: `,e.id)
});

