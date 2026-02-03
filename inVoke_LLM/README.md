# 📞 Invoking an LLM (Structured Output)

## Overview

This directory demonstrates the **most fundamental GenAI operation**:

> Calling an LLM directly with a prompt and getting a controlled response.

There is **no tool calling**, **no agents**, and **no external APIs** involved.  
This is the **base layer** on top of which everything else (tools, agents, RAG) is built.

---

## Purpose of This Module

The goal of this module is to learn:

- How to invoke an LLM using an SDK (Groq)
- How to structure prompts using `system` and `user` roles
- How to force **strict JSON output**
- How to use an LLM as a **deterministic evaluator**, not a chatbot

This folder focuses on **prompt discipline and output control**.

---

## What This Project Demonstrates

### ✅ Included
- Direct LLM invocation
- Role-based prompting (`system`, `user`)
- Low-temperature, deterministic behavior
- Strict JSON output enforcement
- LLM used as a grader / evaluator

### ❌ Not Included
- Tool calling
- Web search
- Agents or loops
- Memory or conversation state
- Framework abstractions

---

## Use Case Implemented

### 🎯 Interview Answer Grading

The LLM is instructed to act as an **interview grader**.

Input:
- Multiple Q&A pairs from a candidate

Output:
- A strictly structured JSON object:

```json
{
  "confidence": number (1–10),
  "accuracy": number (1–10),
  "pass": boolean
}

