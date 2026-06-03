---
title: "Making Your Product Agent Self-Serve"
series: "PLG for the Agent Era"
part: 3
date: 2026-06-02
description: "I made an AI cost observability product self-serve for agents. Here's what the industry recommends, what I actually built, what I skipped, and what isn't worth doing yet."
author: Kat Laszlo
---

# Making Your Product Agent Self-Serve

In [Part 2](/blog/site-ready-for-ai), I looked at whether agents can read your site: discovery files, markdown serving, token efficiency. But readability only matters if agents can actually do something when they arrive. This part is about what happens next: can an agent sign up, authenticate, pay, and use your product without a human touching a browser?

I did this for Observe, an AI cost observability platform. I went through the recommendations, built what made sense, skipped what didn't, and packaged the patterns into an [open-source skill](https://github.com/katrinalaszlo/agent-serve) so you can audit your own product. Then I realized I never actually tested any of it with an agent.

That's the honest version. I spent weeks building the "right" agent-ready infrastructure based on industry best practices, and I shipped it without once having an agent try to sign up and use the product. The patterns felt correct. The endpoints were clean. But I couldn't tell you whether a real agent could actually get through the flow end-to-end, because I never checked. If you take one thing from this post, it's that testing with an actual agent should come before building the perfect agent-ready stack, not after.

Here's what I built, what the discourse says you should build, and where those two things diverge.

## The baseline

If you have a self-serve SaaS with an API, you already have most of what agents need. The blockers aren't architectural, they're ceremony. CAPTCHA, email verification, browser-only checkout, dashboard-only settings. These assume a human at a keyboard, and when an agent hits one, it stops.

[Netlify reports](https://www.netlify.com/solutions/code-agents/) that 80% of new signups are now agents. [Gertjan De Wilde at Apideck](https://www.apideck.com/blog/api-design-principles-agentic-era) calls authentication "arguably the single biggest friction point for agents." If your product has a programmatic path that avoids human ceremony, you're already ahead of most.

## Five areas, what I built for each

### 1. Onboarding

**What they recommend:** API-based account creation with no browser interaction. No CAPTCHA, no email verification, no phone number. Netlify and Prisma use a "deploy-first-claim-later" pattern where agents provision instantly and humans claim ownership within a time window.

**What I did:** `POST /signup` with no auth required, no CAPTCHA, no email verification. Returns a scoped API key in one call. Rate-limited to 3 requests/hour per IP.

```json
POST /api/signup
{ "email": "agent@example.com", "scopes": ["usage.read", "events.write"] }

Response:
{ "key": "obs_...", "scopes": ["usage.read", "events.write"] }
```

The distinction between rate limiting and CAPTCHA matters. Rate limiting constrains volume without blocking agents. CAPTCHA uses browser fingerprinting and behavioral scoring that headless agents can't pass.

**My take:** If your signup requires a browser, agents can't use your product. There's no workaround. This is table stakes.

### 2. Authentication

**What they recommend:** Scoped API keys with rotation, OAuth 2.0 Client Credentials Grant for machine-to-machine auth, [Web Bot Auth](https://datatracker.ietf.org/doc/draft-gupta-httpbis-web-bot-auth/) (IETF draft) for cryptographic agent identity. No magic links, no SMS OTP, no browser-only OAuth consent.

**What I did:** Scoped SDK keys with 14 granular permissions (`events.read`, `events.write`, `billing.read`, `proxy.chat`, etc.). Key rotation via API. Multiple keys per account so different agents get different scopes. Per-key budget caps with configurable periods. And key introspection at `GET /sdk-keys/me` so an agent can check its own permissions and remaining budget.

```json
GET /sdk-keys/me
{
  "auth_type": "sdk_key",
  "scopes": ["usage.read", "events.write", "proxy.chat"],
  "budget_cents": 5000,
  "budget_used_cents": 120,
  "budget_remaining_cents": 4880,
  "budget_period": "month"
}
```

**What I skipped:** OAuth Client Credentials. The SDK key system covers the agent case. Client Credentials is the enterprise-grade pattern for multi-tenant scenarios, and I'd add it when enterprise customers ask for it.

**My take:** Scoped API keys with rotation is the 80/20. The thing most people miss is per-key budgets. An agent operating on behalf of a customer needs to know its spending limits. Without that, it's either overly cautious (asks for permission on everything) or reckless (runs up a bill). Budget introspection gives agents the guardrails to operate autonomously.

### 3. Purchasing

**What they recommend:** JSON plan catalog at `GET /plans`. Programmatic subscription creation via [Stripe's Subscriptions API](https://docs.stripe.com/api/subscriptions). Accept saved payment methods (`pm_...`) so agents can pay without a browser. Publish `pricing.json` for machine-readable pricing discovery.

**What I did:** `GET /plans` returns the full catalog as JSON (Free / Pro $29/mo / Team $99/mo with features and limits). `POST /billing/change-plan` accepts a `payment_method` parameter. If an agent has a saved `pm_...`, the subscription gets created without any browser interaction. It only falls back to a checkout URL when no payment method exists and none is on file.

**What I skipped:** `pricing.json`, even though I designed the schema (it's in the [agent-serve repo](https://github.com/katrinalaszlo/agent-serve/tree/main/schema)). Also skipped Stripe's newer agent commerce primitives: Shared Payment Tokens, Link wallet, the [Agentic Commerce Protocol](https://docs.stripe.com/agentic-commerce).

Most SaaS already uses Stripe. The code to accept a saved payment method exists in your integration. You're just not exposing it as an API parameter, sending agents to a browser redirect instead. Changing that is usually a few lines in your billing endpoint, not a new system.

**My take:** `pricing.json` is the piece I'm most interested in. Agents can't compare your pricing with competitors if it's locked in HTML. I designed a schema covering plans, usage metrics, overage models, compliance certifications, and integration details. Whether it gets adoption is an open question, but the need is real: structured pricing is the missing layer between "agent found your product" and "agent can evaluate whether to buy it."

### 4. Usage monitoring

**What they recommend:** Rate limit headers on every API response. Dedicated usage endpoint with current-period data. Billing API. Threshold webhooks for quota events.

**What I did:** Rate limiting with standard headers (`x-ratelimit-remaining`, `x-ratelimit-reset`). `GET /usage` returns current-period consumption. `GET /plan` returns per-feature limits with remaining counts. Per-key budget tracking with reset dates.

```json
GET /usage
{
  "period": "2026-05",
  "plan": "free",
  "usage": {
    "event_ingest": { "used": 4520, "limit": 10000, "reset": "monthly" },
    "ai_insights": { "used": 12, "limit": 1000, "reset": "monthly" }
  },
  "percent_used": 45.2
}
```

**What I skipped:** Threshold webhooks. I have cost and margin alerts (8 curated types), but not "you're at 80% of your event ingest limit." An agent can poll usage, but it can't get notified proactively.

**My take:** Rate limit headers on every response are the highest-impact, lowest-effort change. Agents use them to self-throttle in real time. Threshold webhooks are the difference between an agent that checks its limits and an agent that reacts to them. I should have built those.

### 5. Self-management

**What they recommend:** Plan changes, cancellation, configuration, team management, all via API. [MCP](https://modelcontextprotocol.io/) server as the agent-facing product interface.

**What I did:** Plan changes via API. SDK key lifecycle (create, rotate, revoke). Feature configuration and pricing rules via API. Alert management (create, update, delete, test). Team management (invite, update role, remove). An A2A query endpoint so other agents can ask structured cost/usage/margin questions.

**What I skipped:** An explicit cancel endpoint (downgrading to free is effectively canceling, but there's no `DELETE /subscription`). Account deletion for GDPR compliance. MCP server.

**My take:** MCP is the right long-term play. It wraps your API so agents can discover and call it natively. But build it after your REST API surface is solid. MCP is a layer on top of APIs, not a replacement, and I've seen people try to skip straight to an MCP server without having proper endpoints underneath it.

## What's not worth doing yet

The agent-ready discourse has a lot of standards that sound important but aren't practical for B2B SaaS today. [Andrew Lipsman](https://mobiledevmemo.com/podcast-re-evaluating-agentic-commerce-with-andrew-lipsman/) calls the broader agentic commerce enthusiasm "a collective hallucination," pointing out that ChatGPT's Instant Checkout experiment [converted three times worse](https://www.modernretail.co/technology/what-went-wrong-with-chatgpts-instant-checkout/) than just sending shoppers back to Walmart's own site. The infrastructure side is similarly early.

| Standard | What it is | Why you can skip it |
|----------|-----------|-------------------|
| **[Stripe ACP / MPP](https://docs.stripe.com/agentic-commerce)** | Commerce protocols for agent marketplaces | Built for the ChatGPT-buys-from-Etsy ecosystem. B2B SaaS just needs to accept `pm_...` through existing Stripe. |
| **Shared Payment Tokens** | Cross-merchant agent payment primitive | Agents that have SPTs use your existing Stripe infrastructure. You don't build anything extra. |
| **x402** | Pay-per-API-call protocol | [Near-zero real adoption](https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet). Usage-based billing through Stripe covers the same need. |
| **Web Bot Auth** | Cryptographic agent identity (IETF draft) | Good direction, but WAFs aren't set up for it yet. Scoped API keys work now. |
| **WebMCP** | HTML form attributes as agent tools | Chrome Canary only. |

These solve problems at the platform layer. They matter for Stripe, Shopify, and Cloudflare, companies building agent infrastructure. For B2B SaaS serving agent customers, the fundamentals move the needle: API signup, scoped keys, programmatic billing, usage visibility.

## Implementation order

If I were starting from scratch:

**Week 1: Remove human gates.** Kill CAPTCHA on programmatic paths. Add API signup that returns an API key in one call. Skip email verification for API-only access.

**Week 2: Auth and keys.** Scoped API keys with granular permissions. Key rotation endpoint. Multiple keys per account.

**Week 3: Billing and usage.** `GET /plans` returning JSON. Accept `payment_method` on your plan-change endpoint. `GET /usage` with current-period data. Rate limit headers on all responses.

**Week 4: Discoverability.** Publish llms.txt. Add an agent card at `/.well-known/agent.json`. Document the programmatic billing path in your API docs.

**Week 5+: Polish.** Per-key budget caps. Usage threshold webhooks. Cancel via API. Account deletion. `pricing.json`. MCP server.

## The skill

I packaged the patterns from this work into an open-source Claude Code skill that audits any product against these five areas:

```bash
npx skills add katrinalaszlo/agent-serve
```

Run `/agent-serve https://your-product.com` on a live product or `/agent-serve` from your codebase. It checks onboarding, auth, purchasing, usage monitoring, and self-management, then tells you what to build: specific endpoint signatures, Stripe API patterns, effort estimates, referencing how Stripe, Cloudflare, and Twilio handle the same problems.

You can also install individual areas:

```bash
npx skills add katrinalaszlo/agent-serve --skill agent-serve-purchasing
npx skills add katrinalaszlo/agent-serve --skill agent-serve-auth
```

The recommendations aren't theoretical. They came from building this for Observe, finding the gaps, and packaging what worked. Whether I should have tested with an actual agent before packaging it into best practices is a question I'm still sitting with.
