---
impact: HIGH
impactDescription: Why LLMs forget between sessions and three approaches to persistence
---

# LLM Memory and Retrieval

LLMs are stateless. Every session starts from zero. Nothing persists unless explicitly saved.

## The Memory Problem
Ask an LLM to book a trip. Close the session. Open a new one. Say "buy the ticket." No idea what trip. Previous conversation is gone. The session boundary is the key concept.

## Three Approaches to Persistence

### File-Based Memory
Write instructions and outputs to files. LLM reads them at session start. CLAUDE.md, README, structured wikis. Human-readable, version-controllable, transparent. Full control, high effort.

### Vector-Based Memory
Embed conversations and documents into a vector database. Query for relevant context at session start. Pinecone, Chroma, Weaviate. Automatic, scales to millions, but opaque. Low control, low effort.

### Platform Memory
LLM platform stores memory entries between sessions. "Remember this" saves a note. ChatGPT memory, Claude memory files. Convenient but limited. Medium control, low effort.

## The Two Knobs
Independent controls that work separately or together:

1. **Retrieval** (what to look at): Out of all available information, which pieces reach the LLM?
2. **Behavior** (how to process it): Once the LLM has information, what should it do?

Most problems are retrieval problems, not behavior problems.

## Vectors Inside vs Vector Database
Vectors inside the LLM: how attention works during processing. Ephemeral, gone when session ends.
Vector database: external storage of embeddings. Persistent, queryable, but separate from the model.
