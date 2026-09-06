---
title: "Agent-Readable Sites"
description: "How to make your website readable and usable by AI agents. Standards, scoring, and practical steps: llms.txt, AgentReady, markdown negotiation, self-serve for agents."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/agent-readable-sites
---

# Agent-Readable Sites

> Making your website discoverable, understandable, and usable by AI agents. Standards, scoring, and practical steps.

## What agents can read

> Your site has two audiences now. One of them can't see your CSS.

Agents need to extract product information and find actions they can take. Clear structure and machine-readable data help them do that, even when they can't use the page's visual cues.

Netlify reports 96% of new signups come via AI tools. Vercel says 30% of deployments are agent-initiated. For developer tools, this is already a use case worth testing.

> **The SEO parallel:** In 2005, companies optimized for Google crawlers: structured data, sitemaps, meta tags. The same shift is happening now for AI agents, but the requirements are different. Google needed links and keywords. Agents need structured context, clean APIs, and machine-readable documentation. The industry calls this AI Visibility Optimization (AVIO) or Generative Engine Optimization (GEO).

| Layer | For Humans | For Agents |
| --- | --- | --- |
| Discovery | Google search, social links, word of mouth | robots.txt, sitemap.xml, Link headers, llms.txt |
| Documentation | Formatted HTML with visuals and navigation | Pure markdown, no presentation noise, structured for token windows |
| Onboarding | Demo videos, tutorials, "book a call" | Instant programmatic access, API keys, no gates |
| Pricing | Tiered cards with psychological anchoring | Structured data: plans, limits, rates, terms in machine-readable format |
| Trust signals | Logos, testimonials, case studies | Verified capabilities, compliance metadata, uptime data |

## Standards and discovery files

> Four layers of agent readiness, from basic discoverability to full capability exposure.

### llms.txt

Proposed by Jeremy Howard in September 2024. A simple text file at `/llms.txt` that provides documentation specifically structured for LLM consumption. Think of it as robots.txt for context: it tells agents what your product does, how to use it, and where to find detailed documentation, all in clean markdown that fits a token window.

# Example llms.txt

# Acme API

> Acme provides usage-based billing for SaaS products.

Docs: https://docs.acme.com/llms-full.txt
API Reference: https://docs.acme.com/api/llms-full.txt
Quickstart: https://docs.acme.com/quickstart.md
Authentication: https://docs.acme.com/auth.md
Pricing: https://acme.com/pricing.md

### AGENTS.md

A community specification for providing agents with project-level context. Over 60,000 files on GitHub as of mid-2026. Documented results across 124 PRs: 28% runtime reduction, 16% token reduction. Works alongside .cursorrules, .windsurfrules, and similar context files. The idea: ship a file that tells any agent how to work with your product.

### Markdown Negotiation

HTTP content negotiation using `Accept: text/markdown`. When an agent requests a page with this header, your server returns the same content in clean markdown instead of HTML. The agent gets structured text without having to parse DOM trees, strip CSS, or guess at content hierarchy. Cloudflare's AgentReady Standard checks for this.

### MCP Server Cards

Model Context Protocol servers expose your product's capabilities as structured tools that agents can discover and invoke. An MCP Server Card is metadata that describes what your MCP server offers: available tools, authentication requirements, rate limits. It makes your API surface discoverable without the agent having to read documentation first.

> **The full stack:** llms.txt for discovery. AGENTS.md for project context. Markdown negotiation for content access. MCP Server Cards for capability exposure. Each layer builds on the previous one. You don't need all four to start. A useful first step is a file that points agents to your docs.

## AgentReady Standard

> Cloudflare's scoring framework for agent-facing web infrastructure. Launched April 2026.

The AgentReady Standard scores websites across four dimensions, 0-100 total. Cloudflare built a free public scanner at isitagentready.com and tracks adoption across the internet's 200,000 most-visited domains via Cloudflare Radar.

Discoverability

/ 25

robots.txt, sitemap.xml, Link Headers (RFC 8288)

Content

/ 25

Markdown for Agents (text/markdown negotiation), llms.txt

Bot Access Control

/ 25

Content Signals in robots.txt, AI bot rules, Web Bot Auth

Capabilities

/ 25

Agent Skills index, API Catalogs (RFC 9727), OAuth/OIDC discovery, MCP Server Cards

Commerce protocols (x402, UCP, ACP) are checked but don't yet affect the score.

> **A real baseline:** When I scanned tansohq.com on isitagentready.com, it scored 25/100. katrinalaszlo.com scored 41/100 (D grade) on orank. Only 3% of sites score B or above. Most of the missing items are static files or response headers, not code changes.

## More scoring tools

> Multiple tools now measure agent readiness from different angles.

### Lighthouse: Agentic Browsing (Chrome DevTools)

Google added an experimental "Agentic Browsing" category to Lighthouse. Unlike other Lighthouse categories, it doesn't produce a traditional 0-100 score. Instead it shows a pass/fail ratio across deterministic audits. Google's framing: "Because the standards for the agentic web are still emerging, the current focus is to gather data and provide actionable signals rather than a definitive ranking."

Lighthouse checks three dimensions that the Cloudflare standard doesn't cover:

### WebMCP Integration

Checks for declarative tools (defined in HTML) and imperative tools (defined in JavaScript) registered via WebMCP. Validates schema correctness and identifies forms that could be exposed as structured tools but aren't. This lets agents use actions already available in your forms.

### Agent-Centric Accessibility

A filtered subset of accessibility audits critical for machine interaction: every interactive element has a programmatic name, roles and parent-child relationships are valid, content isn't hidden from the accessibility tree while being interactive. The a11y tree is the agent's view of your page.

### Stability and Discoverability

Cumulative Layout Shift (CLS) matters for agents: they identify an element, then try to interact with it. If the layout shifts between identification and interaction, the agent clicks the wrong thing. Also checks for llms.txt at the domain root.

> **Why this matters:** Lighthouse's angle is different from Cloudflare's. Cloudflare asks "can agents discover and understand your site?" Lighthouse asks "can agents reliably interact with your site?" Both are necessary. A site that's discoverable but unstable fails when the agent actually tries to use it.

### orank (Era Labs)

ora.run scores sites on whether "agents can find and use" them. Nearly 10,000 sites evaluated, average rank of 37, only 4% achieve a B grade or above. Grades combine a numeric score with a letter grade (e.g., 92A, 85B, 69C). The leaderboard spans nine sectors: Agent Tools, AI/ML, Developer Tools, News/Intelligence, Infrastructure, CRM, Payments/Fintech, E-commerce, and Productivity. Era Labs also offers methodology documentation, an API, and consulting for improving scores.

| Tool | What It Measures | Score Format |
| --- | --- | --- |
| isitagentready.com (Cloudflare) | Discovery, content, bot access, capabilities | 0-100 numeric |
| Lighthouse Agentic Browsing | WebMCP, accessibility tree, layout stability | Pass/fail ratio (experimental) |
| orank (Era Labs) | Broad agent readiness | A-F letter grade |

## Self-Serve for Agents

> Check where onboarding forces an agent to ask its human for help.

Traditional B2B self-serve removes friction for buyers with clear pricing and instant signup. An agent needs a programmatic path through the same steps: discovery, evaluation, signup, configuration, and use. A browser-only step can force a handoff to the human.

### What Agent Self-Serve Looks Like

### Netlify: Deploy First, Claim Later

Agents can deploy a site anonymously without any account. The human claims the project afterward. The agent is the first user, not the human. No signup form, no email verification, no "book a demo." ~10K agent-generated sites deploy this way per day.

### Clerk: Full Agent Setup

Agents can fully install, set up, and preview authentication without any human interaction. The entire auth flow is programmatically accessible. An agent building an app can add auth in one step.

### Prisma: Database Claim Flow

API for agents with a database claim flow. An agent can create an app with data access instantly, no manual database setup required. The provisioning is part of the product surface.

### Linear: Agent Collaboration

You can @mention external agents (like Devin) directly in issue tickets. The agent receives the context and can act on it. No integration setup, no webhook configuration. The agent is a first-class collaborator.

### The Pricing Discovery Problem

Even when the product is agent-accessible, pricing rarely is. When an agent needs to buy software on behalf of a company, it has two options: scrape a pricing page (brittle, incomplete) or hand off to a human (slow, defeats the purpose). B2B pricing is especially bad: enterprise tiers live behind "contact sales," custom quotes require negotiation, and compliance requirements have no structured format.

The emerging solution: expose pricing as structured, machine-readable data. Available plans with feature matrices. Usage limits, overage rates, volume discounts. Contract terms. Trial and signup flows as agent-executable actions. Companies "publish" their pricing for agent consumption the way they publish APIs. MCP servers are the likely delivery mechanism.

> **The shift:** "Book a demo" is a UX conversion win and an AX rejection. Instant programmatic signup with an optional human contact path is the resolution. Every human gate you add is a place where agent-mediated buyers drop off. The question is not "should we remove friction?" It's "which of our friction is accidentally blocking a growing channel?"

## Implementation checklist

> Ordered by effort. Start at the top.

1

### Add robots.txt and sitemap.xml

Static files. No code changes. Tells agents (and crawlers) what exists on your site and what's accessible. If you don't have these, you're invisible to structured discovery.

2

### Create llms.txt

A single markdown file at /llms.txt describing your product, key docs, and API reference links. Takes 30 minutes. Moves you from invisible to discoverable for any LLM that checks for it.

3

### Add Link headers (RFC 8288)

HTTP response headers that point to related resources. A few lines of server config. Helps agents navigate your site without parsing HTML.

4

### Support markdown content negotiation

When a request includes `Accept: text/markdown`, return clean markdown instead of HTML. Requires server-side logic, but the content already exists. Cloudflare Workers or middleware can handle this.

5

### Ship an AGENTS.md

Context file telling agents how to work with your product. What it does, how to authenticate, common patterns, pitfalls. Ships in your repo or at a well-known URL.

6

### Add "Copy as Markdown" to documentation

A button on every doc page that copies the content as clean markdown. Stripe and Netlify already do this. Minimal engineering, immediate value for anyone using an LLM to integrate your product.

7

### Remove human-gated onboarding for programmatic access

If signup requires email verification before API access, add a path that grants sandbox access immediately. If "book a demo" is the only enterprise path, add a programmatic trial tier.

8

### Add WebMCP to forms and interactive elements

WebMCP exposes your site's forms and actions as structured tools that agents can invoke directly. Declarative (HTML attributes) or imperative (JavaScript). Lighthouse's agentic browsing audit checks for this. Start with your most important forms: signup, search, contact.

9

### Publish an MCP server

Expose your product's capabilities as structured tools. Requires building and maintaining the server, documenting tool descriptions (which function as the agent's UI), and handling auth.

10

### Make pricing machine-readable

Structured data for plans, limits, rates, terms. Accessible via API or MCP. The hardest item because B2B pricing is complex and often deliberately opaque.

> **The scan-fix-rescan loop:** Run isitagentready.com on your domain. Note your score. Fix the easiest items (robots.txt, llms.txt, sitemap). Rescan. Repeat. Each iteration is measurable. Items 1-3 can be done in an afternoon. Items 4-6 in a sprint. Items 7-9 are product decisions.

> **Sources:** Cloudflare AgentReady Standard (April 2026), Google Lighthouse Agentic Browsing (experimental), Era Labs orank, Jeremy Howard's llms.txt proposal (September 2024), AGENTS.md community spec, Biilmann's AX framework, Netlify/Clerk/Prisma/Linear public product documentation.
