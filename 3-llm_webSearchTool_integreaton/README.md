# 🤖 CLI LLM Agent with Web Search (Implementation)

## Overview

This project is a **working CLI-based LLM agent** that can:
- accept user questions interactively
- decide when web access is required
- call a real web search tool (Tavily)
- reason over the tool output
- return a final, grounded answer

This is **not a learning demo**.  
This is an **actual agent implementation** built on top of LLM tool-calling.

---

## What This Project Is (And Is Not)

### ✅ This IS:
- A persistent, stateful LLM agent
- Interactive (CLI-based)
- Tool-aware (web search)
- Multi-step reasoning capable
- Safe against infinite tool loops

### ❌ This is NOT:
- A theory explanation of tool calling
- A one-off example
- A framework abstraction (LangChain / CrewAI)
- A stateless request-response script

---

## Key Differences from `toolCalling/`

| Aspect | `toolCalling/` | This Project |
|------|----------------|--------------|
| Purpose | Learn how tool calling works | Use tool calling in practice |
| Input | Hardcoded user query | Interactive CLI |
| Flow | Single execution | Continuous conversation |
| State | Single-turn | Persistent memory |
| Safety | None | Tool-call iteration limit |
| UX | Console log | Agent-style responses |

---

## How the Agent Works (Runtime Flow)
```
User enters question (CLI)
↓
Message added to conversation memory
↓
LLM decides:
- Answer directly
- OR request webSearchTool
↓
If tool requested:
- Agent executes Tavily search
- Tool result converted to plain text
- Tool output injected back into memory
↓
LLM reasons again with new context
↓
Final answer returned to user
```


This loop repeats **per user query**.

---

## Conversation State (Important)

The `messages` array is the **single source of truth**.

It stores:
- system prompt
- user messages
- assistant replies
- tool outputs

Every LLM call includes the **entire message history**, ensuring the model:
- remembers prior context
- understands which tools were already called
- avoids redundant reasoning or repeated tool usage

---

## Tool Usage Rules

The agent exposes a single tool:

### `webSearchTool`

Used **only when**:
- real-time or recent data is required
- the answer is outside the model’s training cutoff

The LLM **does not execute the tool**.  
It only **requests** it.

The agent:
1. parses the tool request
2. executes Tavily search
3. sends the result back as a `tool` role message

---

## Safety Mechanism: Tool Iteration Limit

To prevent infinite reasoning loops, the agent enforces a hard limit:

```js
const MAX_TOOL_ITERATIONS = 3;
