---
title: "I Made My Sites Self-Serve for AI Agents"
date: 2026-05-16
description: "Two Claude Code skills born from making my own sites agent-ready. Discovery, onboarding, and purchase... without a human in the loop."
author: Kat Laszlo
---

# I Made My Sites Self-Serve for AI Agents

If you're running a SaaS product and haven't thought about whether an agent can sign up, pay, and use it without a human... you're about to lose deals you'll never know existed.

I spent the last few months making two of my properties fully agent-accessible. Not "AI-powered features" agent-ready. The other kind. The kind where an agent lands on your site, understands what you sell, creates an account, picks a plan, pays, and starts using the product. No browser. No human. No support ticket.

I captured the process as two open-source Claude Code skills.

---

## Two problems, two skills

I have a personal site ([katrinalaszlo.com](https://katrinalaszlo.com)) and a B2B product ([Tanso](https://www.tansohq.com)). Different goals, same question: can an AI agent do anything useful here?

For the personal site, the question is discovery. Can an agent figure out who I am, what I know, and how to reach me?

For Tanso, the question is deeper. Can an agent evaluate the product, sign up, choose a plan, and start sending API calls?

I started by running third-party scanners. [Cloudflare's isitagentready.com](https://blog.cloudflare.com/agent-readiness/) checks for robots.txt, llms.txt, MCP servers, API catalogs. [Fern's Agent Score](https://buildwithfern.com/agent-score) grades documentation on 22 checks. A [lilAgents study](https://lilagents.com/blog/how-the-fortune-500-scores-on-ai-agent-readiness/) scanned the Fortune 500 and found the average score was 25%.

I kept running these checks manually after every deploy. So I built the tool.

**[agent-web](https://github.com/katrinalaszlo/agent-web)** scores your site on three layers (discoverable, parseable, actionable), then generates the missing files directly into your repo.

**[agent-serve](https://github.com/katrinalaszlo/agent-serve)** audits whether an agent can actually be your customer. Five dimensions: onboarding, authentication, purchasing, usage monitoring, self-management.

```bash
npx skills add katrinalaszlo/agent-web
npx skills add katrinalaszlo/agent-serve
```

---

## The agent self-serve funnel

Agent-readiness is a funnel. Most scanners only check the top layer.

![The agent self-serve funnel](/blog/images/agent-self-serve-funnel.png)

Cloudflare, Fern, and every other scanner checks discovery. Do you have llms.txt? Score.

agent-serve checks the rest.

---

## How I wired it for Observe

[Observe](https://github.com/katrinalaszlo/observe) is my open-source AI cost observability tool. It already had Stripe billing and Clerk auth for humans. Making it agent-accessible meant opening the same infrastructure through a different door.

**Signup.** One endpoint: `POST /signup`. Creates a Clerk user, local account, and SDK key in a single call. No browser, no email verification, no OAuth dance. Rate-limited to 3/hr. If the DB insert fails, a compensating delete removes the Clerk user. Agent gets back a scoped API key immediately.

**Auth.** Capability keys with scopes: `events.write`, `usage.read`, `billing.read`, `proxy.chat`. Agents get limited scopes at signup. Elevated scopes (admin, write, alerts) require a human-authenticated `POST /sdk-keys`. Budgets enforce spend limits per key with monthly or daily reset.

**Plan visibility.** `GET /plan` returns the current tier, feature limits, and usage. No dashboard needed.

**Purchase.** Stripe's Billing Portal is browser-only. That's what humans use. For agents, I needed programmatic plan selection and payment.

The first attempt made this seem harder than it was. Stripe's API supports `payment_method` on subscription creation. Agent passes a tokenized card, Stripe creates the subscription. No checkout page. No redirect. No human. One parameter.

**Self-management.** Agents introspect their own key (`GET /sdk-keys/me`), check remaining budget, see expiry. Upgrades and downgrades go through the same Stripe API.

Eleven route groups accepting SDK keys. The middleware tries Clerk JWT first, falls back to SDK key lookup. Same auth, different door.

---

## Running it on other companies

![Agent-readiness scores across companies](/blog/images/agent-self-serve-scorecard.png)

Stripe scores 6/10 on a flat rubric despite having an [MCP server](https://mcp.stripe.com), a published [OpenAPI spec](https://github.com/stripe/openapi), and an [agent toolkit](https://docs.stripe.com/agents) supporting five frameworks.

The flat score doesn't capture capability depth. Nobody's does. Not Cloudflare's, not Fern's, not mine.

The signals that matter depend on what you're solving for. Discovery or capability. Can agents find you, or can agents use you.

---

## Nobody has agents.json

Not Stripe. Not Vercel. Not Linear. Not Notion.

Everyone has robots.txt. Most developer tools now have llms.txt. MCP servers are spreading. But agents.json, the machine-readable manifest that tells an agent what you are and what you can do? Zero third-party sites.

[AgentMail](https://www.agentmail.to/), whose entire product is infrastructure for AI agents, doesn't have llms.txt on their marketing site. Their customers find them through SDK installs, not web crawling.

Discovery signals matter when agents need to find you by crawling. Capability signals matter when agents need to use you. Most companies are building the capability layer and skipping discovery.

---

## Some numbers

**73%** of top API docs sites lack llms.txt ([Fern](https://buildwithfern.com/agent-score)).

**4%** of sites declare AI usage preferences in robots.txt ([Cloudflare](https://blog.cloudflare.com/agent-readiness/)).

**25%** average Fortune 500 agent-readiness score ([lilAgents](https://lilagents.com/blog/how-the-fortune-500-scores-on-ai-agent-readiness/)).

**0** third-party sites I found with agents.json.

---

## What's next

I'm adding a benchmark mode that hits Cloudflare's scanner and Fern's Agent Score as external validation.

The deeper question: what does self-serve for agents look like end-to-end? Not just discovery. The full funnel. Evaluate, sign up, pay, use, manage. The companies that wire this up first will have a distribution channel that's invisible to everyone else.

```bash
npx skills add katrinalaszlo/agent-web
npx skills add katrinalaszlo/agent-serve
```
