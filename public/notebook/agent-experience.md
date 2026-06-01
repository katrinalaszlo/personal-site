---
title: "Agent Experience (AX)"
description: "Agent Experience is the design discipline for products that AI agents use. Four pillars, ten principles, and why PMs are well-positioned for this work."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/agent-experience
---

# Agent Experience (AX)

> The design discipline for products that AI agents use. Not a chatbot feature. A new user class.

  
  ## A New Kind of User

  > Agents don't click buttons, scan pages, or feel urgency. They parse structure, follow instructions, and fail silently.

  In January 2025, Mathias Biilmann (CEO of Netlify) coined "Agent Experience" as a parallel to UX and DX. His definition: "the holistic experience AI agents will have as the user of a product or platform." Not about adding a chatbot to your product. About treating agents as a user persona with their own needs, constraints, and failure modes.

  The core shift: when a human uses your product and hits a confusing label, they squint, re-read, maybe check the docs. When an agent hits ambiguity, it picks the most probable interpretation and moves forward with full confidence. There's no squinting. No second-guessing. No "this doesn't feel right." The agent either has enough clarity to act correctly, or it acts incorrectly and reports success.

  > 
    **The Compound Error Tax:** Human operators absorb ambiguity. Agent operators amplify it. And the amplification is multiplicative, because each wrong step narrows the corridor of valid next steps until the only remaining path is the wrong one. "The model brings the intelligence. The interface must bring the clarity."
  

  A concrete example: a CLI with three sibling commands called `deploy`, `publish`, and `release`. An agent picked "publish" when the intent was "deploy," silently pushed a package to npm. The command succeeded. The agent reported success. A developer would have paused, read context, picked the right verb. The agent had none of those friction points working in its favor.

  

    | | Ambiguity response | Squints, re-reads, checks docs | Picks most probable path, proceeds |

      | Error recognition | "This doesn't feel right" | Reports success if command succeeded |

      | Onboarding | Tolerates tutorials, demos, walkthroughs | Needs instant programmatic access |

      | Documentation | Scannable HTML with visuals | Pure markdown, zero presentation noise |

      | Defaults | Prefers execute, dislikes dry-run | Needs dry-run to verify before acting |

      | Error format | Friendly prose with suggestions | Structured JSON with error codes |

    
  

  
  ## Four Pillars

  > Biilmann's framework for what makes a product agent-usable.

  
    
      ### 1. Access

      Can agents interact with your product at all? Are they allowed in? Do permissions support human-in-the-loop workflows? When Biilmann's own Google account was banned because agents triggered fraud detection, this pillar became personal. The shift: from "is this a bot?" to "is this doing something bad?"

    

    
      ### 2. Context

      Does the LLM have adequate product knowledge? This goes beyond prompt engineering into context engineering: llms.txt files, AGENTS.md, CLAUDE.md, documentation structured for machine consumption. If the agent can't ground its understanding in your product, it will hallucinate confidently.

    

    
      ### 3. Tools

      APIs, CLIs, MCP servers, file access, browser control. The capabilities agents need to take action. Tool documentation is literally the agent's UI: writing a tool description is interaction design, not API documentation. The quality of that description determines whether the agent picks the right tool.

    

    
      ### 4. Orchestration

      Can platforms enable agent triggering and workflow execution at scale? This includes async patterns, webhook callbacks, idempotency, and the infrastructure for agents to operate reliably across multi-step workflows without human babysitting.

    

  

  > 
    **The design lineage:** AX sits in a clear sequence. Don Norman coined UX in 1993: the holistic experience humans have with products. Jeremiah Lee popularized DX in 2011: the experience developers have with platforms. Biilmann adds AX in 2025: the experience agents have. Same discipline, new user class. Each expansion unlocked a new design surface that the previous framing didn't address.
  

  
  ## UX Without UI

  > When there's no screen, the design problem doesn't disappear. It changes form.

  Most UX practitioners treat "UX" as synonymous with "UI." Remove the screen and the category seems to vanish. But the experience persists. A developer integrating your API has an experience. An agent parsing your pricing page has an experience. A terminal user running your CLI has an experience. The absence of a visual interface doesn't remove the design problem.

  The right frame is service design, not interaction design. Service design has always dealt with experiences across channels, non-screen touchpoints, and systems rather than individual screens. UX Without UI is service design applied to software.

  ### Where This Shows Up

  
    
      ### API Surfaces

      How an API is structured *is* the UX. Parameter names, error messages, response shapes, rate limit behavior, documentation. When there's no dashboard to fall back on, the API design is the entire interface.

    

    
      ### Agent Instructions

      Writing a CLAUDE.md, a system prompt, or a task spec is a design activity. What does the agent need to know? In what order? What can go wrong? What am I assuming? The medium is text. The design questions are identical to screen design.

    

    
      ### CLI Tools

      GitButler's research found agents use CLI differently from humans: they didn't use `--json`, they always ran status after mutable commands, they preferred `--status-after` flags. Designing for agents requires studying their actual behavior.

    

    
      ### Pricing Pages

      When the buyer is an agent evaluating tools programmatically, charm pricing and anchoring don't work. The constraint shifts from "what can a person understand" to "what is machine-readable." The pricing page is infrastructure, not marketing.

    

  

  > 
    **Why PMs fit this work:** Product managers already do UX Without UI constantly. Writing user stories is designing experience without building it. Specs are the interface between intent and execution. PRDs, acceptance criteria, API contracts: all design artifacts without a screen. As the "how" of software gets cheaper, the "what" and "why" get more valuable. The PM skill of translating intent into precise specification is exactly what agents need.
  

  
  ## Adoption, Mid-2026

  > This is not a prediction. These are current numbers.

  
    
      30%

      Vercel deployments initiated by agents
    
    
      96%

      Netlify new signups via AI tools
    
    
      60K+

      AGENTS.md files on GitHub
    
  

  

    - **Stripe** has a formal "Agent Experience" team with a posted engineering manager role. Mission: "make Stripe as seamless and powerful for AI agent users as it is for human users."

    - **Salesforce** has "Agentic Experience Specialist" job titles.

    - **Bessemer Venture Partners** calls AX "Law #1" in their developer-platform thesis: "Today's developer platforms require equal attention to both AX and DX."

    - **Vercel**: +1000% growth in agent deployments over 6 months. 75% from Claude Code alone. Agent-deployed projects are 20x more likely to call AI inference APIs.

    - **Netlify**: ~10K agent-generated sites per day. Documentation quality is tested by whether an agent can single-shot a feature from the markdown.

  

  
  ## Ten Principles

  > Compiled from the Agent Experience Report 2026 (40+ primary sources).

  
    1. **** Not an afterthought. Not a chatbot bolt-on. A separate persona with its own needs, tested with its own flows.

    2. **** Netlify lets agents deploy anonymously, then the human claims the project. The agent is the first user, not the human.

    3. **** If three CLI commands could be confused, the interface is wrong. Don't rely on the model to pick the right one.

    4. **** llms.txt, AGENTS.md, pure markdown versions. The same content, stripped of presentation noise.

    5. **** Context engineering, not prompt engineering. The product ships its own context: config files, agent rules, structured knowledge.

    6. **** Agents don't have eyes, hands, or spatial memory. They have token windows, tool descriptions, and structured outputs. Design for what they actually have.

    7. **** Model Context Protocol is becoming the standard for agent-tool integration. An MCP server is a product interface, not a developer convenience.

    8. **** Agents need scoped access, not all-or-nothing. Read vs write. Sandbox vs production. Per-resource, not per-account.

    9. **** "Book a demo" is a UX win and an AX rejection. Instant programmatic signup, optional human contact. No gates.

    10. **** Don't lock agents into your agent. Build for any agent: Claude, GPT, Gemini, open-source, custom. Open protocols win.

  

  
  ## Where AX and UX Collide

  > Most of the time, investing in one pillar lifts the others. The conflicts are specific.

  AX, UX, and DX are not the same discipline with three names. They are three disciplines that mostly align but diverge at specific, predictable points. The divergences are invisible until production.

  

    | | Default execution | Humans hate dry-run mode. Agents need it to verify before acting. | Ship two modes. Default to execute for humans, dry-run for agents. |

      | Error messages | Humans need friendly prose. Agents need structured JSON with codes. | Return both in a single response. |

      | Onboarding friction | "Book a demo" is a UX conversion win. For agents, it's a dead end. | Instant programmatic signup with optional human contact path. |

    
  

  > 
    **The delegation wall:** Autonomous task agents (Devin, Lindy, Manus) have hit a visible problem: users can't scope tasks. Lindy ships "Delegation 101" as onboarding material. Manus reviews are dominated by ambiguous-instruction complaints. The model can do the work. The user can't specify it. This is a UX design problem, not a model capability problem.
  

> 
  **Sources:** Biilmann's AX keynotes and blog posts (2025-2026), Agent Experience Report 2026 (Casys.ai), Martin Recke at NEXT Conference, Cloudflare AgentReady Standard, GitButler CLI agent research, Stripe/Vercel/Netlify public data.
