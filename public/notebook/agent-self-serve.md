---
title: "Making Your Product Agent Self-Serve"
description: "The implementation playbook: Agent Skills, MCP servers, agent-ready docs, programmatic signup, and removing human gates. Week-by-week from zero to agent self-serve."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/agent-self-serve
---

# Making Your Product Agent Self-Serve

> The implementation playbook. From invisible to fully agent-accessible, week by week.

  
  ## The Agent Buyer Journey

  > Eight steps between "agent discovers your product" and "agent pays for it."

  When an AI agent evaluates your product, it follows a predictable path. Each step either works programmatically or the agent bounces. Most products fail at step 2 or 3.

  
    1### Discover

Agent finds the product exists. llms.txt, AgentReady scoring, search APIs.

    2### Learn

Agent understands what it does. Docs, pricing, capabilities in machine-readable format.

    3### Evaluate

Agent compares against alternatives. Needs structured, normalized data.

    4### Ask questions

Agent clarifies specifics. MCP-accessible knowledge base, agent-to-agent Q&A.

    5### Try

Agent tests the product. Instant sandbox, no auth required, API keys on demand.

    6### Sign up

Agent creates an account. Programmatic signup, no CAPTCHA, no email loop.

    7### Integrate

Agent builds with it. AGENTS.md, MCP server, agent-optimized docs.

    8### Pay

Agent purchases. Machine-readable pricing, programmatic checkout.

  

  
  ## Agent Skills

  > Teach agents how to use your product. A directory with a SKILL.md file.

  The Agent Skills spec (Anthropic, Oct 2025, open-sourced Dec 2025) is the standard for giving agents domain expertise about your product. Adopted by Claude Code, Codex CLI, Gemini CLI, Cursor, and others.

  A skill is a directory:

  your-product/
  SKILL.md          # Required: YAML frontmatter + instructions
  references/       # Optional: detailed docs loaded on demand
  scripts/          # Optional: executable code
  assets/           # Optional: templates, data files

  The key design pattern is **progressive disclosure**. Three tiers of token cost:

  

    | | Metadata (name + description) | ~100 | At startup, for ALL installed skills |

      | Instructions (SKILL.md body) | <5,000 | When the agent activates the skill |

      | References (files in references/) | Unlimited | On demand, when the agent needs detail |

    
  

  > 
    **The single most important rule:** Trigger context must be in the description frontmatter, not the body. The body only loads after activation, so if the trigger keywords are in the body, the agent will never know to activate the skill. Supabase's description lists every product, library, framework, and keyword an agent might encounter.
  

  ### Who does this well

  
    
      ### Supabase

      Two-tier: one catch-all skill + one deep-dive per domain. 30+ reference files with `impact: CRITICAL|HIGH|MEDIUM|LOW` frontmatter so agents prioritize which references to load. CI validation on every PR.

    

    
      ### Stripe

      Decision-routing table mapping use cases to APIs to reference files. Hard constraints up front ("Never include payment_method_types"). Published benchmarks proving skill-guided agents outperform raw agents.

    

  

  Generate a starting point from your OpenAPI spec: `npx openapi-to-skills ./openapi.yaml -o ./output`. Then hand-edit. Install skills with: `npx skills add https://github.com/your-org/repo`.

  
  ## MCP Server

  > Give agents tools to take action in your product.

  An MCP (Model Context Protocol) server exposes your product's capabilities as structured tools. The agent discovers available tools, calls them, and gets structured responses. Three distribution models:

  

    | | Remote hosted | You host an endpoint (Streamable HTTP). Agents connect over HTTPS. | Stripe (mcp.stripe.com) |

      | npm package | Users run locally via `npx @your-org/mcp` | Linear, most OSS servers |

      | Both | Remote for production, local for dev | Stripe (the gold standard) |

    
  

  ### Tool Design (Anthropic ACI)

  Tool descriptions are the agent's UI. Every word in the name, description, and parameter docs shapes how agents understand and use the tool.

  

    | | Namespace tools | `customers.create`, not `create` |

      | Search, not list | Never expose "list all." Force search/filter. |

      | Response format | Add `response_format` enum: "concise" (~500 tokens) or "detailed" (~2000 tokens) |

      | Cap output | Max ~25k tokens. Paginate with clear "next page" guidance. |

      | Say when NOT to use | Include expected latency, rate limits, and alternative tools in the description. |

      | Unambiguous names | `customer_id` not `customer`. `thread_id` not `id`. |

      | Actionable errors | "Not authorized for conversation 'abc'. Request access from owner or use a different thread_id." |

    
  

  ### Discovery

  Serve a Server Card at `/.well-known/mcp-server-card` (SEP-2127, Draft). Register on the official MCP Registry. Submit to directories: PulseMCP (14.8k+ servers), Glama (21k+), Smithery (7k+). Publish to npm for local dev installs.

  > 
    **Auth pattern:** OAuth 2.1 + PKCE for remote servers (spec-mandated). API key fallback for developer convenience. Use restricted/scoped keys to control which tools each key can access. Stripe does exactly this.
  

  
  ## Agent-Ready Docs

  > Same content, stripped of presentation noise.

  ### llms.txt

  A markdown file at `/llms.txt`. H1 with product name, blockquote summary, H2 sections with link lists. Takes 30 minutes. Moves you from invisible to discoverable.

  # Observe

> AI cost observability. See which customers and features are unprofitable.

## Docs
- [Getting Started](https://docs.observe.tansohq.com/quickstart): Setup in 5 minutes
- [API Reference](https://docs.observe.tansohq.com/api): REST API endpoints
- [Billing Models](https://docs.observe.tansohq.com/billing): Usage tracking setup

## Optional
- [Changelog](https://docs.observe.tansohq.com/changelog): Release history

  ### More doc layers, by effort

  

    | | AGENTS.md in repo root | 30 min | Every coding agent reads it on project open |

      | llms.txt at domain root | 30 min | LLMs discover your docs exist |

      | .md URL suffix (Stripe pattern) | 1 hour | Every doc page available as clean markdown |

      | llms-full.txt (all docs concatenated) | Half day | RAG pipelines and IDE indexing |

      | "Copy as Markdown" button | Half day | Anyone using an LLM to integrate your product |

      | Content negotiation (Accept: text/markdown) | 1-2 days | Agents get markdown automatically on every page |

      | OpenAPI spec at /openapi.json | Varies | Agents discover API capabilities on the fly |

    
  

  > 
    **Quality test:** Netlify tests doc quality by whether an agent can single-shot the feature from the markdown alone. Write the doc, hand it to an agent with no other context, see if the agent ships working code. If not, the doc needs work. One caveat: LLM-generated AGENTS.md files hurt success rates. Developer-written, minimal, precise files help.
  

  
  ## Removing Human Gates

  > Every gate that requires a human is a place where agents bounce.

  
    
      GateWhy it blocks agentsFix
    
    
      CAPTCHA
      AI solves reCAPTCHA v2 at 100%. Stops humans, not bots.
      Web Bot Auth (IETF draft). Cryptographic identity, not puzzles.
    
    
      Email verification
      Agents don't have inboxes.
      API key auth for machine clients. Verify on claim, not signup.
    
    
      "Book a demo"
      Hard wall. No programmatic path.
      Self-serve sandbox + usage-based upgrade. Demo for enterprise only.
    
    
      Credit card required
      Agents can't enter payment info.
      Free tier or trial with claim flow. Monetize after value is proven.
    
    
      Phone/SMS
      Agents don't have phones.
      Skip for API-only access. Add for human-facing upgrades.
    
  

  ### The Deploy-First-Claim-Later Pattern

  
    
      ### Netlify

      `netlify deploy --allow-anonymous` creates a live site with no account. Generates a claim URL. Human has 1 hour to claim ownership. The deploy-and-claim pattern: provision first, authenticate later.

    

    
      ### Prisma

      `npx create-db@latest` provisions a Postgres database instantly. No auth required. Lives 24 hours. Claim URL makes it permanent for free. Management API enables programmatic provisioning.

    

  

  > 
    **The scoping problem:** A 2026 audit found 93% of AI agent projects use unscoped API keys. No scope narrowing, no depth limits, no cascade revocation. Ship scoped, short-lived tokens from day one. The fix: restricted keys that control which tools/endpoints each key can access, with automatic expiry.
  

  
  ## Implementation Timeline

  > Ordered by effort and impact. Start at week 1.

  
    Week 1
    
      ### Zero code changes

      Audit robots.txt (remove blanket Disallow for agents). Add Content-Signal directives (search=yes, ai-input=yes, ai-train=no). Create llms.txt. Add Link headers for llms.txt, sitemap, skills index. Run isitagentready.com + Lighthouse agentic browsing audit. Fix what they flag.

    

    Week 2-3
    
      ### Auth + provisioning

      Add API-key-based signup path (POST /api/signup, returns key, no UI required). Ship M2M token endpoint for service-to-service auth. Build /v1/sandboxes endpoint (returns scoped credentials + TTL, no signup gate). Implement claim flow (sandbox to claim URL to permanent account). Remove CAPTCHA from API paths. Remove email verification for API-only access.

    

    Week 4
    
      ### Agent UX polish

      Annotate key forms with WebMCP attributes (toolname, tooldescription, toolautosubmit). Serve markdown variants on Accept: text/markdown. Publish Agent Skills (SKILL.md + references/). Add "Copy as Markdown" button to docs.

    

    Week 5+
    
      ### Full agent surface

      Publish MCP server (remote + npm). Serve Server Card at .well-known/mcp-server-card. Register on MCP Registry + directories. Publish skills index at .well-known/agent-skills/index.json. Monitor agent traffic separately from human traffic.

    
  

  
  ## Validation Tools

  > Measure where you are. Rescan after every change.

  

    | | isitagentready.com | Discovery, content, bot access, capabilities, commerce | 0-100 score |

      | agent-ready.dev | 15 site-wide + 23 per-page checks (Vercel Agent Readability Spec) | Pass/fail checklist |

      | Lighthouse Agentic Browsing | WebMCP, accessibility tree, layout stability, llms.txt | Pass/fail ratio |

      | orank (ora.run) | Broad agent readiness across 9 sectors | A-F grade + numeric |

      | agentic-seo CLI | llms.txt, robot blocking, token counts, markdown availability | CLI report |

    
  

  > 
    **The loop:** Scan. Fix the easiest items. Rescan. Repeat. Each iteration is measurable. Week 1 items (robots.txt, llms.txt, Link headers) can move you from D to C in an afternoon. Auth + provisioning (weeks 2-3) is what separates "discoverable" from "usable." MCP + skills (weeks 4-5) is what separates "usable" from "self-serve."
  

> 
  **Sources:** Agent Skills spec (agentskills.io), Cloudflare Skills Discovery RFC, Anthropic ACI framework, MCP spec (SEP-2127), Stripe/Supabase/Netlify public implementations, Clerk M2M docs, Prisma create-db, Vercel Agent Readability Spec, Lighthouse Agentic Browsing, Content Signals spec, Web Bot Auth (IETF draft), Grantex State of Agent Security 2026.
