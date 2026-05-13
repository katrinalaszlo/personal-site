---
name: knowledge-systems
description: >-
  Design knowledge retrieval and memory systems for AI applications. Covers wiki
  vs vector database tradeoffs (structured graph vs semantic similarity, when to
  use each, using both in one stack), LLM memory and retrieval (why LLMs forget
  between sessions, three approaches to persistence, retrieval vs behavior knobs),
  and knowledge system architecture (full pipeline from sources to rules to
  retrieval to output, three architectures compared with cost breakdown). Use when
  building RAG pipelines, choosing between vector databases and structured knowledge
  bases, designing memory persistence for agents, or architecting knowledge systems
  for AI products.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# Knowledge Systems

How to store, retrieve, and persist knowledge for AI systems. Three topics.

## Wiki vs Vector Database

Two retrieval mechanisms solving the same problem differently.

**Wiki**: human pre-digests information into structured pages with explicit links. Total auditability. Scales to hundreds of pages with curation effort. Best for: research, strategy, competitive intel, onboarding.

**Vector DB**: math pre-filters by semantic similarity. Text converted to embeddings, nearby vectors = similar meaning. Scales to millions of chunks automatically. Best for: RAG, chat-with-docs, needle-in-haystack, fuzzy matching.

**When to use both**: wiki for curated context (entities, synthesis), vector for search (retrieval, similarity). Different layers of the same stack.

## LLM Memory & Retrieval

LLMs forget between sessions. Three approaches to persistence: context injection (stuff relevant info into prompt), retrieval-augmented generation (RAG, search for relevant chunks), and fine-tuning (bake knowledge into weights).

Two knobs: retrieval (what information reaches the model) and behavior (how the model acts on it). Most problems are retrieval problems, not behavior problems.

## Knowledge Architecture

Full pipeline: sources (documents, APIs, databases) to rules (CLAUDE.md, system prompts) to retrieval (vector search, wiki lookup) to output (generation, actions). Three architectures compared: monolithic context, RAG pipeline, agent with tools.

## References

See `references/` for detailed content on each topic.
