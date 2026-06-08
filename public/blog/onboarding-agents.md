---
title: "Onboarding Agents"
series: "PLG for the Agent Era"
part: 3
date: 2026-06-08
description: "What it actually takes to let an agent sign up, try your product, and buy it. Without a human touching a browser."
author: Kat Laszlo
---

# Onboarding Agents

Last week I asked whether an agent can understand your website. This week: once it does, once it lands on your site and decides your product is worth trying, can it actually sign up?

For most products, no. The product works fine. The front door doesn't. Almost every SaaS flow hides a browser somewhere. Email verification loops, CAPTCHA, API keys you can only generate from a dashboard, browser-only checkout, settings buried behind a UI. Humans barely notice. Agents hit a wall at every step.

The reflex is to say self-serve is dead, that PLG had its moment and agents killed it. Some people are already calling the replacement "Agent-Led Growth," a model where agents autonomously run the revenue workflows humans used to click through. I don't buy it. Self-serve relocated. Clear pricing, low friction, fast time-to-value. Every decision that made PLG work still matters. It just has to be made at the API layer, not only the visual one.

An agent evaluating your product asks the same questions a developer on a free trial asks. Can I sign up without talking to anyone? Can I see what this costs? Can I try it before I commit? Can I scale up and down? The only difference is that every answer now has to be API-accessible, not just well-designed in a UI.

This isn't hypothetical. [Ramp shipped Agent Cards](https://ramp.com/blog/introducing-agent-cards). [Stripe shipped the Agent Toolkit](https://docs.stripe.com/agent-toolkit). Vercel lets agents buy credits without opening a browser. Your next customer might not be a person.

## The Agent Onboarding Funnel

When a human signs up for your product, they move through a funnel. Create an account, prove they're real, pick a plan, start using it, manage it over time. Agents move through the exact same funnel. The problem is that most products put a browser wall at every stage.

| | 1. Onboard | 2. Auth | 3. Purchase | 4. Manage |
|---|---|---|---|---|
| **Question** | Can I create an account? | Can I prove who I am? | Can I pick a plan and pay? | Can I change, scale, cancel? |

Every stage has a human version (signup form, login page, checkout, settings panel) and an API version. Most products built the first. Almost nobody built the second.

### Stage 1: Onboarding

Can an agent go from zero to "has an account with API access" without opening a browser?

**What Blocks Agents**

CAPTCHA / reCAPTCHA. Email verification loops. SMS OTP. Manual approval queues ("we'll review your application"). Multi-step browser wizards. Device fingerprinting that flags headless browsers.

**What Works**

`POST /v1/accounts` returns account ID + API key in one response. No email loop. No browser. Stripe does this. Cloudflare does this. One call, you're in.

Developer tools are converging on deploy-first, claim-later. [Netlify](https://www.netlify.com/solutions/code-agents/) lets you push a site live anonymously and claim the account after. Prisma provisions a database before you've verified an email. Agent provisions immediately, human claims ownership later.

Security still matters. The separation is between "start using the product" and "prove you're a human." The tradeoffs are real. Removing CAPTCHA has implications. But alternatives exist: [Web Bot Auth](https://datatracker.ietf.org/doc/draft-gupta-httpbis-web-bot-auth/) (the RFC 9421 profile, live at Cloudflare, AWS WAF, and Vercel), cryptographic agent identity, IP reputation scoring. You don't have to choose between blocking agents and blocking bots.

### Stage 2: Authentication

Can an agent prove its identity without a human performing a ceremony?

**Auth Methods, Ranked for Agents**

| Rating | Method | Notes |
|---|---|---|
| **Best** | API keys with scopes | Simple, revocable, granular. The standard. |
| **Best** | OAuth Client Credentials | Machine-to-machine. No browser redirect. The grown-up option. |
| **Okay** | Service accounts with key pairs | Google Cloud model. Works, but heavier setup. |
| **Friction** | OAuth Authorization Code + PKCE | Requires browser redirect. Blocks agents unless a human pre-authorizes. |
| **Hostile** | Magic links / email OTP | Requires inbox access. Agents don't have inboxes. |
| **Impossible** | CAPTCHA | Designed to block automation. Replace with Web Bot Auth or proof-of-work. |

Most products already support API keys. The gap is that key generation still requires a dashboard visit. If a human has to log in, click "API Keys," and copy a token, the agent can't self-serve. The fix: A `POST /v1/api-keys` endpoint that generates scoped keys programmatically.

### Stage 3: Purchasing

Can an agent see what it costs, pick a plan, and pay?

Most B2B pricing is hidden behind "Contact Sales." Agents don't contact sales. And even when pricing is published, it's in a format agents can't parse. Comparison tables in HTML, feature matrices in PDFs, "starting at $X" with an asterisk.

**What Blocks Agents**

"Contact Sales" gates. Browser-only Stripe Checkout. Pricing pages that only render in HTML tables. No plan catalog API. Payment requires human-interactive flow.

**What Works**

`GET /v1/plans` returns a machine-readable catalog. `POST /v1/subscriptions` creates one. A human saves a payment method once (Stripe Setup Intent), and the agent reuses it. Publish `pricing.json` at your domain root for discovery.

The pattern is: human sets guardrails, agent executes within them. A human authorizes a payment method and sets a spending ceiling. The agent evaluates plans, selects one, and purchases, all inside the pre-authorized boundary. Ramp's Agent Cards work exactly like this. Tokenized cards tied to specific transactions, with spending limits and approval workflows.

### Stage 4: Account Management

Once the agent is in, can it manage itself?

Upgrade plans. Change configuration. Monitor usage. Cancel if needed. Most products lock all of this behind a settings page. The agent equivalent is simple. Every settings page needs an API endpoint behind it.

`GET /v1/usage` Current-period consumption, remaining quota, burn rate.

`PATCH /v1/subscription` Upgrade, downgrade, change billing cycle.

`PUT /v1/config` Update product configuration.

`DELETE /v1/subscription` Cancel (with confirmation semantics).

Rate limit headers on every response: `x-ratelimit-remaining`, `x-ratelimit-reset`

Threshold webhooks so agents can self-throttle before they hit limits.

## The Maturity Ladder

Not every product needs to be agent-first tomorrow. But it helps to know where you stand.

**Level 0: Agent-Hostile.** Browser-only. No API. CAPTCHA. "Contact sales." Agents cannot use this product.

**Level 1: API Exists.** REST API for core features. API keys (manually generated). Docs available. But no programmatic signup, billing, or management.

**Level 2: Agent-Possible.** API signup with some friction. Scoped API keys. Usage visible via API. Billing still requires dashboard.

**Level 3: Agent-Friendly.** Full programmatic onboarding. OAuth Client Credentials. Plan selection + payment via API. Usage + billing API. Configuration via API.

**Level 4: Agent-First (emerging).** Zero-friction provisioning. Spending policies. Agent identity verification. Possibly MCP as a product interface. Early movers: Stripe, Cloudflare. Nobody is fully here yet.

Access and quality are separate dimensions. A product can be Level 3 (full API access) but developer-hostile. Vague errors, no test mode, broken pagination. Or Level 1 (minimal API) but beautifully designed. Structured errors, idempotency, OpenAPI spec. Access gets agents in the door. Quality determines whether they stay.

## Two Readers, Two Interfaces

Your product now has two kinds of users. Agents interact through APIs and MCP tools. Humans interact through dashboards, Slack bots, and in-app copilots ([CopilotKit](https://www.copilotkit.ai/), [Vercel AI SDK](https://sdk.vercel.ai/), and others). Same capabilities, same permissions, same data. Different surfaces. A human asks "what's my usage?" in the dashboard. An agent hits `GET /v1/usage`. A team lead types `/tanso usage acme` in Slack. The API layer you build for agents is the foundation. The human surfaces are views on top of it.

## agent-serve: Audit Your Own Product

I kept seeing the same gaps across products, so I built [agent-serve](https://github.com/tansohq/agent-serve). It's a set of Claude Code skills that walk each stage of the funnel and tell you what's blocking agents. Onboarding, auth, purchasing, usage, management, dev quality. Point it at a URL or run it against your codebase.

Each area gets the same report: What exists today, what blocks agents, what to build. The skill is deliberately specific. "Add an API" is useless advice. "`POST /v1/accounts` with email and password, return the API key in the response body, no email verification required, reference Stripe's account creation flow, roughly 2 days of effort" is useful advice. That's the difference between a framework and a build plan.

```bash
npx skills add tansohq/agent-serve
# Audit a URL
/agent-serve https://example.com

# Or audit the codebase you're already in
/agent-serve
```

**Agent-Serve: Observe**

| Area | Finding |
|---|---|
| **Onboarding** | Today: `POST /signup` is fully headless — email in, API key out. Found: Signup scopes missing `alerts.write` — agents couldn't set alerts at signup. Fixed: Added `alerts.write` to `SIGNUP_ALLOWED_SCOPES`. |
| **Authentication** | Today: Scoped API keys with budget limits, expiry, encrypted storage. Found: Key delegation endpoint used `ensureVisitor` instead of `ensureAuth` — parent-scope checking was dead code. Fixed: Switched `POST /sdk-keys` to `ensureAuth`. |
| **Maturity** | Level 3 (Agent-Friendly) — solidly there. Gap to Level 4: opaque error responses (needs structured error middleware), no OpenAPI spec. |

We ran it on Tanso. The purchasing audit flagged our own Stripe integration. We use Checkout Sessions, which means plan upgrades redirect to a browser. We wrote the audit and still failed it. We're fixing it now (Stripe Payment Intents, no redirect), but the gap was invisible until we looked.

Works with Claude Code, Cursor, Codex, Cline, Gemini CLI, and 60+ other coding agents.

## The Practical Pipeline

You don't have to build all of this from scratch. There's a path that connects tools that already exist:

**1. Discover** — Run [aeo-ready](https://github.com/nichochar/aeo-ready), the discovery audit from [Part 2](/blog/site-ready-for-ai). Can agents find you?

**2. Audit** — Run [agent-serve](https://github.com/tansohq/agent-serve). Can agents use you?

**3. Build** — Ship the endpoints. API-first, with specific fixes.

**4. Surface** — Pick the interface for each user type. Dashboard, in-app copilot, Slack bot, CLI, MCP.

At the end of that pipeline, your product is accessible to humans, developers, and agents.

## If You're Starting From Zero

Most products aren't at Level 0. They have some API. But if yours is fully dashboard-only, here's the practical sequence:

**Week 1** — Add one read endpoint. `GET /v1/status` or `GET /v1/usage`. Add API key generation to the dashboard. Document it.

**Week 2** — Add one write endpoint, the action agents request most. `POST /v1/reports`, `POST /v1/alerts`, whatever your product's core verb is.

**Week 3** — Add usage and billing visibility. `GET /v1/usage` with current-period data and remaining quota, plus rate limit headers on every response.

**Week 4** — Add programmatic signup. `POST /v1/accounts` returns an account and a key. Even a simplified version counts. Not full agent-first, just "agents can get in without a browser."

Most agent interactions are reads. Checking status, fetching data, monitoring usage. Expose reads first. They're safe, useful, and they prove the pattern before you tackle writes.

## The Takeaway

Self-serve growth tactics, design discipline, onboarding strategy. None of it went away. The decisions that made PLG work still need to be made. Clear pricing, low friction, fast time-to-value, progressive trust.

The difference is that those decisions now have to be expressed programmatically, as API endpoints, machine-readable pricing, structured errors, and scoped credentials. Not just as well-designed UI flows.

The growth playbook isn't dead. It has a new reader.
