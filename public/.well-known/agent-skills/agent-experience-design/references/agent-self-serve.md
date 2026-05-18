---
impact: CRITICAL
impactDescription: Implementation playbook for making any SaaS product agent-accessible
---

# Agent Self-Serve Implementation

## Agent buyer journey (8 steps)

1. Discover (llms.txt, AgentReady)
2. Learn (docs, pricing, capabilities in machine-readable format)
3. Evaluate (compare against alternatives, needs normalized data)
4. Ask questions (MCP-accessible knowledge base)
5. Try (instant sandbox, no auth required)
6. Sign up (programmatic, no CAPTCHA, no email loop)
7. Integrate (AGENTS.md, MCP server, agent-optimized docs)
8. Pay (machine-readable pricing, programmatic checkout)

## Agent Skills spec

Directory with SKILL.md. Progressive disclosure: metadata (~100 tokens at startup), instructions (<5000 tokens on activation), references (on demand).

Key rule: trigger context must be in description frontmatter, not the body. Body loads only after activation.

Best examples: Supabase (impact-rated references), Stripe (decision-routing table + benchmarks), Netlify (one skill per primitive, CI validation).

## MCP server publishing

Tool design rules (Anthropic ACI):
- Namespace: resource.action (customers.create)
- Search, not list (never expose "list all")
- response_format enum (concise ~500 tokens, detailed ~2000)
- Cap at ~25k tokens per response
- Say when NOT to use, include latency and rate limits
- Unambiguous names (customer_id not customer)
- Actionable errors (what failed + what to do next)

Auth: OAuth 2.1 + PKCE for remote. API key fallback for dev. Restricted/scoped keys.

Discovery: Server Card at /.well-known/mcp-server-card, MCP Registry, PulseMCP/Glama/Smithery directories.

## Removing human gates

| Gate | Fix |
|---|---|
| CAPTCHA | Web Bot Auth (IETF draft, cryptographic identity) |
| Email verification | API key auth for machine clients, verify on claim |
| "Book a demo" | Self-serve sandbox + usage-based upgrade |
| Credit card required | Free tier or trial with claim flow |

Deploy-first-claim-later: Netlify (anonymous deploy, 1hr claim), Prisma (npx create-db, 24hr claim).

## Capability keys (the auth gap)

93% of AI agent projects use unscoped API keys (Grantex 2026).

Six layers of agent access control:
1. Identity (who) - Clerk/Auth0
2. Account billing (org spend) - Stripe/Metronome
3. Key scoping (what can this key do) - NOBODY
4. Key budgeting (how much can this key spend) - NOBODY
5. Key expiry (when does access end) - NOBODY
6. Delegation (on whose behalf) - NOBODY

Fix: per-key scopes, budgets, expiry, delegation. The key carries: who you are, what you can do, how much you can spend, when it expires.

## Validation tools

- isitagentready.com (Cloudflare, 0-100)
- agent-ready.dev (Vercel, 15 site + 23 page checks)
- Lighthouse Agentic Browsing (WebMCP, a11y tree, CLS)
- agentic-seo CLI (Addy Osmani)

## Implementation timeline

Week 1: robots.txt, Content-Signal, llms.txt, Link headers, run scanners.
Week 2-3: POST /api/signup, M2M tokens, /v1/sandboxes, claim flow, remove gates.
Week 4: WebMCP, content negotiation, Agent Skills, "Copy as Markdown."
Week 5+: MCP server, Server Card, registry listings, agent traffic monitoring.
