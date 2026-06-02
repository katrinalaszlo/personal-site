---
title: "Is Your Site Ready for Agents?"
series: "PLG for the Agent Era"
part: 2
date: 2026-05-29
description: "Five competing frameworks now score how well your site serves AI agents. Here's what they check, whether it matters, and a single command that runs them all."
author: Kat Laszlo
---

# Is Your Site Ready for Agents?

In [Part 1](/blog/agent-self-serve), I made the case that agents are already changing how B2B buyers research and select vendors. [73% of buyers use AI for research](https://learn.g2.com/ai-search-surging-for-b2b-buyers), and [69% end up choosing a different vendor](https://learn.g2.com/g2-2026-ai-search-insight-report) than they originally planned.

So if agents are shaping who wins, the question becomes: can they actually read your site?

For 25 years, SEO was how you got found. Meta tags, sitemaps, clean URLs, schema.org markup. AI agents still use all of that (sitemaps and structured data show up in every benchmark), but a new set of standards is emerging on top of it. Agents also care about whether your content is token-efficient, serves markdown, and exposes capabilities programmatically. This new layer has a name: AEO, or Agentic Engine Optimization. Whether it actually matters yet is an open question, but the frameworks are here.

## What AI agents actually look for

When an agent visits your site, it's looking for things that didn't exist two years ago.

The most basic is `llms.txt`, a manifest file (like robots.txt, but for LLMs) that links to your most important pages in a format optimized for context windows. `AGENTS.md` goes further and declares what an agent can *do* on your site: permissions, capabilities, tool endpoints.

Agents also want markdown. HTML boilerplate burns tokens, and markdown is 3-5x more efficient, so if your server can respond with markdown when an agent requests it via Accept headers, that's a real advantage. Same idea with content structure: if the actual content is buried under nav bars, cookie banners, and JavaScript, agents have to parse through all of it to get to what matters.

Then there's capability signaling. Do you expose `agents.json`, MCP endpoints, or other machine-readable manifests? These tell agents what they can do programmatically on your site, which is the difference between "I found this product" and "I can try this product."

## Five standards, five tools, one problem

The AEO space is already fragmenting. Five major benchmarks have emerged, and each checks different things:

| Framework | What it checks |
|-----------|---------------|
| [agentic-seo](https://github.com/addyosmani/agentic-seo) (Addy Osmani) | Discovery, content structure, token economics, capability signaling, UX bridge |
| [Cloudflare](https://isitagentready.com) | Discoverability, bot access, API/MCP/A2A protocols, commerce readiness |
| [Fern afdocs](https://github.com/fern-api/afdocs) | llms.txt quality, link resolution, markdown parity, content negotiation |
| [Vercel](https://sdk.vercel.ai/docs/foundations/agents) | Agent reachability, discoverability, markdown serving, HTML friendliness |
| [AgentGrade](https://agentgrade.com) | MCP, payment protocols, identity, content negotiation, OpenAPI |

Every framework checks for llms.txt, but only Fern validates whether its links actually resolve. Cloudflare and AgentGrade check for MCP endpoints; agentic-seo doesn't. Vercel cares about markdown serving; AgentGrade cares about payment protocols. No single benchmark covers everything, and running all five manually across different scoring scales is a pain.

## One command, every score

I built [**aeo-ready**](https://github.com/katrinalaszlo/aeo-ready) to run all five benchmarks in parallel and prioritize the most common recommendations.

```
npx aeo-ready scan yoursite.com
```

My first scan scored a 48. I ran the scan, copied the prioritized recommendations into a coding agent, and rescanned. Two passes got me to 91.

The first pass handled the quick wins: adding `llms.txt` and `AGENTS.md`, configuring content negotiation in middleware, and expanding llms.txt coverage. That got me from 48 to 87. The second pass tackled the bigger lifts: creating `.md` files for all 18 notebook pages, adding agent User-Agent detection to middleware, and injecting `<link rel="llms-txt">` across every HTML page. That pushed the score from 87 to 91.

The remaining failures are things I chose not to fix: optional identity protocols and infrastructure standards that don't apply to a personal site. The easy wins for any site are discovery files (`llms.txt` and `AGENTS.md`) and markdown support (serving pages as `.md` cuts token cost by 3-5x).

![aeo-ready scan output](/blog/images/aeo-ready-scan.png)

## How the big sites score

Nobody aces everything, not even the companies building AI infrastructure:

| Site | agentic-seo | Cloudflare | Fern | Vercel | AgentGrade |
|------|------------|------------|------|--------|------------|
| Stripe | 17 | 1/5 | 84 | 68 | 65 |
| Cloudflare | 20 | 3/5 | 85 | 80 | — |
| Supabase | 20 | 4/5 | 82 | 71 | 83 |
| Vercel | — | 2/5 | 75 | 63 | 59 |

*Scanned June 1, 2026 via aeo-ready (URL-only mode).*

Stripe scores a 17 on agentic-seo but leads on Fern. Cloudflare scores 3/5 on its own framework. Vercel scores a 63 on its own spec. The standards are still forming, and even the companies defining them haven't fully optimized for all of them.

## Does any of this actually matter?

Fair question. The honest answer is that it depends on what you're optimizing for.

If you're hoping llms.txt will boost your visibility in ChatGPT or Perplexity results, the data is not encouraging. An [analysis of 62,000+ AI bot requests over 90 days](https://searchengineland.com/does-llms-txt-matter-467740) found that only 84 went to llms.txt, just 0.1% of AI bot traffic. Google's John Mueller has [called markdown pages "a stupid idea"](https://www.getpassionfruit.com/blog/should-i-create-an-llms.txt-file-google-s-2026-guidance-explained) and confirmed that Google doesn't use llms.txt. No major AI provider has publicly committed to reading it for search citations.

But AI search citations and agent workflows are two different things. The same file doing nothing for ChatGPT search is doing real work in the agentic layer, where Claude Code, Cursor, and Windsurf fetch context and choose tools on behalf of developers. Anthropic [explicitly recommends llms.txt](https://docs.anthropic.com/en/docs/build-with-claude/agent-readability) in its Writing for Agents guidance. Chrome's Lighthouse 13.3 [added an Agentic Browsing audit](https://searchengineland.com/google-llms-txt-chrome-lighthouse-478246) that checks for it.

The frameworks themselves have issues too. Cloudflare's scanner is [structurally misleading for content sites](https://joost.blog/agent-ready/) because the default scan includes commerce and API checks that don't apply, so content sites score artificially low. Vercel's own evaluation found that [AGENTS.md outperformed skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) in agent tasks, and skills weren't even invoked 56% of the time. The model just didn't bother to look them up.

There's also a site type problem. A content site loses points for missing payment protocols. An API product loses points for missing blog-style markdown. The scores mix up "not relevant to your site" with "not ready for agents." I'm planning to add a `--type` flag to aeo-ready that filters checks by site type, so the score reflects what actually matters for your use case instead of penalizing you for features you'd never build.

My take: These scores measure whether agents *can* read your site, not whether they *will*. Right now only [10% of sites](https://otterly.ai/blog/the-llms-txt-experiment/) have adopted llms.txt after 18 months of industry conversation. The bar is low. If you're building a developer-facing product and agents are part of how people will find and evaluate you, being in the top 10% on readiness costs almost nothing and positions you for an agent web that's still forming. If you're a local bakery, skip it.

## What's next

Whether or not AEO drives discovery today, the next question is what happens when an agent does reach your product. Part 3 will cover onboarding, auth, purchasing, and account management. What it actually takes to let an agent sign up, try your product, and buy it without a human touching a browser.
