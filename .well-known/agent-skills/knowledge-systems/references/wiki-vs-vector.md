---
impact: HIGH
impactDescription: When to use structured wikis vs vector databases for knowledge retrieval
---

# Wiki vs Vector Database

Two retrieval mechanisms solving the same problem differently.

## Wiki
Human pre-digests information into structured pages with explicit links. Total auditability. Every link is intentional and visible. Scales to hundreds of pages with curation effort.

Best for: research and strategy, competitive intel, onboarding new teammates, anything needing browsable, curated context.

## Vector Database
Math pre-filters by semantic similarity. Text converted to embeddings (arrays of numbers). Nearby vectors = similar meaning. Scales to millions of chunks automatically. No curation needed.

Best for: RAG (chat with your docs), needle-in-haystack search, fuzzy matching, person/entity matching, 10K+ document collections.

## Key Differences

| Dimension | Wiki | Vector DB |
|---|---|---|
| Structure | Explicit pages + links | Flat chunks with embeddings |
| Retrieval | Follow links, browse by type | Semantic search ("find similar") |
| Auditability | Total | Low (opaque similarity scores) |
| Scale | Hundreds of pages | Millions of chunks |
| Freshness | Manual updates | Re-embed on change |
| Who interacts | Humans browse and edit | Code queries via API |

## Using Both
Wiki for curated context (entities, synthesis), vector for search (retrieval, similarity). Different layers of the same stack. Example: sales outreach tool uses wiki for company context and vectors for finding relevant prospects.
