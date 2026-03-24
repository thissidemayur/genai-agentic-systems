# 8-OpenAI-Agents

A hands-on learning repository where I explored and implemented core patterns of the **OpenAI Agents SDK** — from basic tool calling to multi-agent orchestration with guardrails and MCP.

Every folder is a standalone experiment built while learning. This repo is my proof of work.

---

## What I covered

### 1. Agents & Tools

Built basic agents with custom tools. Understood how an agent decides when to call a tool vs respond directly, how tool schemas are defined, and how results flow back into the agent loop.

### 2. Manager & Handoff Pattern

Implemented a manager agent that routes tasks to specialist sub-agents. Learned how handoffs work — when control transfers from one agent to another and how context is preserved across the transfer.

### 3. Structured Output & Tool Calling

Forced agents to return typed, structured responses using output schemas. Combined structured output with tool calling so agents produce both actions and predictable data shapes in the same run.

### 4. Input & Output Guardrails

Added validation layers that run before the agent processes input and after it produces output. Guardrails act as a safety net — blocking bad input, enforcing output contracts, and preventing prompt injection.

### 5. Local Context Management

Managed state that lives outside the LLM — passing context objects through agent runs so tools and agents share data without stuffing everything into the prompt.

### 6. Server Conversation & Chat Thread

Built persistent chat threads where conversation history is maintained across multiple turns. Explored how the SDK manages message history and how to resume or branch conversations.

### 7. LLM Response & Human-in-the-Loop

Implemented patterns where the agent pauses mid-run and waits for human approval before continuing. Useful for sensitive actions — the agent proposes, a human confirms, execution resumes.

### 8. MCP (Model Context Protocol)

Connected agents to external tools and data sources via MCP servers. Learned how MCP standardises tool discovery so agents can call into file systems, APIs, and databases through a unified protocol.

---

## Stack

- **Runtime** — Bun
- **SDK** — OpenAI Agents SDK (TypeScript)
- **Language** — TypeScript
- **DB** — SQLite via `bun:sqlite` (for agentic data experiments)

---

## Repo structure

```
8-openai-agents/src
├── agents-and-tools/
├── manager-handoff/
├── structured-output/
├── guardrails/
├── local-context/
├── chat-thread/
├── human-in-loop/
└── mcp/
```

---

## How to run any example

```bash
bun install
bun run src/fileName
```

---

## Why I built this

The agent ecosystem is moving fast. I wanted to go beyond tutorials and actually build each pattern from scratch — break it, fix it, and understand why it works. This repo is that process, committed as I went.
