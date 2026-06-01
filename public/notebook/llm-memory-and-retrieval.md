---
title: "LLM Memory &amp; Retrieval"
description: "How LLMs find information, why they forget between sessions, and how to solve that."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/llm-memory-and-retrieval
---

# LLM Memory & Retrieval

> How LLMs find information, why they forget between sessions, and how to solve that.

  ## The memory problem

  > LLMs don't remember anything by default. Every session starts from zero.

  Ask an LLM to book a trip to Taipei. Close the session. Open a new one. Say "buy the ticket." It has no idea what trip you're talking about. The previous conversation is gone.

  This happens because LLMs are **stateless**. They process the text in front of them — the context window — and produce output. Nothing persists between sessions unless you explicitly save it somewhere.

  > 
    **Analogy:** An LLM is like a brilliant contractor who shows up every morning with total amnesia. They can do incredible work if you brief them — but yesterday's briefing is gone. You need to leave notes on the desk.
  

  ## What survives and what doesn't

  > The session boundary is the key concept.

  
    
      
        Session 1
        You: "Analyze this transcript"
        LLM reads your instructions
        LLM reads the transcript
        LLM writes a summary
        LLM updates related pages
        Session ends. LLM's internal state = gone.
      
      
        
          Survives
          Instructions file
          Source documents
          Output files
        
        
          Dies
          LLM's "understanding"
          Conversation context
          Internal vectors
        
      
      
        Session 2
        You: "What do we know about X?"
        LLM reads same instructions
        LLM reads the output from last time
        LLM answers from those files
        Works because the files persisted, not because it "remembers."
      
    
  

  > 
    **Key insight:** The LLM doesn't remember — it re-reads. Session 2 works because someone saved files that the LLM can read again. The files ARE the memory. The LLM is just a reader.
  

  ## Three approaches to persistence

  > Different ways to leave notes on the desk for tomorrow's amnesiac contractor.

  
    approach 1
    ### File-based memory

    Write instructions and outputs to files. The LLM reads them at the start of each session. You control exactly what persists and how it's structured.

    Examples: README files, CLAUDE.md, structured markdown wikis, config files. Human-readable, version-controllable, transparent.

  

  
    approach 2
    ### Vector-based memory

    Embed all conversations and documents into a vector database. At the start of each session, query the database for relevant context and preload it.

    Examples: Pinecone, Chroma, Weaviate. Automatic, scales to millions of chunks, but opaque — you don't control what gets retrieved.

  

  
    approach 3
    ### Platform memory

    The LLM platform itself stores memory entries between sessions. You tell it "remember this" and it saves a note internally.

    Examples: ChatGPT's memory feature, Claude's memory files. Convenient but limited — you're trusting the platform to decide what's relevant.

  

  

    | | Control | Full | Low | Medium |

      | Effort | High (manual curation) | Low (automatic) | Low |

      | Transparency | Total | Low (similarity scores) | Medium |

      | Scale | Hundreds of pages | Millions of chunks | Limited |

      | Infrastructure | Just files | Database + embedding pipeline | None |

      | Portability | Works anywhere | Vendor-locked | Vendor-locked |

    
  

  ## The two knobs: retrieval vs behavior

  > These are independent controls. You can have either without the other, or both.

  When you set up any LLM-based system, you're turning two separate knobs:

  
    
      ### What to look at

      The retrieval problem. Out of all available information, which pieces does the LLM read?

      vector searchindex lookupfile selection

    
    
      ### How to process it

      The behavior problem. Once the LLM has the information, what should it do with it?

      instructionsschemasrules

    
  

  

    | | File-based system | You pick the file, or LLM reads an index | Instructions file defines the rules |

      | Vector system (RAG) | Vector DB picks the chunks | Still needs instructions/prompts |

      | No system | User pastes text into chat | Whatever the LLM defaults to |

    
  

  > 
    **Common mistake:** Assuming a vector database replaces instructions. Even with perfect retrieval, the LLM still needs to know: what format should the output be? What rules apply? What should it never do? Retrieval gets the right data in. Instructions tell it what to do with that data. You need both.
  

  ## Vectors inside the LLM vs a vector database

  > These sound the same but are completely different things.

  
    
      ### Vectors inside the LLM

      Every token gets converted to a vector during processing. Attention is computed in vector space. This is just how neural networks work.

      **Ephemeral.** These vectors exist during your conversation and are gone when the session ends. You don't control or see them.

    

    
      ### A vector database

      A separate piece of infrastructure you build and host. You embed your documents, store the vectors on disk, and query them later.

      **Persistent.** Survives session restarts. You decide what goes in. It's like Postgres, but for similarity search instead of exact queries.

    

  

  > 
    **Analogy:** Saying "the LLM uses vectors" is like saying "my car uses pistons." True, but you don't manage the pistons. A vector database is a separate engine you'd buy, install, and maintain.
  

> 
  Part of a series: [Wiki vs Vector Database](/notebook/wiki-vs-vector.html) covers the fundamental difference. [Knowledge System Architecture](/notebook/knowledge-system-architecture.html) covers designing the full system.
