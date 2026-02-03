# Maya AI - Agentic Chatbot 🤖

A lightweight, full-stack Generative AI chatbot built using **Express.js**, **Groq SDK**, and **Tavily**. Maya is an "Agentic" chatbot, meaning it doesn't just chat—it can reason and use tools to browse the live internet for real-time information.

---

## 🚀 Features

- **Real-time Web Search**: Uses Tavily API to fetch current news, weather, and facts.
- **Llama 3.3 Powered**: Leverages the high-speed `llama-3.3-70b-versatile` model via Groq.
- **Agentic Reasoning Loop**: Handles recursive tool calls (ReAct pattern) to ensure accurate data retrieval.
- **Modern Dark UI**: Clean, responsive interface built with Tailwind CSS.
- **Interactive UX**: Smart loading animations ("Maya is thinking") and smooth auto-scroll.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI Integration**: Groq SDK (LLM), Tavily SDK (Search Tool)
- **Communication**: Fetch API / JSON REST

---

## 📦 Installation & Setup

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies

Run the following command in your project folder:

```bash
npm install express groq-sdk @tavily/core cors
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
- Respond: The LLM synthesizes the final answer and sends it to the frontend.

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
