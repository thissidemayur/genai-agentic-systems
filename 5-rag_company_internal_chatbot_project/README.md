# 📄 Retrieval-Augmented Generation (RAG) for Internal Documentation

## Overview

This project implements a **Retrieval-Augmented Generation (RAG) system** designed for querying **company internal documentation**.

It acts as an internal AI chatbot where employees can ask questions about:

- company rules
- internal guidelines
- onboarding documents
- technical documentation
- organizational knowledge

Instead of sending user queries directly to a Large Language Model (LLM), the system first **retrieves relevant context** from internal documents using vector similarity search.  
The retrieved context is then injected into the LLM prompt to produce **accurate, grounded, and organization-specific answers**.

---

## 🧠 Large Picture (System Flow)

High-level interaction flow:

```
User Query
     ↓
Chatbot Interface
     ↓
Vector Database Search (Semantic Retrieval)
     ↓
Relevant Document Context
     ↓
LLM (with injected context)
     ↓
Grounded Response to User
```

The chatbot does NOT rely on the LLM's memory alone.  
Instead, it retrieves real internal data before generating responses.

---

## Why RAG Is Needed

LLMs:

- do not know private company data
- hallucinate when context is missing
- cannot access internal documents by default

RAG solves this by:

- grounding LLM responses in **real internal knowledge**
- reducing hallucinations
- enabling employees to interact conversationally with internal documents
- keeping sensitive data inside controlled infrastructure

---

## High-Level Architecture

The system is divided into two main phases:

1. **Document Ingestion (Indexing Pipeline)**
2. **Query (Retrieval + Generation) Pipeline**

---

## 1️⃣ Document Ingestion & Indexing Pipeline

This phase prepares company documents for retrieval.

### Steps

1. Load internal documents (PDFs, Markdown, text, etc.)
2. Split large documents into semantic chunks
3. Convert each chunk into vector embeddings
4. Store embeddings in vector database (Pinecone)
5. Build searchable semantic index

### ASCII Flow Diagram

```
Internal Documents
↓
PDF Loader (LangChain)
↓
Text Chunking (LangChain TextSplitter)
↓
OpenAI Embedding Model
↓
Vector Embeddings
↓
Pinecone Vector Database
```

---

## 2️⃣ Query & Answer Pipeline

This phase handles user questions.

### Steps

1. User submits a query
2. Query converted into embedding vector
3. Pinecone performs similarity search
4. Relevant chunks retrieved
5. Context + user query sent to LLM
6. LLM generates grounded response

### ASCII Flow Diagram

```
User Query
↓
Embedding Model
↓
Query Vector
↓
Vector Similarity Search
↓
Relevant Document Chunks
↓
Context Injection
↓
LLM (Groq / OpenAI)
↓
Final Answer
```

---

## 🛠 Technologies & Packages

### Runtime

- Bun (JavaScript runtime)

### Backend / Framework

- LangChainJS

Installed packages:

```
bun add @langchain/community @langchain/core pdf-parse
```

---

### Document Processing

#### PDF Loader (LangChain Integration)

Used to:

- load PDF documents
- extract raw text data
- prepare documents for chunking

Why use this instead of manual parsing?

- handles structured document extraction
- integrates directly with LangChain pipelines
- reduces boilerplate processing code

---

### Text Splitter (LangChain)

Large documents must be split because:

- embedding models have token limits
- smaller chunks improve semantic search accuracy
- retrieval becomes more precise

TextSplitter automatically:

- divides documents into meaningful segments
- preserves context boundaries

---

### Embedding Model

- OpenAI Vector Embeddings

Used to convert:

- document chunks → embedding vectors
- user queries → embedding vectors

Embedding vectors allow semantic similarity search rather than keyword matching.

---

### Vector Database

- Pinecone

Responsibilities:

- store embeddings
- index vectors
- perform fast similarity search

---

### VectorStore (LangChain)

Instead of manually:

1. embedding documents
2. embedding user queries
3. comparing vectors
4. retrieving results

LangChain VectorStore:

- automates embedding generation
- manages indexing
- handles retrieval logic
- reduces implementation complexity

This abstraction improves:

- maintainability
- scalability
- developer productivity

---

### LLM Providers

- OpenAI (Embeddings)
- Groq Cloud API (LLM inference)

---

### Frontend

- HTML
- CSS
- Vanilla JavaScript

---

## 🤖 Chatbot Use Case

Employees interact with internal documentation conversationally:

Examples:

- "What is our onboarding policy?"
- "What security guidelines should backend engineers follow?"
- "Explain our deployment workflow."

The system retrieves internal content and generates grounded answers.

---

## Current State

- Works with static documents already provided
- Semantic retrieval enabled
- Context-aware responses

---

## Planned Future Features

### Dynamic Knowledge

- Upload PDFs directly from UI
- Automatic document indexing
- Talk-to-your-own-documents feature

### Memory System

- Conversation history
- Personal notes storage
- Revisit saved responses

### Retrieval Improvements

- Hybrid search (vector + keyword)
- Metadata filtering
- Re-ranking models

### Agent Features

- Multi-step reasoning
- Tool usage
- Source citation

### Observability

- Langfuse integration
- evaluation metrics

---

## Important Design Principles

- Retrieval happens before generation
- LLM never directly queries database
- Context always injected explicitly
- Semantic similarity > keyword search

---

## Summary

This project demonstrates a **first-principles RAG-based internal knowledge chatbot**:

- documents converted into embeddings
- semantic retrieval via vector database
- grounded LLM responses for company-specific knowledge

The goal is to evolve this into a **production-grade internal AI assistant**.
