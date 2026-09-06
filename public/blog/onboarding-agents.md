---
title: "Onboarding Agents"
series: "PLG for the Agent Era"
part: 3
date: 2026-06-08
description: "What it actually takes to let an agent sign up, try your product, and buy it. Without a human touching a browser."
author: Kat Laszlo
---

# Onboarding Agents

Last week I asked whether an agent could even [read your website](/blog/site-ready-for-ai). Say it can. Say it lands on your site, parses your pricing, and decides your product is worth trying. Can it actually sign up?

For most products, something still requires a browser: email verification, a CAPTCHA, an API key minted in a dashboard, or checkout that only renders in HTML. The product may have an API, but the agent can't reach it without help.

Some people call the successor Agent-Led Growth, where agents run the revenue workflows humans used to click through. I don't buy the obituary for self-serve. Clear pricing, low friction, and fast time-to-value still matter. We need to apply those decisions to the API as well as the website.

An agent evaluating your product asks the same questions a developer on a free trial asks. Can I sign up without talking to anyone? Can I see what it costs? Can I try it before I commit? Can I scale up and back down? The only thing that changed is that every answer now has to be reachable through an API, not just well designed in a UI.

None of this is hypothetical. [Ramp shipped Agent Cards](https://ramp.com/blog/introducing-agent-cards), [Stripe shipped its Agent Toolkit](https://docs.stripe.com/agent-toolkit), and Vercel lets agents buy credits without ever opening a browser. Your next customer might not be a person.

## The same funnel, fewer doors that open

A human creates an account, authenticates, picks a plan, and manages it over time. An agent needs the same capabilities. Most products have only built the browser path: a signup form without a signup endpoint, a checkout page without a plan API, settings without programmatic access. Here's what to check at each stage.

### Onboarding

The first question is whether an agent can go from zero to a working account with API access without opening a browser. What usually stops it is the whole gauntlet we built to keep bots out, from CAPTCHA and reCAPTCHA to email verification loops, SMS codes, manual approval queues, multi-step signup wizards, and device fingerprinting that flags a headless browser on sight.

The products that get this right collapse all of that into a single call. A POST to an accounts endpoint returns an account ID and an API key in one response, with no email loop and no browser, which is how both Stripe and Cloudflare work. One request and you're in. A growing number of developer tools go further with a deploy-first, claim-later model, where [Netlify](https://www.netlify.com/solutions/code-agents/) lets you push a site live anonymously and claim the account afterward, and Prisma provisions a database before you've verified an email. The agent provisions immediately and the human claims ownership later.

Security doesn't disappear here, it moves. The line you're actually drawing is between starting to use the product and proving you're a human, and those two things don't have to happen at the same moment. Dropping CAPTCHA has real consequences, but the alternatives already exist, from [Web Bot Auth](https://datatracker.ietf.org/doc/draft-gupta-httpbis-web-bot-auth/) (the RFC 9421 profile, already live at Cloudflare, AWS WAF, and Vercel) to cryptographic agent identity and IP reputation scoring. You don't have to choose between blocking agents and blocking bots.

### Authentication

Once the account exists, the agent needs credentials it can use. Some auth methods require a human to authorize access first; others support machine-to-machine access directly.

| Rating | Method | Notes |
|---|---|---|
| **Best** | API keys with scopes | Simple, revocable, granular. The standard. |
| **Best** | OAuth Client Credentials | Machine-to-machine, no browser redirect. The grown-up option. |
| **Okay** | Service accounts with key pairs | The Google Cloud model. Works, but heavier setup. |
| **Friction** | OAuth Authorization Code + PKCE | Needs a browser redirect, so it blocks agents unless a human pre-authorizes. |
| **Hostile** | Magic links / email OTP | Needs inbox access, and agents don't have inboxes. |
| **Impossible** | CAPTCHA | Designed to block automation. Replace it with Web Bot Auth or proof-of-work. |

Most products already issue API keys. The problem is getting one: logging into a dashboard, opening the API Keys page, and copying a token still requires a human. An endpoint that generates scoped keys makes that step accessible to the agent.

### Purchasing

Next the agent needs prices, a plan, and a way to pay. "Contact Sales" stops that process immediately. Published pricing can be difficult too: a PDF feature matrix, an HTML table, or "starting at $X" with terms elsewhere. Without a plan catalog API or programmatic checkout, the agent hands the purchase back to its human.

A plans endpoint can return the catalog, and a subscription endpoint can create the subscription. Publishing `pricing.json` at the domain root helps the agent find that information. The human first authorizes a payment method, through something like a Stripe Setup Intent, and sets a spending ceiling. The agent can then select and buy a plan within that authorization. Ramp's Agent Cards use tokenized cards tied to specific transactions, spending limits, and approval workflows.

### Account management

Once an agent is using the product, it needs to monitor usage, change configuration, upgrade or downgrade, and cancel. Those actions need documented endpoints. A usage response should include current consumption and remaining quota. Subscription changes need clear confirmation semantics. Rate-limit headers such as `x-ratelimit-remaining` and `x-ratelimit-reset`, plus threshold webhooks, help the agent slow down before it hits a limit.

## The maturity ladder

The maturity ladder is a way to locate the next gap:

- Agent-hostile: browser-only access, CAPTCHA at signup, and pricing behind contact sales.
- API available: documented core endpoints and manually generated keys, but no programmatic signup or billing.
- Agent-possible: signup, scoped keys, and usage data are accessible, but billing still sends the agent to a dashboard.
- Agent-friendly: onboarding, payment, and account management are all available programmatically.
- Agent-first: immediate provisioning, spending policies, and agent identity verification are designed together. MCP may be a product interface too.

The last level is still mostly aspirational. Stripe and Cloudflare are early movers; nobody is fully there yet.

The thing that's easy to miss is that access and quality are separate axes. A product can sit high on access, with a full API, and still be miserable to build against because the errors are vague, there's no test mode, and pagination is broken. Another can offer a minimal API that's a genuine pleasure to use, with structured errors, idempotency, and a real OpenAPI spec. Access gets an agent through the door. Quality decides whether it stays.

## Two readers, one backend

Your product now has two kinds of user. Agents come in through APIs and MCP tools, while humans come in through dashboards, Slack bots, and in-app copilots built on tools like [CopilotKit](https://www.copilotkit.ai/) and the [Vercel AI SDK](https://sdk.vercel.ai/). They want the same capabilities, the same permissions, and the same data, just through different surfaces. A human asks "what's my usage?" in the dashboard, an agent hits the usage endpoint, and a team lead types `/tanso usage acme` into Slack, and all three are reading the same number. The API layer you build for agents is the foundation, and every human surface is a view sitting on top of it.

## Auditing your own product

I kept running into the same gaps across products, so I built [agent-serve](https://github.com/katrinalaszlo/agent-serve) to find them automatically. It's a set of Claude Code skills that walk each stage of the funnel, from onboarding and auth through purchasing, usage, management, and developer quality, and tell you what's blocking agents. You can point it at a URL or run it against the codebase you're already in.

Each area reports what exists, what's blocking agents, and a specific change to make. "Add an API" isn't enough. A useful finding names the endpoint, its inputs and outputs, and where it belongs in the existing flow. That gives the team something to implement and test.

```bash
npx skills add katrinalaszlo/agent-serve

# Audit a URL
/agent-serve https://example.com

# Or audit the codebase you're already in
/agent-serve
```

Here's a slice of what it reported when we ran it on our own product, Tanso.

| Area | Finding |
|---|---|
| **Onboarding** | Today `POST /signup` is fully headless, email in, API key out. It found that signup scopes were missing `alerts.write`, so agents couldn't set alerts at signup, and the fix was adding `alerts.write` to `SIGNUP_ALLOWED_SCOPES`. |
| **Authentication** | Today there are scoped API keys with budget limits, expiry, and encrypted storage. It found that the key delegation endpoint used `ensureVisitor` instead of `ensureAuth`, so parent-scope checking was dead code, and the fix was switching `POST /sdk-keys` to `ensureAuth`. |
| **Maturity** | Level 3, agent-friendly, solidly there. The gap to level 4 is opaque error responses, which need structured error middleware, and a missing OpenAPI spec. |

It didn't spare us. The purchasing audit flagged our own Stripe integration, because we use Checkout Sessions, which means a plan upgrade redirects to a browser. We wrote the audit and still failed it. We're fixing it now by moving to Stripe Payment Intents with no redirect, but the gap stayed invisible until something went looking for it. It runs in Claude Code, Cursor, Codex, Cline, Gemini CLI, and sixty-plus other coding agents.

## The practical pipeline

Start with [aeo-ready](https://github.com/katrinalaszlo/aeo-ready), the discovery audit from [Part 2](/blog/site-ready-for-ai), to check whether agents can find and read your product. Then run agent-serve over the self-serve flow. Fix one blocked step, test it with an agent, and repeat. The same endpoints can support your dashboard, CLI, Slack bot, or in-app copilot.

## If you're starting from zero

If your product already has an API, start with the gaps in that API. If it's dashboard-only, I'd work in this order:

1. Add a read endpoint, such as status or usage. Let a human generate an API key in the dashboard and document the call.
2. Add the main action an agent would need, such as creating a report or firing an alert.
3. Expose current-period usage and remaining quota, with rate-limit headers.
4. Add programmatic signup that returns an account and a scoped key.

You could tackle one stage a week, adjusting for the product's complexity.

The reason reads come first is that most agent interactions are reads anyway, checking status, pulling data, watching usage. They're safe, they're immediately useful, and they let you prove the pattern before you take on the harder problem of writes.

## What I test now

I still care about the same things I did when optimizing a human signup flow: can the customer get started, understand the price, and reach a useful result? Now I also test those questions through the API. An agent should be able to complete the flow and report what happened without sending its human back to a browser at every step.