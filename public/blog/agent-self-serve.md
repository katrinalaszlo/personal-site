---
title: "Self-Serve for AI Agents"
date: 2026-05-16
description: "Two Claude Code skills born from making my own sites agent-ready. Discovery, onboarding, and purchase... without a human in the loop."
author: Kat Laszlo
---

# Self-Serve for AI Agents

My background is in product management and self-serve optimization. I spent years on the human version of this problem: conversion funnels, AB testing with tools like Mutiny, analytics for every step from landing page to paid account. The playbook for getting humans through a self-serve funnel is mature.

Agents don't care about any of it. They don't see your hero section. They don't respond to social proof. They can't click through a Stripe Checkout page. The entire conversion toolkit built for humans is irrelevant when the buyer is software.

I wanted to know what the agent version looks like. Can an AI agent find my product, evaluate it, sign up, pick a plan, pay, and start using it without a human involved? Not "AI-powered features." The other kind of agent-ready. Where an agent is the customer.

I manage two sites. A personal site and a B2B product. I started researching best practices for agent accessibility, found people building tools for different pieces of the problem, and kept going back and forth between their sites and mine, implementing changes one benchmark at a time.

That got old fast. So I built the tools.

---

## Two problems, two skills

I have a personal site ([katrinalaszlo.com](https://katrinalaszlo.com)) and a B2B product ([Tanso](https://www.tansohq.com)). Different goals, same question: can an AI agent do anything useful here?

For the personal site, the question is discovery. Can an agent figure out who I am, what I know, and how to reach me?

For Tanso, the question is deeper. Can an agent evaluate the product, sign up, choose a plan, and start sending API calls?

I started by running third-party scanners. [Cloudflare's isitagentready.com](https://blog.cloudflare.com/agent-readiness/) checks for robots.txt, llms.txt, MCP servers, API catalogs. [Fern's Agent Score](https://buildwithfern.com/agent-score) grades documentation on 22 checks. A [lilAgents study](https://lilagents.com/blog/how-the-fortune-500-scores-on-ai-agent-readiness/) scanned the Fortune 500 and found the average score was 25%.

I kept running these checks manually after every deploy. Each tool checked different things, had different output formats, and none of them talked to each other. I wanted one command that ran all the benchmarks and told me what to fix. So I built it.

**[aeo-ready](https://github.com/katrinalaszlo/aeo-ready)** — one command, three benchmarks. Aggregates [agentic-seo](https://github.com/nicholasgriffintn/agentic-seo) (Addy Osmani), [Cloudflare's isitagentready.com](https://isitagentready.com), and [Fern's afdocs](https://buildwithfern.com/agent-score) into a single scan with 52 checks.

```bash
npx aeo-ready scan https://yoursite.com
```

```
  aeo-ready — yoursite.com

  agentic-seo ·································· 91/100 A
    ✓ Discovery              25/25
    ◑ Content Structure      18/25
    ✓ Token Economics        25/25
    ✓ Capability Signaling   15/15
    ✓ UX Bridge               8/10
    vs Cloudflare 55 · Supabase 52 · Vercel 48 · Stripe 17

  Cloudflare ···································· 4/5 B
    10 passed  2 failed
    ✗ robotsTxtAiRules  No rules for AI bots found
    vs Cloudflare 5 · Vercel 4 · Supabase 3 · Stripe 2

  Fern ········································ 83/100 B
    9 passed  4 failed
    ✗ llms-txt-links-markdown  Links point to HTML, no markdown
    ✗ llms-txt-coverage        Covers 67% of sitemap
    vs Stripe 85 · Supabase 78 · Anthropic 72 · Vercel 60

  ──────────────────────────────────────────────────
  Overall                                     85/100

  Next steps
    npx agentic-seo init                          scaffold llms.txt, AGENTS.md
    npx skills add katrinalaszlo/agent-serve      make your product agent-ready

  Fix now? [y/N]
```

Say `y` and it scaffolds missing files — llms.txt, AGENTS.md, skill.md — then runs Fern diagnostics. Scan again to track improvement.

**[agent-serve](https://github.com/katrinalaszlo/agent-serve)** audits whether an agent can actually be your customer. Five dimensions: onboarding, authentication, purchasing, usage monitoring, self-management.

```bash
npx skills add katrinalaszlo/agent-serve
```

---

## The agent self-serve funnel

Agent-readiness is a funnel. Most scanners only check the top layer.

![The agent self-serve funnel](/blog/images/agent-self-serve-funnel.png)

Most scanners check the top layer. Cloudflare checks discovery signals and protocol adoption. Fern checks whether agents can actually fetch and parse your docs. Neither checks whether an agent can sign up, pay, or manage its own account.

agent-serve checks the rest.

---

## How I wired it for Tanso

[Tanso](https://www.tansohq.com) is a B2B monetization platform. It already had Stripe billing and Clerk auth for humans. Making it agent-accessible meant opening the same infrastructure through a different door.

**Signup.** One endpoint: `POST /signup`. Creates a Clerk user, local account, and SDK key in a single call. No browser, no email verification, no OAuth dance. Rate-limited to 3/hr. If the DB insert fails, a compensating delete removes the Clerk user. Agent gets back a scoped API key immediately.

**Auth.** Capability keys with scopes: `events.write`, `usage.read`, `billing.read`, `proxy.chat`. Agents get limited scopes at signup. Elevated scopes (admin, write, alerts) require a human-authenticated `POST /sdk-keys`. Budgets enforce spend limits per key with monthly or daily reset.

**Plan visibility.** `GET /plan` returns the current tier, feature limits, and usage. No dashboard needed.

**Purchase.** Stripe's Billing Portal is browser-only. That's what humans use. For agents, I needed programmatic plan selection and payment.

The first attempt made this seem harder than it was. Stripe's API supports `payment_method` on subscription creation. Agent passes a tokenized card, Stripe creates the subscription. No checkout page. No redirect. No human. One parameter.

**Self-management.** Agents introspect their own key (`GET /sdk-keys/me`), check remaining budget, see expiry. Upgrades and downgrades go through the same Stripe API.

Eleven route groups accepting SDK keys. The middleware tries Clerk JWT first, falls back to SDK key lookup. Same auth, different door.

---

## Running it on other companies

The three benchmarks don't always agree. Stripe has a published [OpenAPI spec](https://github.com/stripe/openapi) and an [agent toolkit](https://docs.stripe.com/agents) supporting five frameworks — it scores well on Fern (85/100) but poorly on agentic-seo (17/100) and Cloudflare (2/5). Cloudflare scores 5/5 on their own scanner but only 55/100 on agentic-seo.

That's the point of aggregating. A single benchmark rewards what it measures. Three benchmarks triangulate what actually matters: can agents find you, read your docs, and use your APIs.

---

## Discovery is catching up. Capability isn't.

Vercel, Linear, Cloudflare, and Telnyx have agents.json. Stripe and Notion don't. llms.txt adoption is spreading fast — most major developer tools have it now.

But discovery is the easy part. An llms.txt file takes 10 minutes. An agents.json manifest takes 30. The hard part is everything below discovery in the funnel: can an agent sign up, authenticate, pay, and manage its own account?

Almost nobody has wired that up. The companies investing in agent readiness are building the discovery layer and stopping there.

---

## Some numbers

**73%** of top API docs sites lack llms.txt ([Fern](https://buildwithfern.com/agent-score)).

**4%** of sites declare AI usage preferences in robots.txt ([Cloudflare](https://blog.cloudflare.com/agent-readiness/)).

**25%** average Fortune 500 agent-readiness score ([lilAgents](https://lilagents.com/blog/how-the-fortune-500-scores-on-ai-agent-readiness/)).

**0** third-party sites I found with agents.json.

---

## What's next

aeo-ready now aggregates all three benchmarks — agentic-seo, Cloudflare, and Fern — in a single scan. 52 checks, company comparisons, score history. I keep adding benchmarks as new ones emerge.

agent-serve covers the rest of the funnel. Five dimensions, scored 0-10, with specific fixes for each gap. Both tools are open source and both are things I use on my own sites. They'll keep evolving as the standards do.

The deeper question: what does self-serve for agents look like end-to-end? Not just discovery. The full funnel. Evaluate, sign up, pay, use, manage. The companies that wire this up first will have a distribution channel that's invisible to everyone else.

If you're working on agent accessibility for your own product, or you've found benchmarks or patterns I'm missing, I'd love contributions to either tool.

```bash
npx aeo-ready scan https://yoursite.com
```

```bash
npx skills add katrinalaszlo/agent-serve
```
