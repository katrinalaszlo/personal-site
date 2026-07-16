# Distribution Copy: "I Made My Sites Self-Serve for AI Agents"

## X / Twitter thread

**Tweet 1:**
I audited Stripe, Vercel, Linear, and Notion for agent-readiness.

Stripe scored 6/10. They have an MCP server, OpenAPI spec, and agent toolkit.

The flat score is broken. Here's why.

**Tweet 2:**
Agent-readiness is a funnel:

Discovery → Evaluation → Onboarding → Purchase → Usage → Self-management

Every scanner (Cloudflare, Fern, lilAgents) only checks the top layer.

Nobody checks whether an agent can actually buy your product.

**Tweet 3:**
I made my product self-serve for agents using Clerk + Stripe.

POST /signup → Clerk user + SDK key in one call
payment_method param → Stripe subscription, no browser

The Stripe part seemed hard until it wasn't. One parameter.

**Tweet 4:**
Built two Claude Code skills from the process:

aeo-ready: can agents find you?
agent-serve: can agents be your customer?

Open source. Run them on your site in 30 seconds.

**Tweet 5:**
Full writeup with scores for 6 companies and the implementation details:

https://katrinalaszlo.com/blog/agent-self-serve

npx aeo-ready scan https://yoursite.com
npx skills add katrinalaszlo/agent-serve

---

## LinkedIn

I spent the last few months answering a question most SaaS founders haven't asked yet: can an AI agent sign up, pay for, and use my product without a human?

Not "AI features." The other kind of agent-ready. Where an agent discovers your product, evaluates it, creates an account, picks a plan, pays, and starts making API calls. No browser. No support ticket.

I captured the process as two open-source Claude Code skills. Then I ran them against Stripe, Vercel, Linear, and Notion.

Stripe scored 6/10 despite having an MCP server, OpenAPI spec, and a dedicated agent toolkit. The flat score misses capability depth. Every scanner in the market has the same problem.

73% of top API docs sites still lack llms.txt. The Fortune 500 average is 25%. The bar is on the floor.

If you're building B2B software, agents are becoming buyers. The companies that make the full funnel work first will have a distribution channel nobody else can see yet.

What's your product's agent-readiness score?

[Link in comments: https://katrinalaszlo.com/blog/agent-self-serve]

---

## Hacker News

**Title:** Show HN: Two Claude Code skills for making your site self-serve for AI agents

**First comment:**
I've been making my sites agent-ready and kept running the same checks manually. Codified the process into two open-source Claude Code skills:

aeo-ready (npx aeo-ready scan https://yoursite.com) scores your site on discovery, parseability, and actionability, then generates the missing files (llms.txt, agents.json, robots.txt, structured data) directly into your repo. Opinionated by site type.

agent-serve (npx skills add katrinalaszlo/agent-serve) audits whether an agent can actually be your customer: onboarding, auth, purchasing, usage monitoring, self-management. I used it to make my product (Observe) fully agent-accessible via Clerk API signup + Stripe programmatic payments.

Ran both against Stripe, Vercel, Linear, Notion. Interesting finding: nobody has agents.json. Also, Stripe scores 6/10 on a flat rubric despite being one of the most agent-capable companies, which says more about the rubric than about Stripe.

---

## Timing

- **X:** Tuesday-Thursday, 8-10am PT or 12-2pm PT
- **LinkedIn:** Tuesday-Thursday, 7-8am or 12pm your timezone
- **HN:** Tuesday-Thursday, 8-11am ET
- Post to X first, LinkedIn same day, HN the next morning.
