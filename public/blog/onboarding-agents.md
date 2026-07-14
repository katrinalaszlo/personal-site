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

For most products the answer is no, and not because the product is bad. The product works fine. It's the front door that won't open. Almost every SaaS flow hides a browser somewhere, whether that's an email verification loop, a CAPTCHA, an API key you can only mint from a dashboard, checkout that renders only in HTML, or a setting buried three clicks into a panel. A human barely notices any of it. An agent hits a wall at every step.

The easy reaction is to declare self-serve dead, to say PLG had its run and agents finished it off. Some people are already naming the successor Agent-Led Growth, a model where agents run the revenue workflows humans used to click through. I don't buy the obituary. Self-serve didn't die, it relocated. Clear pricing, low friction, fast time-to-value, every decision that made PLG work still matters. It just has to be made at the API layer now, not only the visual one.

An agent evaluating your product asks the same questions a developer on a free trial asks. Can I sign up without talking to anyone? Can I see what it costs? Can I try it before I commit? Can I scale up and back down? The only thing that changed is that every answer now has to be reachable through an API, not just well designed in a UI.

None of this is hypothetical. [Ramp shipped Agent Cards](https://ramp.com/blog/introducing-agent-cards), [Stripe shipped its Agent Toolkit](https://docs.stripe.com/agent-toolkit), and Vercel lets agents buy credits without ever opening a browser. Your next customer might not be a person.

## The same funnel, fewer doors that open

When a human signs up, they move through a familiar funnel. They create an account, prove they're real, pick a plan, start using the product, and manage it over time. An agent moves through the exact same funnel, and the trouble is that most products put a browser wall at every stage, because each stage was built with only the human version in mind. There's a signup form but no signup endpoint, a login page but no machine credential, a checkout page but no plan API, a settings panel but nothing behind it an agent can call. The work isn't inventing a new funnel, it's building the second half of the one you already have. So it's worth walking the four stages and asking, at each one, whether an agent gets through.

### Onboarding

The first question is whether an agent can go from zero to a working account with API access without opening a browser. What usually stops it is the whole gauntlet we built to keep bots out, from CAPTCHA and reCAPTCHA to email verification loops, SMS codes, manual approval queues, multi-step signup wizards, and device fingerprinting that flags a headless browser on sight.

The products that get this right collapse all of that into a single call. A POST to an accounts endpoint returns an account ID and an API key in one response, with no email loop and no browser, which is how both Stripe and Cloudflare work. One request and you're in. A growing number of developer tools go further with a deploy-first, claim-later model, where [Netlify](https://www.netlify.com/solutions/code-agents/) lets you push a site live anonymously and claim the account afterward, and Prisma provisions a database before you've verified an email. The agent provisions immediately and the human claims ownership later.

Security doesn't disappear here, it moves. The line you're actually drawing is between starting to use the product and proving you're a human, and those two things don't have to happen at the same moment. Dropping CAPTCHA has real consequences, but the alternatives already exist, from [Web Bot Auth](https://datatracker.ietf.org/doc/draft-gupta-httpbis-web-bot-auth/) (the RFC 9421 profile, already live at Cloudflare, AWS WAF, and Vercel) to cryptographic agent identity and IP reputation scoring. You don't have to choose between blocking agents and blocking bots.

### Authentication

Once an account exists, the agent has to prove who it is without a human performing a ceremony, and not every auth method handles that equally well, so it's worth ranking them by how an agent actually fares.

| Rating | Method | Notes |
|---|---|---|
| **Best** | API keys with scopes | Simple, revocable, granular. The standard. |
| **Best** | OAuth Client Credentials | Machine-to-machine, no browser redirect. The grown-up option. |
| **Okay** | Service accounts with key pairs | The Google Cloud model. Works, but heavier setup. |
| **Friction** | OAuth Authorization Code + PKCE | Needs a browser redirect, so it blocks agents unless a human pre-authorizes. |
| **Hostile** | Magic links / email OTP | Needs inbox access, and agents don't have inboxes. |
| **Impossible** | CAPTCHA | Designed to block automation. Replace it with Web Bot Auth or proof-of-work. |

Most products already issue API keys, so the gap usually isn't the credential, it's how you get one. If minting a key means logging into a dashboard, clicking into an API Keys page, and copying a token, an agent can't self-serve, because a human is still standing in the loop. The fix is small, an endpoint that generates scoped keys programmatically, so the credential an agent needs is itself reachable by an agent.

### Purchasing

Next the agent has to find out what the product costs, choose a plan, and pay for it, and this is where most B2B companies fall down before an agent even starts. Pricing sits behind "Contact Sales," and agents don't contact sales. Even when the price is published, it's often locked in a format an agent can't parse, an HTML comparison table, a feature matrix in a PDF, a "starting at $X" with an asterisk pointing somewhere off the page. Browser-only Stripe Checkout and the absence of any plan catalog API finish the job.

What works is making the commercial layer as legible as the product layer. A GET on a plans endpoint returns a machine-readable catalog, a POST creates a subscription, and a human saves a payment method once through something like a Stripe Setup Intent so the agent can reuse it, while publishing a `pricing.json` at your domain root makes the catalog discoverable in the first place. The shape of all of it is the same, a human sets the guardrails and the agent executes inside them. Someone authorizes a payment method and sets a spending ceiling, and the agent then evaluates plans, picks one, and buys, all within that pre-authorized boundary. Ramp's Agent Cards work exactly this way, with tokenized cards tied to specific transactions, spending limits, and approval workflows.

### Account management

Getting in is only the start, because once an agent is using the product it needs to manage itself, to upgrade when it outgrows a plan, change configuration, watch its own usage, and cancel if it has to. Most products lock all of that behind a settings page, when the rule is simply that every settings page needs an API endpoint behind it. In practice that means a usage endpoint reporting current consumption, remaining quota, and burn rate, a subscription endpoint that can upgrade, downgrade, or change the billing cycle, a config endpoint for product settings, and a cancel path with sane confirmation semantics. It also means rate-limit headers on every response, like `x-ratelimit-remaining` and `x-ratelimit-reset`, alongside threshold webhooks, so an agent can throttle itself before it slams into a limit instead of discovering the wall by hitting it.

## The maturity ladder

Not every product needs to be agent-first by next quarter, but it helps to know where you sit. At the bottom is the agent-hostile product, browser-only, no API, a CAPTCHA at the door and pricing behind contact sales, which an agent simply cannot use. A step up, the API exists, with REST endpoints for the core features, manually generated keys, and real docs, but still no programmatic signup, billing, or management. Higher again the product becomes agent-possible, where an agent can sign up through the API with some friction, get scoped keys, and read its usage, though billing keeps dragging it back to the dashboard. Agent-friendly is where it starts to feel deliberate, with full programmatic onboarding, OAuth client credentials, plan selection and payment through the API, and usage, billing, and configuration all reachable in code. At the top, still mostly aspirational, is agent-first, with zero-friction provisioning, spending policies, agent identity verification, and in some cases MCP offered as a product interface in its own right. Stripe and Cloudflare are early movers, and nobody is fully there yet.

The thing that's easy to miss is that access and quality are separate axes. A product can sit high on access, with a full API, and still be miserable to build against because the errors are vague, there's no test mode, and pagination is broken. Another can offer a minimal API that's a genuine pleasure to use, with structured errors, idempotency, and a real OpenAPI spec. Access gets an agent through the door. Quality decides whether it stays.

## Two readers, one backend

Your product now has two kinds of user. Agents come in through APIs and MCP tools, while humans come in through dashboards, Slack bots, and in-app copilots built on tools like [CopilotKit](https://www.copilotkit.ai/) and the [Vercel AI SDK](https://sdk.vercel.ai/). They want the same capabilities, the same permissions, and the same data, just through different surfaces. A human asks "what's my usage?" in the dashboard, an agent hits the usage endpoint, and a team lead types `/tanso usage acme` into Slack, and all three are reading the same number. The API layer you build for agents is the foundation, and every human surface is a view sitting on top of it.

## Auditing your own product

I kept running into the same gaps across products, so I built [agent-serve](https://github.com/katrinalaszlo/agent-serve) to find them automatically. It's a set of Claude Code skills that walk each stage of the funnel, from onboarding and auth through purchasing, usage, management, and developer quality, and tell you what's blocking agents. You can point it at a URL or run it against the codebase you're already in.

Every area comes back with the same three things, what exists today, what's blocking agents, and what to build, and the advice is deliberately specific, because "add an API" helps no one. "Add a `POST /v1/accounts` that takes an email and password and returns the API key in the response body, skip email verification, model it on Stripe's account creation flow, roughly two days of work" is something a team can actually pick up the next morning. That's the difference between a framework and a build plan.

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

You don't have to build any of this from nothing, because the pieces connect into a path that mostly already exists. Start by checking whether agents can find you at all, which is what [aeo-ready](https://github.com/katrinalaszlo/aeo-ready), the discovery audit from [Part 2](/blog/site-ready-for-ai), measures. Then check whether they can actually use you by running agent-serve over your funnel. From there you ship the endpoints the audit flagged, API-first and one specific fix at a time, and finally you choose the right surface for each kind of user, whether that's a dashboard, an in-app copilot, a Slack bot, a CLI, or MCP. Run that loop and your product ends up reachable by humans, developers, and agents alike.

## If you're starting from zero

Most products aren't actually at the bottom of the ladder, they already have some kind of API. But if yours really is dashboard-only, there's a sane order to dig out. In the first week, add a single read endpoint, something like a status or usage call, put API key generation in the dashboard, and document it. In the second, add one write endpoint, the action agents will reach for most, whatever your product's core verb happens to be, whether that's creating a report or firing an alert. The third week is for visibility, a usage endpoint with current-period data and remaining quota plus rate-limit headers on every response. And the fourth is for programmatic signup, an accounts endpoint that hands back an account and a key, even a stripped-down version, just enough that an agent can get in without a browser.

The reason reads come first is that most agent interactions are reads anyway, checking status, pulling data, watching usage. They're safe, they're immediately useful, and they let you prove the pattern before you take on the harder problem of writes.

## The takeaway

None of the old discipline went away. The self-serve tactics, the design judgment, the onboarding strategy, the slow earning of trust, all of it still matters, and every decision that made PLG work still has to be made. What changed is where those decisions get expressed. They used to live in well-designed UI flows, and now they have to live in API endpoints, machine-readable pricing, structured errors, and scoped credentials as well. The playbook didn't die. It just has a new reader.
