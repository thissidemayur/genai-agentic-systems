# 🤖 GenAI Agentic Systems — Engineering Workspace

## Overview

This repository is my **primary workspace for building GenAI and agentic systems**.

It contains:
- learning experiments
- foundational implementations
- agent architectures
- tool integrations
- real projects

This is **not a single project repo**.
It is a **long-term, evolving engineering workspace** focused on how modern AI agents are actually built.

---

## What This Repository Is

This repo is designed to cover **everything required to build real AI agents**, including:

- Large Language Model (LLM) usage
- Tool / function calling
- Agent control loops
- Web-augmented reasoning
- Frameworks (LangChain, LangGraph, etc.)
- Retrieval-Augmented Generation (RAG)
- Vector databases
- Observability & evaluation
- Production-oriented patterns

Some projects live **inside this repo**.  
Some mature projects are moved to **separate GitHub repositories**.

This repo remains the **core lab and knowledge base**.

---

## Learning & Build Philosophy

Most GenAI repositories:
- jump straight into frameworks
- hide logic behind abstractions
- optimize for demos

This repo follows the opposite approach:

- start from **first principles**
- build things manually first
- understand control flow
- add frameworks only when their value is clear

The goal is **engineering depth**, not surface-level familiarity.

---

## Repository Structure (Evolving)
```
genai-agentic-systems/
├── 1-inVoke_LLM/
├── 2-toolCalling/
├── 3-llm_webSearchTool_integreaton/
├── 4-chatbot_project/
├── (future: RAG, vectorDBs, frameworks, evals)
```


Each directory represents a **clear capability or learning stage**, not random experiments.

---

## Current Modules

### 1️⃣ `inVoke_LLM/` — Core LLM Invocation

**Focus:** Direct interaction with LLMs.

Covers:
- invoking LLMs via SDKs
- system vs user prompting
- structured JSON outputs
- deterministic responses
- using LLMs as evaluators (graders, classifiers)

This is the **foundation layer** of all GenAI systems.

---

### 2️⃣ `toolCalling/` — Tool Calling (Learning Focus)

**Focus:** Understanding how tool/function calling works internally.

Covers:
- why LLMs cannot access external systems
- how models request tools
- how developers execute tools
- the LLM → tool → LLM feedback loop

This folder exists to build **correct mental models**.

---

### 3️⃣ `3-llm_webSearchTool_integreaton/` — Agent Implementation (CLI)

**Focus:** A real, working AI agent.

Covers:
- interactive CLI agent
- persistent conversation state
- real web search integration (Tavily)
- multi-step reasoning
- safety mechanisms (tool iteration limits)

This is a **minimal but real agent system**, not a demo.

---

## Projects Inside This Workspace

Alongside learning modules, this repository also contains **end-to-end GenAI applications** that demonstrate how agentic systems are applied in practice.

Some projects remain here for architectural clarity; others may later be split into standalone repositories.

---

### 🤖 Maya AI — Agentic Chatbot

**Location:** `chatbot_project/`  
**Type:** Full-stack Agentic Application

Maya AI is a lightweight, full-stack **agentic chatbot** that demonstrates how an LLM can **reason, decide, and act** by invoking external tools for real-time information.

Unlike traditional chatbots, Maya follows an **explicit ReAct (Reason + Act) loop**, where the LLM decides when web access is required and the system executes tools on its behalf.

#### What This Project Demonstrates

- Agentic reasoning with LLMs
- Tool calling for real-time web data (Tavily)
- LLM → Tool → LLM feedback loop
- Separation of reasoning and execution
- Grounded responses using live data
- Minimal frontend + Express backend integration

#### Tech Stack

- **Frontend:** HTML, Vanilla JavaScript, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **LLM:** Groq SDK (`llama-3.3-70b-versatile`)  
- **Tools:** Tavily Web Search API  

This project serves as a **practical proof-of-work** for building real agentic systems without heavy frameworks.

Refer to `chatbot_project/README.md` for implementation details.

---

## Planned Additions

This repo will expand to include:

- Vector databases (Pinecone, FAISS, etc.)
- Retrieval-Augmented Generation (RAG)
- Agent frameworks (LangChain, LangGraph)
- Observability & tracing (Langfuse)
- Evaluation pipelines
- Memory & context management
- Multi-agent orchestration

Each addition will follow the same rule:

> **understand → implement → abstract**

---

## How Projects Are Managed

- **Experiments & learning** → stay inside this repo
- **Polished applications** → moved to separate repos
- This repo always remains the **source of truth** for concepts and architecture

---

## Who This Repo Is For

- Recruiters evaluating **GenAI engineering capability**
- Clients looking for **agent system builders**
- Engineers interested in **how agents actually work**
- Anyone who cares about **clarity over hype**

---

## Summary

This repository represents a **serious, long-term investment** in GenAI and agentic systems.

It is:
- structured
- intentional
- engineering-first
- built to scale with new tools and ideas

This is not about “learning GenAI”.  
This is about **building agent systems properly**.
