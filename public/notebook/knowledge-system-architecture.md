---
title: "Knowledge System Architecture"
description: "Designing the full pipeline: sources, rules, retrieval, and output. Three architectures compared."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/knowledge-system-architecture
---

# Knowledge System Architecture

> Designing the full pipeline: sources, rules, retrieval, and output. Three architectures compared.

  ## The three components

  > Every knowledge system has the same three parts, regardless of implementation.

  
    
      ### Sources

      The raw material. Documents, transcripts, code, articles. The ground truth you're building on. Usually immutable — you reference them, you don't change them.

    

    
      ### Rules

      How the system processes sources into output. Instructions, schemas, templates, constraints. This is what makes output consistent and reliable.

    

    
      ### Output

      The processed knowledge. Summaries, entities, synthesis, answers. This is what humans or other systems consume. It persists and compounds over time.

    

  

  > 
    **Analogy:** Sources = ingredients. Rules = recipe. Output = the dish. You can change the recipe without changing the ingredients. You can add new ingredients without changing the recipe. But the dish depends on both.
  

  ## Three architectures

  > Same three components, different implementations. Each trades off control, effort, and scale.

  
  
    architecture 1
    ### File-based wiki

    Human curates sources, writes rules in an instructions file, LLM produces structured output as files. Everything is readable, version-controllable, transparent.

    
      
        Instructions file controls everything inside

        
          
            ### Sources (immutable)

            Transcripts, PDFs, research. Never modified. Referenced by output pages.

          
          
            ### Rules

            Schema, page types, frontmatter format, cross-referencing conventions, behavioral constraints.

          
          
            ### Output

            Source summaries, entity pages, concept pages, synthesis, index. Grows over time.

          
        
      
      
        **Retrieval:** LLM reads index → finds relevant pages → reads them → follows links to sources if needed.<br>
        **Processing:** LLM follows rules to create/update output pages with citations and cross-references.
      
    

    

      
        | Scale | Dozens to hundreds of sources |

        | Effort | High — human triggers ingestion, curates quality |

        | Transparency | Total — every link and citation is visible |

        | Infrastructure | None — just files in a folder |

      
    

  

  
  
    architecture 2
    ### RAG (Retrieval-Augmented Generation)

    Documents are embedded into a vector database. User queries trigger a similarity search, relevant chunks are injected into the LLM prompt, LLM generates an answer.

    
      
        
          ### Sources

          Same documents, but chunked and embedded as vectors. Stored in a vector database.

        

        
          ### Retrieval

          Query → embed → similarity search → top 5-10 chunks returned.

        
        
          ### Rules (prompt)

          System prompt tells LLM how to use retrieved chunks. Still needed.

        
        
          ### Output

          Generated answer. Often ephemeral (in a chat), not always persisted.

        
      
    

    

      
        | Scale | Thousands to millions of documents |

        | Effort | Low — embed and search, no curation |

        | Transparency | Low — you see which chunks were retrieved, not why |

        | Infrastructure | Vector database + embedding pipeline |

      
    

  

  
  
    architecture 3
    ### Hybrid: vector retrieval + structured output

    Vector DB handles retrieval at scale. But output is structured wiki pages, not ephemeral chat. Best of both — automatic retrieval, persistent knowledge.

    
      
        
          ### Sources

          Embedded in vector DB for retrieval.

        

        
          ### Vector retrieval

          Finds relevant chunks from massive corpus.

        
        
          ### Rules

          Schema for structured output. Same as wiki approach.

        
        
          ### Structured output

          Wiki pages with citations. Compounds over time.

        
      
    

    

      
        | Scale | Thousands of sources, structured output |

        | Effort | Medium — automated retrieval, curated output rules |

        | Transparency | Medium — output is readable, retrieval is opaque |

        | Infrastructure | Vector database + file system + rules |

      
    

  

  ## The cost of each approach

  > Vector search is cheap math. LLM inference is expensive compute. The architecture determines how much inference you need.

  

    | | Embedding a document | Convert text to vector (one-time per doc) | ~$0.0001 per page |

      | Vector similarity search | Find nearest neighbors (just math) | Basically free |

      | LLM reads 5 chunks | Process ~2K tokens of retrieved context | Small |

      | LLM reads 100K docs | Process entire knowledge base | Huge (or impossible) |

      | LLM writes a wiki page | Generate structured output with citations | Moderate |

    
  

  > 
    **Key insight:** A vector DB doesn't eliminate inference — it reduces how much you need. Instead of sending everything to the LLM, you send only the relevant chunks. The vector DB is a filter, not a replacement.
  

  > 
    **Both approaches still need inference.** A wiki system uses inference to write pages (ingest step). A RAG system uses inference to generate answers (query step). The vector DB just makes the input to that inference step smaller and more targeted. You never avoid the LLM entirely — it's always doing the understanding.
  

  ## What the rules file actually controls

  > The rules file (instructions, CLAUDE.md, system prompt) isn't just for writing. It's the operating system for the entire session.

  
    
      1
      
        ### Session starts — LLM reads the rules

        Now it knows: folder structure, page types, frontmatter format, what's immutable, what to update. This loads before anything else.

      
    
    
      2
      
        ### Query — rules define how to search

        "Read the index to find relevant pages." This is the retrieval step. The rules tell the LLM WHERE to look — which is the same job a vector DB does at larger scale.

      
    
    
      3
      
        ### Ingest — rules define how to write

        "Create a source summary, use this frontmatter, link to entities, cite everything." Consistent structure every time.

      
    
    
      4
      
        ### Throughout — rules constrain behavior

        "Never modify sources. Flag contradictions. Prefer updating to creating." Guardrails that prevent drift and hallucination.

      
    
  

  > 
    **In product terms:** The rules file is like a combination of database schema (structure), API permissions (access control), and business logic (behavior). It's not just formatting — it's the entire contract for how the LLM operates.
  

  ## Alternative retrieval: git diff as a search index

  > If your sources are in a git repository, you already have a retrieval mechanism — and it's more precise than vector search.

  When code changes, you don't need a vector DB to figure out which documentation to update. The git diff tells you exactly what changed.

  
    
      1
      ### A commit lands

New code, changed API, updated schema.

    
    
      2
      ### Hook reads the diff

Which files changed? What was added, removed, modified?

    
    
      3
      ### LLM reads changed files + current docs

Targeted inference — only reads what's relevant.

    
    
      4
      ### LLM makes surgical doc updates

"The billing API added a new endpoint. Update the API section."

    
  

  > 
    **The git diff IS a retrieval layer.** Instead of "vector finds similar chunks," it's "git tells you exactly what changed." More precise than vector search, zero infrastructure, and deterministic — it always finds the right files.
  

  > 
    **Tradeoff:** Git diff tells you WHAT changed. It doesn't tell you WHY it matters. An automated pass catches structural changes. A human pass catches strategic significance. The best systems combine both.
  

> 
  Part of a series: [Wiki vs Vector Database](/notebook/wiki-vs-vector.html) covers the fundamental difference. [LLM Memory & Retrieval](/notebook/llm-memory-and-retrieval.html) covers how context persists across sessions.
