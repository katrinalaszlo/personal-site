---
title: "When More Customers Mean Bigger Losses"
date: 2026-01-10
description: "Most AI companies can answer 'What did we spend on OpenAI last month?' Almost none can answer 'Which customers are actually profitable?'"
canonical: https://www.tansohq.com/blog/more-customers-bigger-losses
author: Kat Laszlo
---

Most AI teams can answer a basic question.

*What did we spend on OpenAI last month?*

Very few can answer a harder one.

*Which customers are actually profitable?*

Early on, this doesn't feel like a problem. Pricing works, billing works, and margins look fine in aggregate, so teams move on and focus on building.

Then usage grows, behavior diverges, and costs stop scaling evenly. This is when pricing decisions start to feel uncomfortable, not because teams lack data, but because the data they need lives in systems that were never meant to connect.

Here's why that gap forms, and why it shows up as margin loss instead of a clean analytics issue.

---

## The three silos behind most AI businesses

Most AI products rely on the same three sources of truth.

Usage lives in the product, where you know what actions happened and who triggered them. Cost lives with model providers, where you know what you spent in total. Revenue lives in Stripe, where you know what customers paid.

Each system works well on its own, but none of them answer the same question.

Connecting them requires shared identifiers, consistent definitions, and instrumentation that most teams don't build early. Nothing breaks if you skip it, but the cost shows up later.

---

## What this looks like in practice

The first is invisible margin drain. You sell a $99 per month Pro plan with unlimited AI features, and most customers use it lightly. One customer doesn't, running tens of thousands of workflows a month while still paying $99. Their usage costs you several hundred dollars, and you'd never know unless you manually cross referenced usage logs with provider dashboards, which rarely happens while a team is focused on shipping.

Then there's pricing paralysis. Product asks whether a more expensive model should be added to a mid tier plan, engineering asks about cost impact, and finance asks which customers would actually use it. Nobody has a clear answer, so teams either ship and hope margins hold, delay and lose momentum, or spend weeks on a one off analysis that is outdated by the time the feature launches.

Finally, there's the enterprise discount trap. Sales closes a discounted annual deal to win a logo, and on paper it looks like progress. Months later, someone realizes the customer's usage pattern makes them deeply unprofitable, but by then the contract is signed and the margin damage is already baked in.

These aren't edge cases. They're common outcomes when variable usage meets flat pricing.

---

## Why this keeps happening

This isn't about teams being careless. It's about how the stack works today.

Model providers make it easy to see aggregate usage, but they don't attribute cost to individual customers by default. To do that, teams need to pass identifiers on every request and log usage consistently, and many don't, especially early, because nothing forces the issue.

Usage metering was designed for simpler products like seats, storage, and API calls. AI usage is more complex, because token counts vary by model, context length changes cost, and a single user action can trigger multiple downstream calls.

Billing systems stop at payment. Stripe knows what was charged, but it doesn't know what was consumed, and bridging that gap usually means custom pipelines that early teams don't have time to build.

So teams rely on averages, watching aggregate margins and hoping the distribution is healthy.

---

## Why the math is unforgiving

Traditional SaaS margins are high and relatively stable, so a mispriced customer hurts a little.

AI margins are lower and highly variable, so underpricing a heavy user can mean negative gross margin, and a small number of customers can erase the profit from many healthy ones.

Without per customer cost data, they all look the same.

---

## What changes when this is solved

Teams that connect usage, cost, and revenue can answer questions that otherwise feel risky.

- Which customers are profitable, defined as revenue minus attributed cost.
- Which features are expensive by customer segment.
- What a pricing change would do before it ships.
- Where margin leaks are forming early, not quarters later.

This isn't about building dashboards. It's about being able to make decisions without guessing.

---

## Why analytics alone isn't enough

Many teams start by pulling everything into BI. That helps with visibility, but it doesn't fix the underlying issue.

If identifiers don't line up and definitions drift across systems, every pricing question still requires manual work.

What actually helps is foundational infrastructure.

- Instrument cost attribution at the source.
- Define usage once and use it everywhere.
- Maintain the relationships automatically, not through exports and spreadsheets.

This work is unglamorous, but it pays off.

---

## The bottom line

AI margins are variable, and that part is known. What's less obvious is where that variability hides.

When usage, cost, and revenue are split across systems, margin loss shows up at the customer level long after it begins. Everything looks fine in aggregate until it doesn't.

Most teams learn this after a painful surprise. Teams that instrument early see it sooner, while they still have options.
