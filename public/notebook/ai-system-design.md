---
title: "AI System Design"
description: "The eight decisions you'll actually make when adding AI to a product. Framework from prototype to production."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/ai-system-design
---

# AI System Design

> The eight decisions you'll actually make when adding AI to a product. Framework from [Aman Agarwal](https://www.linkedin.com/in/amanagarwal1/).

  ## Start with users, not the system

  > Pick one segment. Map the journey. Find the pain. Solutions come after.

  When someone says "design an AI system for X," the instinct is to talk about models and architecture. Resist it. Start with a person.

  
    
      What most people say
      "I'd build an LLM-based chatbot to handle customer support queries."

    

    
      What you should say
      "Let me start with the user. A power user on this telecom app calls support 3x/month about billing disputes. The pain isn't the call. It's that they can't self-serve a clear billing breakdown."

    

  

  > 
    **PM analogy:** You'd never write a PRD starting with "we'll use PostgreSQL." You start with the user problem. Same thing here. The AI part comes later. The user part comes first.
  

  ## The three pillars

  > Every AI system has three load-bearing components. Name them explicitly.

  
    
      ### Model

      What does the thinking. What type? Why? What's it optimized for?

    

    
      ### Data

      What feeds the model. Where does it come from? How fresh does it need to be?

    

    
      ### Memory

      What persists across interactions. What does the system remember about this user?

    

  

  **Model:** The engine. Not every engine needs to be a jet turbine. Some jobs need a sewing machine. Ask: What input does it handle? What's the latency budget? Does output need to be interpretable?

  **Data:** Most AI systems fail because of data problems, not model problems. Ask: Where does data live? Real-time or batch? What are the privacy constraints?

  **Memory:** Without memory, every interaction starts from zero. Ask: What persists across sessions? Where does memory live (vector DB, cache, database)? What's the retrieval strategy?

  > 
    **Connection to Data Pipelines:** The data pillar is the pipeline you learned about. The difference is that here, the input isn't training data. It's customer records, chat logs, usage patterns. Same concept, different source.
  

  ## LLM isn't the default

  > "I'd use an LLM" is not a design decision. It's a reflex.

  Two jobs in the same system can need completely different models.

  

    | | Latency | <100ms | 100ms-2s first token; total depends on output length |

      | Cost per prediction | $0.001 | $0.01-0.10 |

      | Interpretable | Yes (feature importance) | No |

      | Data type | Structured, tabular | Unstructured text, images |

      | Output type | Classification, regression | Generation, conversation |

      | Best for | Churn prediction, scoring | Conversation, summarization |

    
  

  
    
      ### Job 1: Predict churn

      Billing history, usage patterns, tenure. Structured tabular data.

      <strong style="color:var(--green)">Use XGBoost.</strong> You don't need a poet. You need a calculator.

    

    
      ### Job 2: Talk to a customer

      Natural language understanding, context handling, open-ended generation.

      <strong style="color:var(--accent)">Use an LLM.</strong> XGBoost can't generate language. This is where the LLM earns its cost.

    

  

  > 
    **The bar:** "Here are the tradeoffs, here's my pick, here's why." Not "I'd use an LLM."
  

  ## Orchestration before agents

  > Design the router before you design the specialists.

  Before you design individual agents, design the layer that decides which agent handles what. This is triage.

  
    
      1
      
        ### User message arrives

        "Why is my bill higher this month?"

      
    
    
      2
      
        ### Router classifies intent classify + route

        Intent: `billing_query` (confidence: 0.94). Routes to Analyst agent.

      
    
    
      3
      
        ### Specialist agent handles it

        Analyst queries billing database, retrieves account details.

      
    
    
      4
      
        ### Response returned to user

        "Your bill increased by $12 due to roaming charges on March 5-7."

      
    
  

  If the router's confidence is below threshold (e.g. 0.31), it routes to a human agent with the conversation transcript. The system learns from every handoff.

  > 
    **PM analogy:** An ER doesn't send you straight to a surgeon. There's a triage desk that assesses you and routes you to the right specialist. Without triage, you have specialists standing around with no one directing traffic.
  

  > 
    **Connection to Agent Teams:** The six knobs apply to every agent here. The router's termination condition is "response delivered." The analyst's tools include database access. The voice bot's isolation keeps it from touching account settings.
  

  ## Memory isn't one thing

  > Three tiers, three purposes, three persistence models.

  
    
      ### Session

      Current conversation state. "User asked about billing, then changed to data usage."

      Dies when conversation ends. Implemented as conversation context.

    

    
      ### Episodic

      Past interactions with this user. "Called 3x in March about the same roaming charge."

      Permanent, per-user. Lives in a vector database. Retrieved by similarity.

    

    
      ### Semantic

      Knowledge base, docs, policies. "Roaming charges apply outside home network after 2GB."

      Permanent, shared across all users. RAG over product documentation.

    

  

  
    <strong style="color:var(--green)">For churn, episodic memory is king.</strong> A customer who called three times about the same unresolved billing issue is about to leave. If your AI doesn't know that, it'll give a generic response instead of "I see you've called about this roaming charge three times. Let me escalate this right now."

  

  > 
    **PM analogy:** A good barista knows three things. What you just ordered (session). That you always get oat milk and complained about it being out last Tuesday (episodic). That oat milk costs $0.50 extra and is in the back fridge (semantic).
  

  ## Show failure modes

  > Candidates who only describe the happy path look junior. Systems that only handle it break in production.

  

    | | Model down | Health check, timeout | Human handoff with transcript |

      | High latency (>30s) | p95 monitoring | Human handoff, async notification |

      | Repeat question | Semantic similarity on consecutive messages | Escalate immediately. You've failed. |

      | Low confidence | Score <0.7 on intent classification | Route to human with context summary |

      | Hallucination | Grounding check vs. source docs | Flag, serve verified response |

    
  

  > 
    **PM analogy:** Every product has error states. 404 pages, failed payments, timeout screens. You design those before launch, not after. AI systems have the same need. The error states are just different.
  

  ## Plan for 10x traffic

  > Your prototype works on 100 test calls. The telecom has 50 million subscribers.

  
    ### Embedding search

    **Problem:** SQL can't do similarity search on millions of vectors fast enough.

    **Fix:** Vector database (Pinecone, Weaviate, pgvector). Cache top N frequent query embeddings.

  

  
    ### Model API rate limits

    **Problem:** External LLM APIs have throughput ceilings you'll hit at scale.

    **Fix:** Batch non-real-time work (churn scoring) nightly. Self-host for latency-critical paths.

  

  
    ### Cache misses

    **Problem:** Same questions get asked thousands of times, each hitting the model.

    **Fix:** Cache frequent query embeddings and common responses. Huge cost savings.

  

  > 
    **The key principle:** Load test the model APIs before launch, not after. Know your ceiling. If OpenAI rate-limits you at 10,000 requests/minute and you expect 50,000, that's a launch-blocking problem to find in week one, not week twelve.
  

  ## Metrics across four layers

  > If you only measure one thing, you'll miss three ways the system can fail.

  
    
      ### Model Layer

      

        - Recall (are we catching the right intents?)

        - Precision (are we classifying correctly?)

        - Hallucination rate (<2% target)

      

      Who cares: Engineering

    
    
      ### Latency Layer

      

        - p95 response time (<3s target)

        - Time to first token

        - Model API uptime

      

      Who cares: Engineering + Product

    
    
      ### User Layer

      

        - CSAT (>4.0 target)

        - % resolved without escalation (60% mo 1)

        - Repeat contact rate (should decline)

      

      Who cares: Product

    
    
      ### Business Layer

      

        - Retention lift (the exec metric)

        - Support cost per ticket

        - Revenue impact

      

      Who cares: Leadership

    
  

  ### Why all four matter

  
    
      Model metrics are perfect but users hate it

      The UX is broken, not the model.

    

    
      Users love it but business metrics are flat

      You're solving a real problem that doesn't move the needle.

    

    
      Latency is great but model is hallucinating

      You're confidently wrong, fast.

    

    
      Everything works but latency is 30s

      Users will abandon before seeing the right answer.

    

  

  > 
    **PM analogy:** You already measure products this way. Uptime (system), page load (latency), NPS (user), revenue (business). AI systems need the same stack. The model layer is just a new row in your metrics dashboard.
  

  ## The Test

  > Eight questions. One per principle. See if you've internalized the framework.

  
  
  
    &larr; Previous
    Next ->
  
  
    
    out of 8

  

  ## The full sequence

  > In an interview, walk through in order. In product work, revisit as you learn.

  
    
      1
      
        ### Users first product thinking

        Pick a segment, map the journey, find the pain.

      
    
    
      2
      
        ### Three pillars architecture

        Name model, data, memory explicitly.

      
    
    
      3
      
        ### Model selection technical fluency

        Argue the tradeoffs, pick, justify.

      
    
    
      4
      
        ### Orchestration systems thinking

        Design the router before the agents.

      
    
    
      5
      
        ### Memory tiers depth

        Session, episodic, semantic. Scoped correctly.

      
    
    
      6
      
        ### Failure modes production readiness

        Name them, detect them, mitigate them.

      
    
    
      7
      
        ### Scale plan operational maturity

        10x traffic, bottlenecks, load testing.

      
    
    
      8
      
        ### Four-layer metrics business judgment

        Model, latency, user, business.

      
    
  

> 
  Framework credit: [Aman Agarwal](https://www.linkedin.com/in/amanagarwal1/), who identified these eight gaps from running live AI PM mock interviews.
