---
title: "Wiki vs Vector Database"
description: "Two ways to store and retrieve knowledge for AI systems. Different tools, different layers of the stack."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/wiki-vs-vector
---

# Wiki vs Vector Database

> Two ways to store and retrieve knowledge for AI systems. Different tools, different layers of the stack.

  ## The core question

  > How does an LLM find the right information when it can't read everything at once?

  LLMs have a context window — a limit on how much text they can process at once. If your knowledge base is bigger than that window, you need a way to select what goes in. Wikis and vector databases are two answers to this problem.

  
    
      ### Wiki

      A human pre-digests information into structured pages with explicit links between them. The human decided what's important and how things relate.

      structuredhuman-curatedbrowsable

    
    
      ### Vector Database

      Math pre-filters information by semantic similarity. Text is converted to numbers (embeddings), and "nearby" numbers mean "similar meaning."

      unstructuredmath-drivensearchable

    
  

  > 
    **Analogy:** A wiki is a library with a card catalog — you organized the books, you wrote the catalog cards. A vector database is GPS coordinates for every sentence — points near each other mean similar things, but nobody labeled them.
  

  ## What they actually store

  > The difference is concrete. One stores readable pages, the other stores arrays of numbers.

  
    
      ### Wiki stores this

      
        title: Vannevar Bush<br>
        type: entity<br>
        tags: [pioneer, memex]<br>
        body: "Proposed the Memex in 1945..."
      

      Human-readable text. Meaningful structure. Anyone can open this and understand it.

    
    
      ### Vector DB stores this

      
        [0.023, -0.187, 0.442, 0.091, -0.334, 0.118, 0.267, -0.055, 0.401, -0.192, 0.078, 0.311, -0.445, 0.156, 0.023, -0.289, 0.167, 0.334, -0.091, 0.223, ...]
      

      1,536 numbers. This encodes meaning as math. No human can read this — but two vectors close together mean the text was semantically similar.

    
  

  ## How they work — interactive

  > Try both retrieval mechanisms side by side.

  
    ### Wiki: Click a node to see its connections

    Explicit links. You see exactly why things are connected.

    <svg class="wiki-graph" viewBox="0 0 500 280">
      <g class="edges">
        <line class="edge" data-from="memex" data-to="bush" x1="250" y1="50" x2="130" y2="120"/>
        <line class="edge" data-from="memex" data-to="hypertext" x1="250" y1="50" x2="370" y2="120"/>
        <line class="edge" data-from="bush" data-to="aswemaythink" x1="130" y1="120" x2="80" y2="220"/>
        <line class="edge" data-from="hypertext" data-to="nelson" x1="370" y1="120" x2="410" y2="220"/>
        <line class="edge" data-from="hypertext" data-to="www" x1="370" y1="120" x2="280" y2="230"/>
        <line class="edge" data-from="bush" data-to="nelson" x1="130" y1="120" x2="410" y2="220"/>
        <line class="edge" data-from="www" data-to="bernerslee" x1="280" y1="230" x2="170" y2="255"/>
      </g>
      <g class="nodes">
        <g class="node" data-id="memex"><circle cx="250" cy="50" r="24" fill="var(--bg-inset)" stroke="var(--accent)" stroke-width="2"/><text x="250" y="54">Memex</text></g>
        <g class="node" data-id="bush"><circle cx="130" cy="120" r="22" fill="var(--bg-card)" stroke="var(--accent-dim)" stroke-width="1.5"/><text x="130" y="124">V. Bush</text></g>
        <g class="node" data-id="hypertext"><circle cx="370" cy="120" r="24" fill="var(--bg-inset)" stroke="var(--accent)" stroke-width="2"/><text x="370" y="124">Hypertext</text></g>
        <g class="node" data-id="aswemaythink"><circle cx="80" cy="220" r="20" fill="var(--bg-card)" stroke="var(--accent-dim)" stroke-width="1.5"/><text x="80" y="216">As We May</text><text x="80" y="228">Think</text></g>
        <g class="node" data-id="nelson"><circle cx="410" cy="220" r="22" fill="var(--bg-card)" stroke="var(--accent-dim)" stroke-width="1.5"/><text x="410" y="224">T. Nelson</text></g>
        <g class="node" data-id="www"><circle cx="280" cy="230" r="22" fill="var(--bg-inset)" stroke="var(--accent)" stroke-width="2"/><text x="280" y="234">WWW</text></g>
        <g class="node" data-id="bernerslee"><circle cx="170" cy="255" r="20" fill="var(--bg-card)" stroke="var(--accent-dim)" stroke-width="1.5"/><text x="170" y="251">Berners-</text><text x="170" y="263">Lee</text></g>
      </g>
    </svg>
  

  
    ### Vector: Type to search by meaning

    Results ranked by similarity score. No structure — just "how close is this to your query?"

    
    
  

  ## Head-to-head comparison

  > Same dimensions, different strengths.

  

    | | Structure | Explicit pages + links. Human-curated graph. | Flat chunks with embeddings. No explicit relationships. |

      | Retrieval | Follow links, read index, browse by type. | Semantic search — "find things that mean something like X." |

      | Auditability | Total. Every link is intentional and visible. | Low. Similarity scores are opaque. No "why." |

      | Scale | Hundreds of pages. Needs curation effort. | Millions of chunks. No curation needed. |

      | Stays current | Manual updates (or someone forgets). | Re-embed on every change — automatic. |

      | Who interacts | Humans browse, read, edit, follow links. | Code queries it via API. Users never see it. |

    
  

  ## When to use which

  > The answer depends on your problem, not the technology.

  

    | | Research & strategy | Wiki | Curated links = a thinking tool you can browse |

      | 10K+ support docs | Vector | Too many docs to curate. Embed and search. |

      | Competitive intel | Wiki | Entities + synthesis = compounding insight |

      | Chat with your docs (RAG) | Vector | Built for this. Retrieve relevant chunks, feed to LLM. |

      | Onboarding a new teammate | Wiki | Browsable, readable, linkable. Humans can explore. |

      | Finding a needle in a haystack | Vector | Semantic search finds things exact-match misses. |

      | Person/entity matching | Vector | Fuzzy matching with confidence scores. |

    
  

  ## Real product example: both in one stack

  > A sales outreach tool that uses wiki for context and vectors for search — different layers, different jobs.

  
    application layer
    ### Knowledge Base (wiki)

    Account pages, contact profiles, sales playbooks. Reps browse this, read it, add notes after calls. Human-facing. Structured. Links between entities.

  

  
    data layer
    ### Person Matching Engine (vector)

    Input: "VP Engineering, fintech, Bay Area." Searches 200M profiles. Returns scored matches. Users never see the vectors — they see a ranked list of people.

  

  
    ### Confidence threshold — drag to filter

    The score isn't about cost — it's about risk. High threshold = only near-certain matches. Low = cast a wider net.

    
      
      0.70
    
    
      
        
        Jane Kim — VP Eng, Stripe
        0.94
      
      
        
        Bob Chen — VP Eng, Plaid
        0.87
      
      
        
        Lisa Park — Dir Eng, Marqeta
        0.71
      
      
        
        Mike Torres — VP Eng, Nike (retail)
        0.38
      
      
        
        Sarah Walsh — Eng Manager, Stripe
        0.22
      
    
  

  > 
    **How they connect:** Vector finds candidates (scored) → you set a threshold based on risk tolerance → wiki has the context for each match (company intel, playbook, notes from last call) → wiki compounds as reps add notes.
  

  ## Common misconceptions

  > Things that sound right but aren't.

  
    ### "Vector databases learn and grow connections over time"

    They don't. You add data, it gets embedded. No "neural links" form between existing data. The embedding model ran once. After that, it's static math in storage.

  

  
    ### "Vector databases are like a brain"

    They're indexed arrays of numbers. Not neural networks. The "neural" part happened once, when the embedding model converted text to vectors. The database itself is just a search index.

  

  
    ### "Wikis and vector DBs do the same thing"

    They both store knowledge. But a wiki stores relationships you chose. A vector DB stores distances math calculated. One is a map you drew. The other is GPS coordinates.

  

  
    ### "You need a vector DB for an LLM to work"

    LLMs use vectors internally (that's how neural nets work), but that's different from a vector database you build and host. If your data fits in the context window, you don't need one.

  

  ## Same problems, different solutions

  > Both approaches solve for memory, retrieval, and control. They just use different mechanisms at different cost points.

  

    | | Memory persistence | Wiki files survive between sessions | Vector DB survives between sessions |

      | Retrieval | LLM reads index + pages inference | Math finds similar chunks no inference |

      | Control / harness | Rules file in natural language tokens | Code + API parameters near-zero tokens |

    
  

  > 
    **The core similarity:** Both are retrieval systems. They answer the same question — "out of everything I know, which pieces should the LLM look at right now?"
  

  ## Where the inference cost lives

  > The wiki approach uses more inference at every step. The vector approach offloads search and control to cheaper layers.

  
    
      ### Wiki pipeline

      Every step uses inference (tokens):

      
        1. LLM reads rules file inference<br>
        2. LLM reads index inference<br>
        3. LLM reads relevant pages inference<br>
        4. LLM generates answer inference
      

    
    
      ### Vector pipeline

      Search is cheap math. Only the answer uses inference:

      
        1. Embed query ~$0.0001<br>
        2. Similarity search free (math)<br>
        3. LLM reads 5 chunks inference<br>
        4. LLM generates answer inference
      

    
  

  > 
    **The vector DB doesn't skip inference — it reduces how much you need.** Both approaches need the LLM for the final step (understanding and answering). The difference is that the wiki uses inference for search too, while the vector uses cheap math. More data = bigger gap in cost.
  

  > 
    **The tradeoff:** The wiki approach costs more tokens but buys you structured output, citation chains, nuanced judgment, and human-readable knowledge that compounds over time. The vector approach is cheaper per query but gives you ranked chunks — no structure, no connections, no synthesis.
  

  ## Goals and control

  > What each approach optimizes for, what's deterministic, and what's out of your hands.

  

    | | Primary goal | Control what the LLM knows and how it connects things | Find relevant stuff fast in data too big to read |

      | Deterministic | What links to what, what pages exist, schema, what's immutable | The embedding math (same text = same vector, always) |

      | Non-deterministic | LLM's synthesis — how it writes summaries, what it emphasizes | Which chunks score highest (can vary with embedding model), what LLM does with them |

      | Out of control | LLM may interpret your rules differently session to session | Retrieval quality — might surface junk that scores high |

    
  

  
    ### What's a harness?

    A harness is anything that wraps the LLM to constrain its behavior. It's not a specific technology. Both approaches need one.

    

      | | Rules file (e.g. CLAUDE.md) | Natural language | Hundreds of tokens/session | Judgment calls, style, workflow, priorities |

        | System prompt (API) | Natural language | Some tokens | Role, tone, constraints |

        | Temperature setting | API parameter | Zero | Output randomness |

        | Schema validation (code) | Code | Zero | Output format, required fields |

        | Retry loop (code) | Code | Costs retries | Output correctness checks |

      
    

  

> 
  Part of a series: [LLM Memory & Retrieval](/notebook/llm-memory-and-retrieval.html) covers how context persists across sessions. [Knowledge System Architecture](/notebook/knowledge-system-architecture.html) covers how to design the full system.
