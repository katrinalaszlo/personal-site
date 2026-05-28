---
title: "Your Next Customer Might Be an Agent"
series: "PLG for the Agent Era"
part: 1
date: 2026-05-26
description: "Agents are already reshaping how B2B buyers research and choose vendors. What does the self-serve experience need to look like when an agent is the buyer?"
author: Kat Laszlo
---

# Your Next Customer Might Be an Agent

B2B buyers are already using agents to research and choose software. [73% use AI for vendor research](https://learn.g2.com/ai-search-surging-for-b2b-buyers), and [69% ended up choosing a different vendor](https://learn.g2.com/g2-2026-ai-search-insight-report) than they originally planned based on what the agent recommended. The agent is shaping who wins before the buyer ever visits your website.

And yet the buying experience itself (signup, onboarding, checkout, account management) hasn't changed at all. It's still built for a human clicking through a browser. So what does it need to look like when the human is buying through an agent?

## Where we are today

![B2B research stats: 73% use AI for research, 51% start in chatbot, 69% changed vendor](/blog/images/b2b-research-stats.png)

The shift so far has been in research. You ask an agent something like "best usage-based billing platform for a SaaS with under 100 customers?" and you get a synthesized comparison with pros, cons, and pricing. [55% of buyers](https://learn.g2.com/ai-search-surging-for-b2b-buyers) are already using AI to compare vendors this way, with the agent pulling from docs, community discussions, and review sites.

But once the research is done, the experience reverts to what it's always been. You click through to vendor sites, sign up for a trial or book a demo, and pay with a credit card on a pricing page. [47% build business cases with AI](https://learn.g2.com/ai-search-surging-for-b2b-buyers) before engaging a vendor, but the engagement itself is still human-to-human.

Even limited to research, agents are already changing outcomes. [69% of buyers end up with a different vendor](https://learn.g2.com/g2-2026-ai-search-insight-report) than they planned. The agent doesn't just speed up research, it changes who gets selected.

And there are signs this is moving beyond discovery into other parts of the funnel:

**Acquisition.** [Agents are 80% of new signups at Netlify](https://danjcleary.substack.com/p/how-netlify-is-winning-the-age-of), up from near zero a year ago.

**Conversion.** Stripe built an entire [Agentic Commerce Protocol](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce) for agents to select plans and process payments programmatically.

**Operations.** Cloudflare lets agents [create accounts and deploy apps](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/) end-to-end without a human touching a browser.

## The human behind the agent

This progression felt familiar to me. I spent years optimizing self-serve funnels for humans, running conversion rate experiments with Mutiny and Optimizely, tracking analytics on every step from landing page to paid account. The funnel doesn't change when an agent is involved, because the human still has the same goals. What changes is that there's now an intermediary that needs your product's information delivered programmatically so it can evaluate, onboard, and manage on the human's behalf.

![Funnel comparison: human experience vs agent experience at each stage](/blog/images/funnel-comparison.svg)

The buyer's criteria don't necessarily change, but what constitutes a delightful, simple, well-designed experience does. A human needs a clean signup page. An agent needs a `POST /signup` that returns an API key. Same goal, completely different interface. At each stage, there's a programmatic equivalent: `llms.txt` and `pricing.md` for discovery, MCP servers and agent-ready docs for activation, programmatic checkout for conversion.

## What's next

If you run a B2B SaaS with self-serve signup, this series is for you. Each part goes deeper into the funnel and includes something you can run on your own product.

**Part 2: Is Your Site Ready for AI?** How agents find and evaluate your product, what they look for, and how to measure whether you're showing up. Comes with a scanner you can run on your own site.

**Part 3: Onboarding Agents.** What agent-ready onboarding, auth, purchasing, and account management actually require, and an open-source skill to make your self-serve flow agent-accessible.
