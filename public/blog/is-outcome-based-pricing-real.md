---
title: "Is Outcome-Based Pricing Real, or Just Marketing Hype?"
date: 2026-02-15
description: "Only 2% of companies used outcome-based pricing in mid-2025. By December it was 18%. Adoption is growing, but the model still fits a narrow set of products."
canonical: https://www.tansohq.com/blog/is-outcome-based-pricing-real
author: Kat Laszlo
---

Outcome-based pricing keeps coming up in decks, on panels, in investor conversations, but almost nobody is actually doing it.

Intercom Fin charges $0.99 per resolved conversation. Sierra gets paid when it completes a task. Zendesk announced a shift away from per-agent pricing last August, and after that the list gets thin.

ICONIQ's Q2 2025 survey found only 2% of companies were using outcome-based pricing. By December, it was 18%. That's growth, but it's still a fraction. Most companies moving off seat-based pricing are going toward consumption models, not outcomes. And only 15% say they plan to move toward outcome-based pricing at all.

---

## First, a distinction most people skip

Part of the reason this debate stays confused is that "outcome-based pricing" collapses two separate decisions into one phrase.

One is the value metric, which is what you charge for, whether that's seats, tokens, API calls, resolved tickets, or processed documents.

The other is the pricing model, which is how you collect the money, whether that's subscription, prepaid credits, pay-as-you-go, or arrears.

When someone says "we do outcome-based pricing," they might mean they charge for resolutions (a value metric). Or they might mean they only get paid when the AI succeeds (a cash mechanism). Or both. Intercom charges per resolution on a pay-per-event basis. Salesforce charges per action via prepaid credits. Both get called "outcome-based pricing" even though they work completely differently in operations, cash flow, and risk.

Once you pull these apart, most of the questions about outcome pricing turn into design choices. An outcome metric with a prepaid cash mechanism gives you value alignment without budget unpredictability. An activity metric with a success bonus gives you some outcome alignment without solving attribution. How you combine the two matters more than what you call it.

Almost every problem people have with "outcome-based pricing" is really a problem with one half of this, not both.

---

## The idea is appealing. That's partly the problem.

On paper, it works. The buyer only pays when the product delivers, the vendor takes on risk, and ROI is straightforward to calculate. Investors like it because it signals confidence in the product.

Shipping it is a different story.

AI doesn't have a standard set of success metrics yet. In advertising, ROI is clear, whether it's a click, a conversion, or a dollar. In AI, teams try to measure value through resolution rates, time saved, stickiness, and retention. None of those have converged into an industry standard, and without a shared definition of success, you can't price on it.

Attribution makes this harder. Who gets credit when an AI agent resolves a ticket but a human set up the workflow, curated the knowledge base, and handled the escalation? Partial outcomes, shared credit, and counterfactual attribution are all unsolved.

Siena AI's CEO wrote [a full post](https://www.siena.cx/blog/conversation-vs-outcome-based-pricing-ai-agent) arguing that outcome-based pricing actively hurts customers. Drawing on work with hundreds of companies, the CEO describes how customers spend hours every week arguing with vendors about what counts as "resolved." Every vendor has their own definition, and there's no standard.

More than one founder has told me, unprompted, that outcome-based pricing is basically just usage billing with a different label. You're still metering events and still generating an invoice, you've just tagged some events as "outcomes."

---

## Where it actually works

The cases where it works share a few conditions.

| Condition | Required? | Why |
|-----------|-----------|-----|
| AI acts autonomously | Yes | If a human is in the loop, you can't attribute the outcome |
| Completion signal is clear | Yes | "Resolved" needs a binary definition both sides agree on |
| Cost variance is bounded | Yes | Vendor absorbs risk; unbounded cost kills margins |

Customer service fits cleanly. Intercom Fin resolves a ticket, the resolution is binary, cost per resolution is roughly predictable. They saw 40% higher adoption versus seat-based pricing. That is a reason to take the model seriously in this category.

Chargeback recovery, collections, and specific legal workflows follow the same pattern, where AI acts alone, the outcome is measurable, and the vendor can pool risk across a customer base.

It falls apart with copilots, writing assistants, advisory tools, anything where a human is in the loop. If your AI is facilitating a human analyst rather than replacing one, there's no clean way to say the AI produced the outcome. The product architecture determines whether you can credibly meter outcomes, not whether you want to.

And then there's the cost side that nobody in the boardroom talks about. If you price on a fixed fee per outcome, you're absorbing all the variance in what that outcome costs to produce. One resolution might take hundreds of tokens. Another might take millions. If you can't price differently based on how much work went into the outcome, you're running a slot machine.

| Category | AI role | Can meter outcomes? |
|----------|---------|---------------------|
| Customer service | Autonomous agent | Yes (resolutions) |
| Chargeback recovery | Autonomous agent | Yes ($ recovered) |
| Legal automation | Autonomous agent | Yes (cases completed) |
| Code completion | Copilot | No (who wrote it?) |
| Writing assistance | Copilot | No (who wrote it?) |
| Data analytics | Copilot | No (who queried it?) |

---

## Strategy meets the invoice

Salesforce is the highest-profile case study, with three pricing iterations in 18 months across Flex Credits, per-action, per-user, and hybrid. On earnings calls it sounds like deliberate evolution.

On the operations side, the picture is different. The word I keep hearing from people close to Agentforce billing is "mess," because it's unclear how much is actually being transacted and hard to reconcile internally. Salesforce Ben's ecosystem report found the real roadblocks were unclear pricing, messy orgs, and weak enablement. A Monetizely analysis called the multi-model approach "design-by-committee in pricing."

This isn't specific to Salesforce. Everyone building in this space runs into the same thing.

If a company with that scale of engineering and go-to-market resources is struggling to operationalize flexible AI pricing, what does that look like for a 50-person startup trying to ship outcome-based billing with a Stripe integration and a spreadsheet?

Even after choosing a model, teams struggle to predict what a change will do. Teams outline multiple hypotheses and it takes a month just to launch changes. They can't predict which ones will succeed. They want to know the outcome of a pricing experiment without actually running it. No tool solves that yet.

A question I keep coming back to is whether teams actually want to run pricing experiments, or whether they just want the answers without running them.

---

## What the renewal cliff forces

The SaaSpocalypse makes this urgent. In early February, $285B in SaaS market value evaporated in a single day as investors realized agentic AI doesn't need software seats. If AI agents replace the humans who held those seats, per-seat revenue models collapse. That's forcing every SaaS company to rethink what they charge for, and outcome-based pricing is one of the answers people keep reaching for.

At the same time, the economics are rough. Bessemer warns that companies in "soft ROI territory," copilots that offer advice without closing the loop, face significant churn. 84% of enterprises report margin erosion from AI workloads, and 80% miss their AI infrastructure forecasts by more than 25%.

Outcome-based pricing is one way to prove you believe in your own product. But it also means absorbing the risk when your product doesn't deliver.

There's a catch, though. The companies most pressured to adopt outcome pricing, the ones struggling to prove ROI, are usually the least equipped to absorb the cost risk. The companies that could absorb the risk don't need outcome pricing to prove their value.

At renewal, the customer needs proof of value, whichever model is on the invoice. Most teams haven't solved that yet.

---

## Where I think this goes

I expect outcome pricing to stay narrow, with adoption concentrated in categories where AI is autonomous and attribution is clean.

The bigger shift is hybrid, a base subscription for predictability with outcome or usage components for value alignment. That's what Salesforce landed on, and it's where Intercom, Cursor, and most companies end up.

Growth Unhinged's 2025 survey found 41% of companies now use hybrid pricing, up from 27% a year ago. Here's the pattern.

| Company | Model |
|---------|-------|
| Intercom Fin | Base subscription + $0.99/resolution |
| Salesforce Agentforce | Per-user license + Flex Credits ($0.10/action) |
| Cursor | Monthly subscription + compute credits |

And then there's the infrastructure question. Most teams can't ship outcome pricing even if they want to, because their billing stack doesn't support it. Stripe found that 92% of AI startups changed pricing post-launch due to inadequate billing systems. Metering outcomes requires different instrumentation than metering tokens.

---

## Ways to get outcome alignment without the risk

This tends to get framed as a binary, where you either charge for outcomes or you don't. But there are ways to get the alignment benefits without absorbing all the cost risk or arguing over attribution.

One option is prepaid outcome credits. The customer buys a block of credits upfront, each redeemable for one outcome (a resolved ticket, a processed document, a completed case), so the meter is outcome-aligned while the cash mechanism is prepaid. The buyer knows their max spend and you know your cash flow, which is basically what Salesforce ended up doing with Flex Credits.

Another is graduated outcome pricing. Instead of a flat fee per outcome, you price in tiers based on complexity or compute required, so a simple resolution costs one credit while a complex one that requires escalation or multiple model calls costs three. This lets you absorb some cost variance without eating the full spread between your cheapest and most expensive outcomes.

A third is a base subscription with outcome-based expansion. You charge a flat monthly fee that covers a set number of outcomes, and once the customer exceeds that threshold, additional outcomes are billed individually. The base gives predictability, while the overage captures value at scale and naturally segments light users from heavy ones.

A fourth is performance bonuses on top of usage pricing. You charge for usage (tokens, API calls, compute) as your baseline, then add a bonus when outcomes exceed a threshold, so the customer pays a predictable usage bill and you earn more when the product delivers measurably well. Instead of absorbing downside, you capture upside.

None of these require solving attribution completely. They get you close enough while keeping billing simple enough to actually ship.

---

## If you're deciding right now

There are three questions to ask before committing to outcome pricing.

First, can your product complete the task autonomously? If a human is in the loop, you're a copilot, so price on activity or access, not outcomes.

Second, can you define success in a way both you and the customer agree on? If "resolved" means different things to you and your buyer, you'll spend more time arguing about invoices than improving the product.

Third, can you absorb the cost variance across your customer base? One difficult case that burns 10x the compute of average will happen, and if your margins can't handle it, outcome pricing will hurt you.

If yes to all three, outcome pricing is real for you.

If no to any of them, hybrid is the better path. Use outcome framing in positioning, but price on usage or workflows until attribution catches up.

---

I'd rather see a team ship pricing it can explain and bill reliably than adopt an outcome metric it has to argue about every month.
