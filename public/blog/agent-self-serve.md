---
title: "The Human Behind the Agent"
series: "PLG for the Agent Era"
part: 1
date: 2026-05-26
description: "Agents are already reshaping how B2B buyers research and choose vendors. What does the self-serve experience need to look like when an agent is the buyer?"
author: Kat Laszlo
---

# The Human Behind the Agent

B2B buyers are already using agents to research and choose software. [73% use AI for vendor research](https://learn.g2.com/ai-search-surging-for-b2b-buyers), and [69% ended up choosing a different vendor](https://learn.g2.com/ai-search-surging-for-b2b-buyers) than they originally planned based on what the agent recommended. The agent is shaping who wins before the buyer ever visits your website.

And yet the buying experience itself (signup, onboarding, checkout, account management) hasn't changed at all. It's still built for a human clicking through a browser. So what does it need to look like when the human is buying through an agent?

## Where we are today

![B2B research stats: 73% use AI for research, 51% start in chatbot, 69% changed vendor](/blog/images/b2b-research-stats.png)

The shift so far has been in research. You ask an agent something like "best usage-based billing platform for a SaaS with under 100 customers?" and you get a synthesized comparison with pros, cons, and pricing. [55% of buyers](https://learn.g2.com/ai-search-surging-for-b2b-buyers) are already using AI to compare vendors this way, with the agent pulling from docs, community discussions, and review sites.

But once the research is done, the experience reverts to what it's always been. You click through to vendor sites, sign up for a trial or book a demo, and pay with a credit card on a pricing page. [47% build business cases with AI](https://learn.g2.com/ai-search-surging-for-b2b-buyers) before engaging a vendor, but the engagement itself is still human-to-human.

So the process looks the same. The outcome doesn't. [69% of buyers chose a different vendor](https://learn.g2.com/ai-search-surging-for-b2b-buyers) than they initially planned based on AI guidance.

![AI search converts at 14.2% vs Google organic at 2.8%](/blog/images/ai-vs-google-conversion.png)

Right now, agents are having the most impact on that discovery phase, shaping which vendors make the shortlist before a human ever visits a website. But there are signs the rest of the funnel is next. [Agents are 80% of new signups at Netlify](https://danjcleary.substack.com/p/how-netlify-is-winning-the-age-of), up from near zero a year ago. Stripe built an entire [Agentic Commerce Protocol](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce) and is already processing live transactions through it. Cloudflare lets agents [create accounts and deploy apps](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/) without a human touching a browser.

## Same funnel, different interface

I spent years optimizing self-serve funnels for humans, running conversion rate experiments with Mutiny and Optimizely, tracking analytics on every step from landing page to paid account. The funnel doesn't change when an agent is involved, because the human still wants the same things. What changes is that there's now an intermediary that needs your product's information delivered programmatically so it can evaluate, onboard, and manage on the human's behalf.

![Funnel comparison: human experience vs agent experience at each stage](/blog/images/funnel-comparison.png)

The buyer's criteria don't change, but what "easy onboarding" means does. A human needs a clean signup page. An agent needs a `POST /signup` that returns an API key. Same goal, completely different interface.

Most companies stop at the top layer. They add an llms.txt file and call it done. Why not get a head start on the rest?

## What's next

This is Part 1 of a series on PLG for the agent era. The next two posts go deeper into the funnel:

**Part 2: Discovery + AEO** covers how agents find and evaluate your product, what they look for, and how to measure whether you're showing up.

**Part 3: Self-Serve** covers what I changed when I wired Tanso for agent self-serve, what the industry recommends vs what actually worked, and an open-source audit to score any SaaS across the full funnel.
