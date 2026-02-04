# Maya AI - Agentic Chatbot 🤖

A lightweight, full-stack Generative AI chatbot built using **Express.js**, **Groq SDK**, and **Tavily**. Maya is an "Agentic" chatbot, meaning it doesn't just chat—it can reason and use tools to browse the live internet for real-time information.

---

## 🚀 Features

- **Short-Term Memory**: Uses `node-cache` to persist conversation history across multiple turns using a unique `tokenId`.
- **Real-time Web Search**: Uses Tavily API to fetch current news, weather, and facts.
- **Llama 3.3 Powered**: Leverages the high-speed `llama-3.3-70b-versatile` model via Groq.
- **Agentic Reasoning Loop**: Handles recursive tool calls (ReAct pattern) to ensure accurate data retrieval.
- **Modern Dark UI**: Clean, responsive interface built with Tailwind CSS and smart loading animations.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Memory**: NodeCache (In-memory TTL based storage)
- **AI Integration**: Groq SDK (LLM), Tavily SDK (Search Tool)
- **Communication**: Fetch API / JSON REST

---

## 📦 Installation & Setup

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
```bash
npm install express groq-sdk @tavily/core cors node-cache
```

### 3. .env setup

You need API keys from Groq and Tavily. Set them as environment variables or add them to your server file:

```.env
export GROQ_API_KEY='your_key_here'
export TAVILY_API_KEY='your_key_here'
```

### 4. Start the Application

- **Start the Server**: `node --env-file=.env src/server.js `
- Open **index.html** in your browser.

## 🧠 How It Works

- Maya follows the ReAct (Reasoning + Acting) loop:
- Analyze: The LLM receives the user prompt and determines if it needs external data.
- Act: If needed, the server triggers the webSearchTool via the Tavily API.
- Observe: The search results are returned to the LLM.
- Respond & Persist: The LLM sends the final answer, and the server saves the updated conversation array back to the cache.

## 📁 Project Structure

```
├── src/
│   ├── index.html          # Chat interface structure
│   ├── script.js           # Frontend logic & API handling
│   ├── server.js           # Express server & Tool-calling logic
│   ├── style.input.css     # Source Tailwind/CSS
│   └── style.output.css    # Compiled CSS for production
├── package.json            # Node.js dependencies
├── .env                    # env var configuration
└── README.md               # Project documentation
```


---

## 🛠️ Industry Standard Roadmap (The Next Evolution)

To transition this project from a prototype to a production-ready system, the following architectural patterns will be implemented in the next repository:

### 1. Advanced Memory Management
* **Persistent Storage**: Move from `node-cache` (RAM) to **Redis** or **PostgreSQL** to prevent memory loss on server restarts.
* **Windowed Memory**: Implement a "sliding window" logic to keep only the last $N$ messages, preventing Token Limit (Context Window) overflow.
* **Summary Buffer**: Use an LLM "background task" to summarize long conversations into a single system prompt to save costs.

### 2. Streaming & UX (Real-time Feel)
* **Server-Sent Events (SSE)**: Implement streaming so tokens appear word-by-word on the frontend, eliminating the "thinking" wait time.
* **Markdown Rendering**: Integrate `markdown-it` or `marked` on the frontend to render code blocks, tables, and bold text correctly.

### 3. RAG (Retrieval-Augmented Generation)
* **Vector Database**: Integrate **Pinecone** or **ChromaDB**.
* **Document Processing**: Allow users to upload PDFs/Docs, chunk the text, create embeddings, and store them for local semantic search.

### 4. Enterprise Architecture
* **LangGraph / LangChain**: Replace manual `while(true)` loops with LangGraph to create stateful, multi-agent workflows.
* **Observability**: Integrate **LangSmith** or **Arize Phoenix** to trace tool calls, latency, and cost per request.
* **Input/Output Guardrails**: Implement safety layers (using NeMo Guardrails) to filter toxic content or PII (Personally Identifiable Information).



### 5. Deployment & DevOps
* **Dockerization**: Containerize the Express backend for deployment on AWS ECS or Google Cloud Run.
* **CI/CD**: Github Actions for automated testing of tool functions.