---
title: "What's Actually Different About AI Pricing"
date: 2025-11-28
description: "AI changes the cost of serving customers and where outcomes can be measured. The pricing decisions are still familiar."
canonical: https://www.tansohq.com/blog/ai-pricing-differences
author: Kat Laszlo
---

Over the past few weeks I've talked with founders building AI agents, developer tools, and vertical SaaS about their pricing.

A lot of AI pricing vocabulary describes familiar mechanisms. Costs and attribution have changed, but many of the models have direct precedents:

| AI era | PLG SaaS | Same concept |
|--------|----------|--------------|
| Tokens | API calls | Activity metering |
| Credits | Prepaid credits / bundles | Buy usage upfront |
| Outcome-based | Success fees | Pay for results |
| Agents | Seats | Per-worker pricing |
| Credit top-ups | Overage charges | Pay beyond commitment |

Two changes matter here. Every AI query consumes compute, so a free trial can carry a substantial cost. And an agent that completes a support ticket can give you a measurable outcome to charge for. That second change depends on the product: you need to know who did the work.

I still work through four decisions.

1. Meter position is what you charge for.
2. Cash mechanism is when you get paid.
3. Psychology is how it feels to buy.
4. Infrastructure is what you can actually bill.

---

## Meter position

Every product sits on a spectrum from access to outcome.

Seats and flat fees live on one side, while resolutions and revenue share live on the other. The closer you get to outcome, the more your revenue aligns with customer value, but the harder attribution and risk become.

This is where the attribution shift matters most. The spectrum existed in PLG SaaS, where Twilio charged per API call, Salesforce charged per seat, and performance marketing platforms charged for conversions because they controlled the attribution.

What changed is where you can apply outcome pricing. When Intercom Fin resolves a support ticket, you know AI did the work, so Intercom can charge per resolution. When Cursor helps you write code, the human is still in the loop, so Cursor charges for compute instead. The product architecture determines where you can credibly put the meter.

| Category | AI role | Can meter outcomes? |
|----------|---------|---------------------|
| Customer service | Autonomous agent | Yes (resolutions) |
| Chargeback recovery | Autonomous agent | Yes ($ recovered) |
| Legal automation | Autonomous agent | Yes (cases) |
| Code completion | Copilot | No (who wrote it?) |
| Writing assistance | Copilot | No (who wrote it?) |

---

## Cash mechanism

When you charge matters as much as what you charge for.

| Mechanism | Cash flow | The tradeoff |
|-----------|-----------|--------------|
| **Prepaid annual** | Best | Harder to sell, slower adoption |
| **Prepaid credits** | Good | Translation complexity, expiry decisions |
| **Monthly** | OK | Higher churn, less commitment |
| **Arrears** | Tight | You fund the customer's usage |
| **Success fee** | Risky | Only paid when customer wins |

Annual contracts, monthly billing, usage in arrears. [Jason Lemkin](https://www.saastr.com/false-choice-prepaid-vs-monthly-contracts/), co-founder of EchoSign (now Adobe Sign) and founder of SaaStr, wrote that prepaid annual contracts were "half the reason" EchoSign went cash-flow positive at $5M ARR. Same principle applies now.

This is where marginal costs hit hardest. In PLG SaaS, serving another user costs almost nothing, so free trials were free to you and freemium was a growth strategy with no downside. In AI, every query burns compute, so free trials cost real money, which changes how you think about cash mechanism and adoption curves.

---

## Psychology

Buyers optimize for peace of mind, not necessarily the lowest cost. They want to know what they'll owe, and they hate watching meters tick down in real time. That's why three-part tariffs work well: base fee, free allowance, overage. The allowance feels safe. [Research on tariff structures](https://tomtunguz.com/three-part-tariffs) found that customers who switched to a three-part tariff increased their usage by 15.1%, compared to 0.9% for those who stayed on two-part tariffs.

None of this is new. Flat-rate bias existed before AI, the "unlimited" trap existed before AI, and loss aversion during price changes existed before AI. Buyers bring those same habits to AI purchases.

The unit is more abstract, because tokens and credits are harder to reason about than seats or API calls. When every company defines a credit differently, and a single prompt can burn anywhere from 50 to 50,000 tokens depending on the model, customers have even less intuition about what they're spending. The psychology is the same, but the confusion is worse.

### How Cursor's unlimited pricing backfired

When [Cursor switched from "unlimited" requests to a credit pool](https://cursor.com/blog/june-2025-pricing), users only found out when their credits ran dry. Cursor had to [apologize publicly](https://techcrunch.com/2025/07/07/cursor-apologizes-for-unclear-pricing-changes-that-upset-users/) and issue refunds.

Unlimited pricing creates a psychological contract, and breaking it is expensive.

---

## Infrastructure

You can only price what you can meter and bill.

Billing constraints block pricing changes, and companies get stuck on seat-based pricing because that's what their billing stack can handle.

Both changes put pressure on billing. PLG SaaS could get away with seat counting, but AI companies need high-frequency metering, tokens per request rather than API calls per month. Systems have to handle real-time attribution, variable rate cards, and credit pools that draw down mid-session. Stripe found that 92% of AI startups changed pricing post-launch due to inadequate billing systems.

When a company is stuck on seat-based pricing, often it's just what their billing can handle reliably, not a strategic choice.

---

## Why hybrid wins

The [Growth Unhinged 2025 survey](https://www.growthunhinged.com/p/2025-state-of-b2b-monetization) found that 41% of companies now use hybrid pricing, up from 27% a year ago. The same pattern shows up across the leaders.

| Company | Model |
|---------|-------|
| **Intercom Fin** | Base subscription (Access) + $0.99/resolution (Outcome) |
| **Salesforce Agentforce** | Per-conversation (Output) + Flex Credits (Activity) |
| **Cursor** | Monthly subscription (Access) + compute credits (Activity) |

Access pricing gives you predictable cash, activity or outcome pricing aligns with value, and credits smooth the volatility.

---

## Four questions before your next pricing change

1. **Where can you credibly put your meter?**
   With copilots, activity is your ceiling, while with autonomous agents, outcomes become possible.

2. **Can your cash flow handle this model?**
   Usage in arrears burns cash, so credits or annual prepay might need to come first.

3. **What's the cognitive load of your pricing?**
   Usage pricing aligns with value but creates meter anxiety, while flat rates feel safe but hide value delivered.

4. **Can you actually implement this?**
   If your billing can't support it, the strategy doesn't matter.

Work through those questions together. A measurable outcome won't help if the buyer can't budget for it or your billing system can't charge for it.
