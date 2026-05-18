---
title: "What's Actually Different About AI Pricing"
date: 2025-11-28
description: "AI pricing looks new. New labels. New meters. New behaviors. Some things genuinely changed: costs and attribution work differently now. But fundamentals haven't."
canonical: https://www.tansohq.com/blog/ai-pricing-differences
author: Kat Laszlo
---

Over the past few weeks I've talked with founders building AI agents, developer tools, and vertical SaaS about their pricing.

AI pricing looks new. New labels. New meters. New behaviors. Some things genuinely changed: costs and attribution work differently now. But the pricing models themselves follow the same patterns they always have. Even a lot of the new terms are actually rebrands of familiar concepts:

| AI era | PLG SaaS | Same concept |
|--------|----------|--------------|
| Tokens | API calls | Activity metering |
| Credits | Prepaid credits / bundles | Buy usage upfront |
| Outcome-based | Success fees | Pay for results |
| Agents | Seats | Per-worker pricing |
| Credit top-ups | Overage charges | Pay beyond commitment |

Two things actually changed:

**Marginal costs are back.** In PLG SaaS, serving another user costs almost nothing. In AI, every query burns compute. Free trials aren't free to you anymore.

**Attribution works in longer workflows.** When an AI agent resolves a support ticket, you know who did the work. That lets you meter outcomes in places you never could before, but only when the product architecture supports it.

Everything else is the same four decisions, applied to new territory.

1. **Meter position:** What do you charge for?
2. **Cash mechanism:** When do you get paid?
3. **Psychology:** How does it feel to buy?
4. **Infrastructure:** What can you actually bill?

---

## Meter position

Every product sits on a spectrum from access to outcome.

Seats and flat fees live on one side. Resolutions and revenue share live on the other. The closer you get to outcome, the more your revenue aligns with customer value. But the harder attribution and risk become.

**This is where the attribution shift matters most.** The spectrum existed in PLG SaaS. Twilio charged per API call. Salesforce charged per seat. Performance marketing platforms charged for conversions because they controlled the attribution.

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

**This is where marginal costs hit hardest.** In PLG SaaS, serving another user costs almost nothing. Free trials were free to you. Freemium was a growth strategy with no downside. In AI, every query burns compute. Free trials cost real money. That changes how you think about cash mechanism and adoption curves.

---

## Psychology

Buyers optimize for peace of mind, not necessarily the lowest cost. They want to know what they'll owe, and they hate watching meters tick down in real time. That's why three-part tariffs work well: base fee, free allowance, overage. The allowance feels safe. [Research on tariff structures](https://tomtunguz.com/three-part-tariffs) found that customers who switched to a three-part tariff increased their usage by 15.1%, compared to 0.9% for those who stayed on two-part tariffs.

None of this is new. Flat-rate bias existed before AI. The "unlimited" trap existed before AI. Loss aversion during price changes existed before AI. These are human psychology patterns, not technology patterns.

The unit is more abstract. Tokens and credits are harder to reason about than seats or API calls. When every company defines a credit differently, and a single prompt can burn anywhere from 50 to 50,000 tokens depending on the model, customers have even less intuition about what they're spending. The psychology is the same. The confusion is worse.

### Case study: Cursor's unlimited pricing

When [Cursor switched from "unlimited" requests to a credit pool](https://cursor.com/blog/june-2025-pricing), users only found out when their credits ran dry. Cursor had to [apologize publicly](https://techcrunch.com/2025/07/07/cursor-apologizes-for-unclear-pricing-changes-that-upset-users/) and issue refunds.

Unlimited pricing creates a psychological contract. Breaking it is expensive.

---

## Infrastructure

You can only price what you can meter and bill.

Billing constraints block pricing changes. Companies get stuck on seat-based pricing because that's what their billing stack can handle.

**Both shifts land here.** Usage billing is now table stakes, not optional. PLG SaaS could get away with seat counting. AI companies need high-frequency metering: tokens per request, not API calls per month. Systems have to handle real-time attribution, variable rate cards, credit pools that draw down mid-session. Stripe found that 92% of AI startups changed pricing post-launch due to inadequate billing systems.

When a company is stuck on seat-based pricing, often it's just what their billing can handle reliably, not a strategic choice.

---

## Why hybrid wins

The [Growth Unhinged 2025 survey](https://www.growthunhinged.com/p/2025-state-of-b2b-monetization) found that 41% of companies now use hybrid pricing, up from 27% a year ago. The pattern:

| Company | Model |
|---------|-------|
| **Intercom Fin** | Base subscription (Access) + $0.99/resolution (Outcome) |
| **Salesforce Agentforce** | Per-conversation (Output) + Flex Credits (Activity) |
| **Cursor** | Monthly subscription (Access) + compute credits (Activity) |

Access pricing gives you predictable cash. Activity or outcome pricing aligns with value. Credits smooth the volatility.

---

## Four questions before your next pricing change

1. **Where can you credibly put your meter?**
   Copilots: activity is your ceiling. Autonomous agents: outcomes become possible.

2. **Can your cash flow handle this model?**
   Usage in arrears burns cash. Credits or annual prepay might need to come first.

3. **What's the cognitive load of your pricing?**
   Usage pricing aligns with value but creates meter anxiety. Flat rates feel safe but hide value delivered.

4. **Can you actually implement this?**
   If your billing can't support it, the strategy doesn't matter.

**Key Takeaways:** Pricing is four decisions that interact. The mechanics didn't change. AI changed two things: marginal costs are back, and attribution works in new places.
