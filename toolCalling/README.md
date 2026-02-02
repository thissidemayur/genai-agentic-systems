# Web Search tool for llm

## connect llm to the web
### web search api
1. serper.dev: google search api 
2. braveSearchApi: brave seach api

### tool:
3. Tavily search: 

## coreIdea
LLMs cannot access the internet.
So the flow is:

1. LLM decides it needs fresh data → asks for a tool
2. YOU execute the tool (Tavily)
3. YOU feed the tool result back to the LLM
4. LLM reads the tool output and produces the final answer

## full flow:
```
User question
   ↓
LLM decides → "I need web search"
   ↓
YOU run Tavily
   ↓
YOU send Tavily results back
   ↓
LLM reads results
   ↓
LLM writes final answer
```