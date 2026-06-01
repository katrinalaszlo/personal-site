---
title: "Is Your Site Ready for Agents?"
series: "PLG for the Agent Era"
part: 2
date: 2026-05-29
description: "Five competing frameworks now score how well your site serves AI agents. Here's what they check, whether it matters, and a single command that runs them all."
author: Kat Laszlo
---

# Is Your Site Ready for Agents?

In [Part 1](/blog/agent-self-serve), I made the case that agents are already changing how B2B buyers research and select vendors. [73% of buyers use AI for research](https://learn.g2.com/ai-search-surging-for-b2b-buyers), and [69% end up choosing a different vendor](https://learn.g2.com/g2-2026-ai-search-insight-report) than they originally planned. The agent is shaping who wins before anyone visits your website.

So: can agents actually read your site?

For 25 years, SEO was how you got found. Meta tags, sitemaps, clean URLs, schema.org markup. AI agents still use all of that — sitemaps and structured data show up in every benchmark — but a new set of standards is emerging on top of it. Agents also care about whether your content is token-efficient, serves markdown, and exposes capabilities programmatically. This new layer has a name: AEO, or Agentic Engine Optimization. Whether it actually matters yet is an open question, but the frameworks are here.

## What AI agents actually look for

When an agent visits your site, it's looking for things that didn't exist two years ago.

The most basic is `llms.txt`, a manifest file (like robots.txt, but for LLMs) that links to your most important pages in a format optimized for context windows. `AGENTS.md` goes further and declares what an agent can *do* on your site: permissions, capabilities, tool endpoints.

Agents also want markdown. HTML boilerplate burns tokens, and markdown is 3-5x more efficient, so if your server can respond with markdown when an agent requests it via Accept headers, that's a real advantage. Same idea with content structure: if the actual content is buried under nav bars, cookie banners, and JavaScript, agents have to parse through all of it to get to what matters.

Then there's capability signaling. Do you expose `agents.json`, MCP endpoints, or other machine-readable manifests? These tell agents what they can do programmatically on your site, which is the difference between "I found this product" and "I can try this product."

## Five standards, five tools, one problem

The AEO space is already fragmenting. Five major benchmarks have emerged, and each checks different things.

[**agentic-seo**](https://github.com/nicholasgriffintn/agentic-seo), built by Nicholas Griffin and inspired by Addy Osmani's AEO framework, scores five dimensions: discovery, content structure, token economics, capability signaling, and UX bridge. It's the most comprehensive single framework, with 10 checks across those 5 categories on a 0-100 scale.

[**Cloudflare's isitagentready.com**](https://isitagentready.com) takes a different approach. It checks discoverability, content accessibility, bot access policies, API/MCP/A2A protocol discovery, and commerce readiness, scoring sites on five levels.

[**Fern's afdocs**](https://github.com/fern-api/afdocs) focuses on llms.txt quality: link resolution, markdown availability, content negotiation, content parity between HTML and markdown versions, and sitemap coverage. 23 checks, scored 0-100.

[**Vercel's Agent Readability Spec**](https://sdk.vercel.ai/docs/foundations/agents) checks agent reachability, discoverability, markdown serving, and HTML agent-friendliness across 25 checks.

[**AgentGrade**](https://agentgrade.com) goes the deepest, covering MCP, payment protocols, identity standards, content negotiation, OpenAPI, and infrastructure with 57 checks.

Every framework checks for llms.txt, but only Fern validates whether its links actually resolve. Cloudflare and AgentGrade check for MCP endpoints; agentic-seo doesn't. Vercel cares about markdown serving; AgentGrade cares about payment protocols. No single benchmark covers everything, and running all five manually across different scoring scales is a pain.

## One command, every score

I built [**aeo-ready**](https://github.com/katrinalaszlo/aeo-ready) to solve this. One command runs all five benchmarks in parallel:

```
npx aeo-ready scan yoursite.com
```

Here's what my own site looks like after a few rounds of fixes:

```
aeo-ready — katrinalaszlo.com

agentic-seo ······························· 94/100 A
  ✓ Discovery              25/25
  ◑ Content Structure      19/25
  ✓ Token Economics        25/25
  ✓ Capability Signaling   15/15
  ✓ UX Bridge              10/10

Cloudflare ··································· 4/5 B
  10 passed

Fern ······································ 86/100 B
  14 passed  8 failed

Vercel ···································· 80/100 B
  20 passed  5 failed

AgentGrade ······························· 98/100 A+
  40 passed  17 failed

──────────────────────────────────────────────────
Overall                                     88/100
```

88/100 across all five. The remaining Fern failures are mostly about markdown content parity — making the markdown and HTML versions of every page identical. AgentGrade's failures are optional standards (payment protocols, identity, message signatures) that don't apply to a personal site.

## How it works under the hood

When you scan a URL, aeo-ready fetches your site's robots.txt, llms.txt, AGENTS.md, sitemap.xml, and every page from your sitemap into a temp directory. It uses content negotiation (`Accept: text/markdown`) to get markdown versions of pages, and follows discovery files like `.well-known/agent-skills/index.json` to find skill definitions. Then it runs each benchmark in parallel against the fetched content. If one framework fails, the others still report. Scores normalize to percentages and average into an overall 0-100.

After the scan, it offers to fix issues automatically by scaffolding llms.txt and AGENTS.md via agentic-seo, then running afdocs remediation. Results save locally so you can track improvement over time.

You can also pass `--dir` to point it at your build output or public directory for checks that need filesystem access. This is faster than fetching over HTTP and works offline.

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

If you're hoping llms.txt will boost your visibility in ChatGPT or Perplexity results, the data is not encouraging. An [analysis of 62,000+ AI bot requests over 90 days](https://searchengineland.com/does-llms-txt-matter-467740) found that only 84 went to llms.txt — 0.1% of AI bot traffic. Google's John Mueller has [called markdown pages "a stupid idea"](https://www.getpassionfruit.com/blog/should-i-create-an-llms.txt-file-google-s-2026-guidance-explained) and confirmed that Google doesn't use llms.txt. No major AI provider has publicly committed to reading it for search citations.

But AI search citations and agent workflows are two different things. The same file doing nothing for ChatGPT search is doing real work in the agentic layer, where Claude Code, Cursor, and Windsurf fetch context and choose tools on behalf of developers. Anthropic [explicitly recommends llms.txt](https://docs.anthropic.com/en/docs/build-with-claude/agent-readability) in its Writing for Agents guidance. Chrome's Lighthouse 13.3 [added an Agentic Browsing audit](https://searchengineland.com/google-llms-txt-chrome-lighthouse-478246) that checks for it.

The frameworks themselves have issues too. Cloudflare's scanner is [structurally misleading for content sites](https://joost.blog/agent-ready/) because the default scan includes commerce and API checks that don't apply, so content sites score artificially low. Vercel's own evaluation found that [AGENTS.md outperformed skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) in agent tasks, and skills weren't even invoked 56% of the time. The model just didn't bother to look them up.

The site type problem is something I ran into myself. A content site shouldn't lose points for missing payment protocols or commerce endpoints. I'm planning to add a `--type` flag to aeo-ready that filters checks by site type so the score actually reflects what matters for your use case.

My take: these scores measure whether agents *can* read your site, not whether they *will*. Right now only [10% of sites](https://otterly.ai/blog/the-llms-txt-experiment/) have adopted llms.txt after 18 months of industry conversation. That means the bar is low. If you're building a developer-facing product and agents are part of how people will find and evaluate you, being in the top 10% on readiness costs almost nothing and positions you for an agent web that's still forming. If you're a local bakery, skip it.

## What to do about it

Start by scanning your site:

```
npx aeo-ready scan yoursite.com
```

The easy wins are usually discovery files (add `llms.txt` and `AGENTS.md` if you don't have them; the scanner offers to scaffold both) and markdown support (if you can serve pages as `.md`, do it, because it cuts token cost by 3-5x). After that, re-scan and track. Scores save locally.

## How I went from 47 to 88

My first scan scored a 47. Here's what I fixed, in the order that moved the needle:

| Round | What I changed | Before | After | Why it mattered |
|-------|---------------|--------|-------|-----------------|
| 1 | Added `llms.txt` and `AGENTS.md` | 47 | 62 | agentic-seo went from 23 to 24. Cloudflare jumped from 2/5 to 4/5. These two files are the single biggest lever. |
| 2 | Passed `--dir ./public` to agentic-seo | 62 | 85 | agentic-seo scans files on disk — it checks content structure, token counts, and capability manifests that it can't see over HTTP. Score went from 24 to 91. |
| 3 | Added content negotiation in middleware | 85 | 87 | Configured Next.js middleware to serve markdown via `Accept: text/markdown` headers. Fern's content negotiation check went from fail to partial pass. |
| 4 | Expanded `llms.txt` coverage, added body directives | 87 | 88 | llms.txt only covered 8 of 21 sitemap pages. Added all 18 notebook entries and pointed blog links to `.md` versions. Added `/llms.txt` footer link to all 33 HTML pages — Fern checks the page body, not `<head>` link tags. Fern went from 79 to 86. |

The remaining gaps are mostly markdown content parity (Fern wants the markdown and HTML versions of every page to be identical) and User-Agent-based content negotiation (Vercel's spec checks User-Agent, not just Accept headers). Diminishing returns from here.

## What's next

Whether or not AEO drives discovery today, the next question is what happens when an agent does reach your product. Part 3 will cover onboarding, auth, purchasing, and account management — what it actually takes to let an agent sign up, try your product, and buy it without a human touching a browser.
