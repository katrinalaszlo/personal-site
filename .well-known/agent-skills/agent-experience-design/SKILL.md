---
name: agent-experience-design
description: >-
  Design products that AI agents can effectively use. Covers Agent Experience (AX)
  four pillars (Access, Context, Tools, Orchestration), agent-readable site standards
  (llms.txt, AGENTS.md, AgentReady, Lighthouse agentic browsing, MCP Server Cards),
  mutual legibility (two-way agent-human communication, three counterintuitive HCI
  findings), the bifurcated web (visible vs invisible, brand-to-bot, AVIO replacing
  SEO), and agent self-serve implementation (programmatic signup, sandbox provisioning,
  capability keys, removing human gates, WebMCP). Use when building agent-facing APIs,
  MCP servers, agent signup flows, agent-readable documentation, pricing for agent
  buyers, or any product surface where AI agents are users. Use when reviewing or
  designing agent UX, agent onboarding, agent auth, or agent billing.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# Agent Experience Design

Design discipline for products that AI agents use. Five interconnected domains.

## When to use this skill

- Building an MCP server or agent-facing API
- Adding agent signup, auth, or billing to your product
- Making documentation agent-readable (llms.txt, AGENTS.md, skills)
- Designing agent UX (plan displays, approval flows, error handling)
- Evaluating agent readiness (AgentReady score, Lighthouse agentic browsing)
- Removing human gates from onboarding (CAPTCHA, email verification, demo walls)

## Core framework: Four AX pillars (Biilmann)

1. **Access**: can agents interact with your product? Permissions, bot detection, programmatic signup.
2. **Context**: does the agent have adequate product knowledge? llms.txt, AGENTS.md, skills, docs.
3. **Tools**: APIs, CLIs, MCP servers. Tool descriptions are the agent's UI.
4. **Orchestration**: async patterns, webhooks, idempotency for multi-step agent workflows.

## The Compound Error Tax

Humans absorb ambiguity. Agents amplify it multiplicatively. Each wrong step narrows valid next steps. The model brings the intelligence. The interface must bring the clarity.

## Three counterintuitive findings (mutual legibility research)

1. First-person hedges ("I'm not sure") reduce overreliance. Generic hedges ("It's not clear") don't.
2. Explanations raise credibility uniformly, including for wrong answers. Show sources, not explanations.
3. Humans adapt their grounding behavior down, not up. The interface must compensate.

## Implementation priority

Week 1: robots.txt, llms.txt, Link headers, run scanners (isitagentready.com, agent-ready.dev, Lighthouse).
Week 2-3: Programmatic signup (POST /api/signup, returns key), sandbox endpoint, remove CAPTCHA/email gates.
Week 4: Agent Skills, MCP server, content negotiation, "Copy as Markdown" on docs.
Week 5+: MCP Server Card, registry listings, agent traffic monitoring.

## Key anti-patterns to avoid

- Silent failure (agent reports success when it failed)
- Permission fatigue (same approval prompt for every action)
- Explanation inflation (more words, worse trust calibration)
- Unscoped API keys (93% of agent projects have this problem)
- "Book a demo" as only path (AX rejection)

## References

See `references/` for detailed content on each domain:
- `agent-experience-ax.md`: Full AX framework, adoption data, ten principles
- `agent-readable-sites.md`: Standards, scoring tools, implementation checklist
- `mutual-legibility.md`: HCI research, grounding problem, anti-patterns
- `bifurcated-web.md`: Two webs, brand-to-bot, AVIO, timeline
- `agent-self-serve.md`: Buyer journey, skills spec, MCP publishing, removing gates
