---
title: "Is Your Site Ready for AI?"
series: "PLG for the Agent Era"
part: 2
date: 2026-05-29
description: "Five competing frameworks now score how well your site serves AI agents. Here's what they check, why it matters, and a single command that runs them all."
author: Kat Laszlo
---

# Is Your Site Ready for AI?

In [Part 1](/blog/agent-self-serve), I made the case that agents are already changing how B2B buyers research and select vendors. [73% of buyers use AI for research](https://learn.g2.com/ai-search-surging-for-b2b-buyers), and [69% end up choosing a different vendor](https://learn.g2.com/g2-2026-ai-search-insight-report) than they originally planned. The agent is shaping who wins before anyone visits your website.

So: can agents actually read your site?

For 25 years, SEO was how you got found. Meta tags, sitemaps, clean URLs, schema.org markup. AI agents don't care about any of that. They care about whether your content is machine-readable, token-efficient, and structured for consumption, not just discovery. The new version of this problem has a name: AEO, or Agentic Engine Optimization.

## What AI agents actually look for

When an agent visits your site, it's looking for things that didn't exist two years ago.

The most basic is `llms.txt`, a manifest file (like robots.txt, but for LLMs) that links to your most important pages in a format optimized for context windows. `AGENTS.md` goes further and declares what an agent can *do* on your site: permissions, capabilities, tool endpoints.

Agents also want markdown. HTML boilerplate burns tokens, and markdown is 3-5x more efficient, so if your server can respond with markdown when an agent requests it via Accept headers, that's a real advantage. Same idea with content structure: if the actual content is buried under nav bars, cookie banners, and JavaScript, agents have to parse through all of it to get to what matters.

Then there's capability signaling. Do you expose `agents.json`, MCP endpoints, or other machine-readable manifests? These tell agents what they can do programmatically on your site, which is the difference between "I found this product" and "I can try this product."

## Five standards, five tools, one problem

The AEO space is already fragmenting. Five major benchmarks have emerged, and each checks different things.

[**agentic-seo**](https://github.com/nicholasgriffintn/agentic-seo), created by Addy Osmani at Google, scores five dimensions: discovery, content structure, token economics, capability signaling, and UX bridge. It's the most comprehensive single framework, with 10 checks across those 5 categories on a 0-100 scale.

[**Cloudflare's isitagentready.com**](https://isitagentready.com) takes a different approach. It checks discoverability, content accessibility, bot access policies, API/MCP/A2A protocol discovery, and commerce readiness, scoring sites on five levels.

[**Fern's afdocs**](https://github.com/fern-api/afdocs) focuses on llms.txt quality: link resolution, markdown availability, content negotiation, content parity between HTML and markdown versions, and sitemap coverage. 23 checks, scored 0-100.

[**Vercel's Agent Readability Spec**](https://sdk.vercel.ai/docs/foundations/agents) checks agent reachability, discoverability, markdown serving, and HTML agent-friendliness across 25 checks.

[**AgentGrade**](https://agentgrade.com) goes the deepest, covering MCP, payment protocols, identity standards, content negotiation, OpenAPI, and infrastructure with 70+ checks.

They overlap in some areas and diverge in others, which means running one isn't enough, but running all five manually and comparing scores across different scales is a pain.

## One command, every score

I built [**aeo-ready**](https://github.com/katrinalaszlo/aeo-ready) to solve this. One command runs all five benchmarks in parallel:

```
npx aeo-ready scan yoursite.com
```

Here's what my own site looks like after a few rounds of fixes:

```
aeo-ready — katrinalaszlo.com

agentic-seo ·························· 92/100 A
  ✓ Discovery              25/25
  ◑ Content Structure      18/25
  ✓ Token Economics        25/25
  ✓ Capability Signaling   15/15
  ✓ UX Bridge               8/10

Cloudflare ····························· 4/5 B
  10 passed  2 failed

Fern ································ 84/100 B
  12 passed  10 failed

──────────────────────────────────────────────────
Overall                                     87/100
```

87/100. Not bad, but there's still work to do on Fern (llms.txt link resolution, markdown content parity) and Cloudflare (content signals in robots.txt).

## How it works under the hood

When you scan a URL, aeo-ready fetches your site's robots.txt, llms.txt, AGENTS.md, sitemap.xml, and every page from your sitemap into a temp directory. Then it runs each benchmark in parallel against the fetched content. If one framework fails, the others still report. Scores normalize to percentages and average into an overall 0-100.

After the scan, it offers to fix issues automatically by scaffolding llms.txt and AGENTS.md via agentic-seo, then running afdocs remediation. Results save locally so you can track improvement over time.

You can also pass `--dir` to point it at your build output or public directory for checks that need filesystem access. This matters because agentic-seo, in particular, scores much lower in URL-only mode since most of its checks (content structure, token economics, capability signaling) need to read your files directly.

```
URL-only:  agentic-seo 23/100 (F)
With --dir: agentic-seo 92/100 (A)
```

## How the big sites score

Nobody aces everything, not even the companies building AI infrastructure:

| Site | agentic-seo | Cloudflare | Fern |
|------|------------|------------|------|
| Cloudflare | 55 | 5/5 | — |
| Stripe | 17 | 2/5 | 85 |
| Supabase | 52 | 3/5 | 78 |
| Vercel | 48 | 4/5 | 60 |
| Anthropic | — | — | 72 |

Stripe scores a 17 on agentic-seo but leads on Fern. Cloudflare aces its own framework but scores a 55 on agentic-seo. The standards are still forming, and even the companies defining them haven't fully optimized for all of them.

## What to do about it

Start by scanning your site:

```
npx aeo-ready scan yoursite.com
```

The easy wins are usually discovery files (add `llms.txt` and `AGENTS.md` if you don't have them; the scanner offers to scaffold both) and markdown support (if you can serve pages as `.md`, do it, because it cuts token cost by 3-5x). After that, re-scan and track. Scores save locally. Treat AEO like you treat Lighthouse scores: check on every deploy.

My own site went from 47 to 87 in a few sessions. Most of those gains came from adding llms.txt, configuring content negotiation in middleware, and fixing robots.txt to explicitly allow AI crawlers.

## What's next

AEO gets you found. But being found is just the beginning of the funnel. In [Part 3](/blog/onboarding-agents), I'll cover what happens after an agent discovers your product: onboarding, auth, purchasing, and account management. What does it actually take to let an agent sign up, try your product, and buy it without a human touching a browser?
