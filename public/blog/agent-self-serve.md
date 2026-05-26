---
title: "The Human Behind the Agent"
series: "PLG for the Agent Era"
part: 1
date: 2026-05-26
description: "Agents are reshaping how people buy, but the human is still in the loop. Here's what the experience actually looks like right now, for consumers and for B2B."
author: Kat Laszlo
---

# The Human Behind the Agent

There's a lot of talk about agents buying things. Gartner says agents will intermediate [$15 trillion in purchases by 2028](https://blog.2checkout.com/agentic-commerce-101-what-software-sellers-need-to-know/). Stripe built an [Agentic Commerce Protocol](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce). Cloudflare lets agents [create accounts and deploy apps](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/).

But what does it actually look like when a person buys something through an agent today? Where is the human? What are they looking at?

## Consumer today

**You ask.** Natural language, not keywords. "Best waterproof hiking boots under $200."

**The agent researches.** It synthesizes merchant feeds, reviews, and structured data. Not 10 blue links. ChatGPT processes [50 million shopping queries daily](https://opascope.com/insights/ai-shopping-assistant-guide-2026-agentic-commerce-protocols/).

**You see product cards.** Images, prices, pros and cons, delivery times. Inline in the conversation.

**You click through to buy.** You tap a product, land on the retailer's site, and check out. Most purchases still end this way.

OpenAI tried in-chat checkout ([Instant Checkout](https://openai.com/index/buy-it-in-chatgpt/), early 2026, powered by Stripe). [Walmart saw 3x lower conversion](https://www.cnbc.com/2026/03/20/open-ai-agentic-shopping-etsy-shopify-walmart-amazon.html) inside ChatGPT than on their own site. By March, OpenAI [pulled back to discovery-first](https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt-after-instant-checkout.html): AI handles research, merchants handle checkout. [Perplexity](https://www.perplexity.ai/hub/blog/shop-like-a-pro) still has PayPal checkout for a few merchants, but it's the exception.

**Bottom line:** The agent replaced research. The human still decides and pays. The experience after "buy" hasn't changed.

## B2B software today

Most of the change so far has been in the research phase.

![B2B research stats: 73% use AI for research, 51% start in chatbot, 69% changed vendor](/blog/images/b2b-research-stats.png)

**You ask the agent.** "Best usage-based billing platform for a SaaS with under 100 customers?" You get a synthesized comparison with pros, cons, and pricing.

**You go deeper.** [55% of buyers](https://learn.g2.com/ai-search-surging-for-b2b-buyers) use AI to compare vendors. The agent pulls from docs, community discussions, and review sites.

**You leave the chat.** Click through to vendor sites. Sign up for a trial or book a demo. [47% build business cases with AI](https://learn.g2.com/ai-search-surging-for-b2b-buyers) before engaging a vendor, but the engagement itself is still human-to-human.

**You buy the way you always have.** Credit card on the pricing page, or a call with sales. If it's enterprise, procurement runs their usual process.

[69% of buyers chose a different vendor](https://learn.g2.com/ai-search-surging-for-b2b-buyers) than they initially planned based on AI guidance.

![AI search converts at 14.2% vs Google organic at 2.8%](/blog/images/ai-vs-google-conversion.png)

The agent is shaping vendor selection before the human ever visits a website.

**What about coding agents?** Overstated. Neon reports agents [create databases at 4x the rate of human developers](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/). But the developer connected Neon's MCP server to Claude Code or Cursor first. The agent uses a tool the human already chose and configured. It provisions faster. It didn't make the vendor decision.

## How the buyer journey shifted

![How the buyer journey shifted across B2C, B2B, and dev tools](/blog/images/journey-comparison.png)

B2B has a history of following consumer experience. Consumer got easy signup, B2B copied it. That was the entire PLG wave. Consumer got self-serve checkout, B2B added self-serve tiers. Now consumer has agent-mediated research and early in-chat purchasing. The infrastructure being built for consumer (Stripe's ACP was built for ChatGPT shopping) is the same infrastructure B2B will use.

The research shift happened in about 18 months. It won't take a decade for the next layer to follow.

## Same funnel, different interface

I spent years optimizing self-serve funnels for humans. Conversion rate experiments with Mutiny, analytics on every step from landing page to paid account. The funnel doesn't change when an agent is the intermediary. What changes is what each stage needs.

![Funnel comparison: human experience vs agent experience at each stage](/blog/images/funnel-comparison.png)

Same buyer, same criteria. But "easy onboarding" looks completely different when an agent is evaluating on their behalf. A human needs a clean signup page. An agent needs a `POST /signup` that returns an API key. Same goal, different interface.

Most companies stop at the top layer. They add an llms.txt file and call it done. Why not get a head start on the rest?

## This series

I started running agent-readiness scanners on my own sites (Cloudflare, Fern, agentic-seo) after every deploy. Each tool checked different things, had different output formats, and none of them talked to each other. That got old fast. So I built the tools.

**[Part 2: Discovery + AEO](/blog/agent-commerce-part-2)** covers the top of the funnel, how agents find and evaluate your product, and a tool I built to score it in one command.

**[Part 3: Self-Serve](/blog/agent-commerce-part-3)** covers the rest: onboarding, auth, purchasing, usage monitoring, and self-management. How I wired Tanso for agent self-serve, and an open-source audit that scores any SaaS across all five dimensions.
