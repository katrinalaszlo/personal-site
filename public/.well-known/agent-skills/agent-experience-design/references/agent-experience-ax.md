---
impact: CRITICAL
impactDescription: Foundational framework for all agent-facing product design
---

# Agent Experience (AX)

Coined by Mathias Biilmann (Netlify, Jan 2025). "The holistic experience AI agents will have as the user of a product or platform."

## Four pillars

1. **Access**: can agents interact? Permissions, bot detection, human-in-the-loop.
2. **Context**: does the LLM have product knowledge? Context engineering > prompt engineering.
3. **Tools**: APIs, CLIs, MCP servers. Tool docs = agent's UI (Anthropic ACI).
4. **Orchestration**: agent triggering, workflow execution, async patterns at scale.

## The Compound Error Tax (Casys.ai, Mar 2026)

Human operators absorb ambiguity. Agent operators amplify it. Multiplicative: each wrong step narrows the corridor of valid next steps. Example: CLI with deploy/publish/release. Agent picked "publish," silently pushed to npm. Command succeeded. Agent reported success.

## Ten principles

1. Treat agents as first-class user persona
2. Let agents act first, humans claim later
3. Eliminate ambiguity at the interface, not at runtime
4. Ship machine-readable docs alongside human docs
5. Make context engineering part of the product
6. Design tools for agents' affordances
7. Expose MCP as first-class product surface
8. Support granular, programmatic permissions
9. Make onboarding instant, no human-gated friction
10. Build for open agent ecosystem, not captive agent

## Adoption data (mid-2026)

- Stripe: formal AX team, posted engineering manager role
- Vercel: 30% of deployments agent-initiated, +1000% in 6 months, 75% from Claude Code
- Netlify: 96% of new signups via AI tools, ~10K agent-generated sites/day
- AGENTS.md: 60K+ files on GitHub, 28% runtime reduction documented
- Bessemer: AX is "Law #1" in developer-platform thesis

## Three conflicts (AX vs UX)

| Conflict | Resolution |
|---|---|
| Default execution (humans hate dry-run, agents need it) | Ship two modes |
| Error messages (prose vs structured JSON) | Return both |
| Onboarding ("book a demo" = UX win, AX rejection) | Instant programmatic signup + optional human contact |

## The delegation wall

Autonomous task agents (Devin, Lindy, Manus): users can't scope tasks. Lindy ships "Delegation 101." The model can do the work. The user can't specify it. UX design problem, not model problem.
