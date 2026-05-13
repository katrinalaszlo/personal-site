---
impact: HIGH
impactDescription: Standards and scoring tools for making sites agent-discoverable and usable
---

# Agent-Readable Sites

## Standards stack

- **llms.txt** (Jeremy Howard, Sep 2024): markdown at /llms.txt describing product, docs, API links
- **AGENTS.md**: project-level context for coding agents. 60K+ on GitHub. 28% runtime reduction.
- **Markdown negotiation**: Accept: text/markdown returns clean markdown instead of HTML
- **MCP Server Cards**: metadata at /.well-known/mcp-server-card describing capabilities
- **Agent Skills**: SKILL.md + references/ for domain expertise. Progressive disclosure.

## Scoring tools

| Tool | Measures | Format |
|---|---|---|
| isitagentready.com (Cloudflare) | Discovery, content, bot access, capabilities | 0-100 |
| agent-ready.dev (Vercel) | 15 site-wide + 23 per-page checks | Pass/fail |
| Lighthouse Agentic Browsing | WebMCP, accessibility tree, layout stability | Pass/fail ratio |
| orank (Era Labs) | Broad agent readiness, 10K sites | A-F grade |
| agentic-seo CLI (Addy Osmani) | llms.txt, robot blocking, token counts | CLI report |

## AgentReady Standard (Cloudflare, April 2026)

Four categories, 0-100 total:
1. Discoverability (robots.txt, sitemap.xml, Link headers)
2. Content (markdown negotiation, llms.txt)
3. Bot Access Control (Content-Signal directives, Web Bot Auth)
4. Capabilities (Agent Skills, API catalogs, OAuth discovery, MCP Server Cards)

## Implementation checklist (by effort)

1. robots.txt + sitemap.xml (static files, no code)
2. llms.txt (30 minutes)
3. Link headers RFC 8288 (server config)
4. Markdown content negotiation (middleware)
5. AGENTS.md (repo context)
6. "Copy as Markdown" on docs (Stripe, Netlify do this)
7. Remove human-gated onboarding for API access
8. WebMCP form annotations (toolname, tooldescription)
9. MCP server
10. Machine-readable pricing

## Self-serve for agents

Pattern: deploy-first-claim-later. Netlify: anonymous deploy, 1hr claim. Prisma: npx create-db, 24hr claim.

"Book a demo" is a UX conversion win and an AX rejection. Instant programmatic signup with optional human contact path.
