---
title: "The Bifurcated Web"
description: "The web is splitting into two layers: a visible web for humans and an invisible web for agents. What this means for products, marketing, and discovery."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/bifurcated-web
---

# The Bifurcated Web

> The web is splitting into two layers. A visible web for humans. An invisible web for agents. Both serve the same products through different interfaces.

## Two interfaces, one product

> Human and agent interfaces for the same product.

For 30 years, the web had one audience: humans with browsers. AI agents introduce a second audience that reads the same web but consumes it completely differently. They don't render CSS. They don't click buttons. They don't respond to social proof or urgency cues. They parse structure, evaluate data, and take action.

I expect both interfaces to persist. People will still use websites, while agents need ways to read the same information and act on it programmatically.

### Visible Web

For humans. Continues evolving toward richer, more immersive experiences.

- HTML/CSS/JS rendered visually

- Brand storytelling, hero sections, social proof

- Psychological pricing, anchoring, urgency

- SEO: keywords, backlinks, page speed

- Conversion funnels, A/B tests, CTAs

- Trust signals: logos, testimonials, case studies

/

### Invisible Web

For agents. Built on different principles: machine-readable, API-first, structured data.

- llms.txt, AGENTS.md, markdown negotiation

- Structured product data, capability metadata

- Machine-readable pricing: plans, limits, terms

- AVIO/GEO: agent visibility optimization

- MCP servers, API catalogs, OAuth discovery

- Trust signals: compliance metadata, uptime, SLAs

> **The precedent:** This already happened once. When Google became the dominant discovery mechanism, companies built a second layer of their web presence: structured data, sitemaps, meta tags, page speed optimization. None of that was visible to human visitors. All of it determined whether humans could find the site. The same pattern is repeating with agents as the new discovery layer.

## Brand-to-Bot

> Three new interaction dimensions that replace B2B and B2C.

Brent Turner's framework (presented at NEXT Conference, December 2025) reframes business interactions for the agent era. The traditional B2B/B2C categories assume humans on both sides. When agents mediate decisions, three new interaction patterns emerge:

### 1. Brand-to-Bot

Brands must win over personal agents. Your customer's AI assistant is evaluating your product based on price, values, trust signals, and capability metadata. It's not reading your landing page copy. It's parsing structured data and comparing you against alternatives. The question shifts from "does our website convert?" to "does our structured data win agent evaluations?"

### 2. Bot-to-Brand

Personal agents initiate interactions autonomously: booking, purchasing, registering, requesting quotes. The agent contacts your business on behalf of the human. Your product needs to be ready to receive and process agent-initiated requests. If your signup requires CAPTCHA, email verification, or "schedule a call," the agent bounces.

### 3. Bot-to-Bot

Brand systems and personal agents transact directly: negotiating terms, validating compliance, confirming purchases. No human in the loop. This is where protocols like x402 (HTTP-native micropayments), MCP (capability discovery), and structured pricing data become infrastructure requirements, not nice-to-haves.

> **The great decoupling:** Andreas Cappell (Accenture Song) puts it bluntly: "You're using ChatGPT all day but only having brand contacts a few times a week." Agents are filtering decisions before they reach humans. If your brand isn't legible to the agent layer, you're not even in the consideration set by the time the human makes a choice.

## From SEO to AVIO

> AI Visibility Optimization is SEO for the agent layer.

Traditional SEO optimized for Google's crawlers: keywords, backlinks, page speed, structured data. AI Visibility Optimization (AVIO, also called GEO for Generative Engine Optimization) optimizes for a different set of consumers: LLMs and agents that read your content, evaluate it, and decide whether to recommend or use your product.

| Dimension | SEO (Google Era) | AVIO (Agent Era) |
| --- | --- | --- |
| Discovery mechanism | Keyword matching, PageRank | llms.txt, AGENTS.md, MCP Server Cards |
| Content format | HTML with meta tags | Clean markdown, structured data, API catalogs |
| Trust signals | Backlinks, domain authority | Capability metadata, compliance data, uptime SLAs |
| Conversion | Click-through rate, form fills | Agent task completion, programmatic signup success |
| Measurement | Rankings, organic traffic | Agent inclusion rate, recommendation frequency |
| Optimization target | Appear in search results | Be selected by agent evaluations |

Agent evaluations add another question to discovery: can the agent extract enough information to compare your product and recommend it? Being found is only the first step.

> **The measurement gap:** SEO has mature analytics: rankings, impressions, click-through rates. AVIO has almost nothing. You can't easily measure how often agents recommend your product, or how they score you against competitors. This gap is a problem and an opportunity. Useful analytics would show where agents fail to find information or complete a task.

## How we got here

> The bifurcation didn't happen overnight.

Sep 2024
**llms.txt proposed** by Jeremy Howard. First standard specifically for LLM consumption of web content.

Nov 2024
**MCP released** by Anthropic. Model Context Protocol becomes the standard for agent-tool integration, creating a formal invisible-web interface.

Jan 2025
**Biilmann coins AX**. Agent Experience framed as parallel to UX and DX. The invisible web gets a design discipline.

Mid 2025
**Developer tools adopt AX**. Clerk, Neon, Supabase, MongoDB, Daytona, TanStack, Vite build agent-facing interfaces. bolt.new and Lovable surge.

Sep 2025
**"3 Billion Developers"**. Biilmann argues AI tools expand the developer TAM from 17M JavaScript developers to 3B people who can now build software. The invisible web's audience expands 100x.

Dec 2025
**NEXT Conference**. Martin Recke names the bifurcated web. Brent Turner introduces brand-to-bot framework. Andreas Cappell describes "the great decoupling."

Jan 2026
**"AX is the new UX"**. Biilmann expands the frame beyond developer tools to all digital experiences.

Feb 2026
**Biilmann's agent gets banned** by Google for "bot-like behavior." The visible web's fraud detection actively fights the invisible web's legitimate users.

Apr 2026
**AgentReady Standard launches**. Cloudflare creates a scoring framework for the invisible web. Now measurable.

## What to check in your product

> Practical implications for product teams.

### Marketing splits in two

Your marketing site serves humans. Your llms.txt, AGENTS.md, and MCP server serve agents. Both channels need attention. The agent channel is growing faster. Most marketing teams haven't started on it.

### Documentation is product

Netlify tests documentation quality by whether an agent can single-shot the feature from the markdown. If the agent fails, the docs are insufficient. The doc quality bar just got measurable and higher.

### Fraud detection needs rethinking

When Biilmann's agent got banned by Google, it exposed a systemic problem: bot detection heuristics designed to block bad actors also block legitimate agents. The shift: from "is this a bot?" to "is this doing something bad?" Zeno Rocha (Resend) removed bot detection from login entirely.

### Competitive moats change

When agents evaluate products, brand recognition and visual design matter less. Structured capability data, integration quality, and programmatic accessibility matter more. Agents need those capabilities to be accessible and clearly described.

> **The question:** Martin Recke's closing line at NEXT Conference: "The website isn't ending. The question is whether your digital presence is legible to the new readers of the web." The visible web continues. The invisible web is being built alongside it. Check that both interfaces describe the same product and support the tasks your customers need.

> **Sources:** Martin Recke at NEXT Conference (December 2025), Brent Turner's brand-to-bot framework, Andreas Cappell (Accenture Song), Biilmann's AX keynotes and blog posts (2025-2026), Cloudflare AgentReady Standard (April 2026), Netlify/Vercel adoption data.
