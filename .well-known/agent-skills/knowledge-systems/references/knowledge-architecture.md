---
impact: MEDIUM
impactDescription: Full pipeline from sources to rules to retrieval to output
---

# Knowledge System Architecture

Complete pipeline for AI knowledge systems. Sources feed into rules and retrieval, which feed the model, which produces output.

## Four Stages
1. **Sources**: documents, APIs, databases, user input
2. **Rules**: CLAUDE.md, system prompts, constraints, formatting requirements
3. **Retrieval**: vector search, wiki lookup, file reading, API calls
4. **Output**: generation, actions, tool calls, structured responses

## Three Architectures

### Monolithic Context
Everything in one prompt. Simple, no infrastructure. Works for small knowledge bases (<100K tokens). Breaks when content exceeds context window.

### RAG Pipeline
Vector database retrieves relevant chunks, injects into prompt. Scales to millions of documents. Requires embedding pipeline, chunk management, relevance tuning. Standard for "chat with docs."

### Agent with Tools
Model decides what to retrieve, when, and how. Uses tools (search, read file, query API) to gather context on demand. Most flexible, highest complexity. Requires tool design, error handling, termination conditions.

## Cost Considerations
Monolithic: high token cost per query, zero infrastructure cost.
RAG: moderate token cost, moderate infrastructure (vector DB, embeddings).
Agent: variable token cost (multi-turn), highest infrastructure (tools, orchestration).
