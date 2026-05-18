---
title: "The 'AI Included' Era Was Never Going to Last Forever"
date: 2026-02-25
description: "The mismatch between flat pricing and variable AI costs didn't start with AI-native startups. It's coming for every SaaS company that shipped an AI feature in the last two years."
canonical: https://www.tansohq.com/blog/ai-included
author: Kat Laszlo
---

*The mismatch between flat pricing and variable AI costs didn't start with AI-native startups. It's coming for every SaaS company that shipped an AI feature in the last two years.*

---

I've been tracking SaaS pricing changes for months now, and there's a pattern that keeps repeating. A company bundles AI into its core product, raises the price, calls it a platform upgrade. Then, six to twelve months later, starts quietly walking it back.

I'm already seeing it play out. Companies that marketed "AI included" as recently as mid-2025 are now introducing credit systems, usage caps, and metered add-ons. The direction seems clear. The timeline is the only real question.

---

In 2024 and 2025, the playbook was everywhere. Take your existing SaaS product, bolt on an AI feature, bundle it into the seat price, and use "AI included" to justify a price increase, or at least prevent churn to a competitor doing the same thing.

The names tell the story. [Google Workspace bundled Gemini](https://workspace.google.com/blog/product-announcements/empowering-businesses-with-AI) with a ~17% price hike in January 2025. [Slack killed its $10/user AI add-on](https://slack.com/blog/news/june-2025-pricing-and-packaging-announcement) and raised Business+ from $12.50 to $15. Notion folded AI into Business and bumped the price $5. [Canva raised team pricing over 300%](https://fortune.com/2024/09/03/canva-hiking-teams-subscription-prices-ai-features/) to cover Magic Studio. Several of these companies have since reversed course. Notion just launched [credit-based pricing for Custom Agents at $10 per 1,000 credits](https://www.notion.com/help/custom-agent-pricing), Canva rolled out [monthly AI usage allowances](https://www.canva.com/help/ai-access/), and Google is launching an [AI Expanded Access add-on](https://workspaceupdates.googleblog.com/2026/02/google-workspace-ai-expanded-access.html) for higher usage tiers.

It made sense at the time. Early adoption was uneven. Most users tried the AI feature once, maybe twice. The inference costs were a rounding error against total revenue. And you got to put "AI-powered" on the homepage.

But AI usage doesn't stay flat.

---

When a user goes from "trying the AI feature" to "depending on the AI feature," their consumption looks nothing like it did at launch. They're not running one summary a week. They're running fifty a day. They're not asking the copilot a question. They're routing entire workflows through it.

Every one of those interactions has a real infrastructure cost. GPU inference, token generation, model routing. These aren't fixed costs you amortize across your user base. They scale with usage, per customer, per request. And the margin gap is real: [many AI-first SaaS companies currently report 25-60% gross margins](https://www.tanayj.com/p/the-gross-margin-debate-in-ai) compared to the 75-85% that traditional SaaS expects. The range depends on model, use case, and inference volume, but the direction is consistent. According to [Mavvrik's 2025 AI cost report](https://www.mavvrik.ai/state-of-ai-cost-governance-report/), 84% of companies report more than 6% gross margin erosion from AI workloads.

You're charging per seat. You're paying per request. That mismatch eventually shows up in the margin line. For a while, the math works because average usage is low. But averages are misleading. Your power users, the ones who actually adopted the AI feature, are eating your margins. And those power users are exactly the customers you can't afford to lose.

GitHub Copilot is the cautionary tale here. [The Wall Street Journal reported](https://www.wsj.com/tech/ai/ais-costly-buildup-could-make-early-products-a-hard-sell-bda1bab4) that Microsoft was losing an average of $20 per user per month on Copilot at the $10 flat rate, with some heavy users costing up to $80. That's not a margin problem you grow your way out of. More recently, Cursor [tried shifting from 500 "fast requests"](https://techcrunch.com/2025/07/07/cursor-apologizes-for-unclear-pricing-changes-that-upset-users/) to a credit-based model and botched the rollout so badly that CEO Michael Truell had to publicly apologize for the "mishandling."

I've seen the sequence before. The terms get updated. A soft cap appears. Then someone in finance asks whether the feature should be metered.

---

## Your Billing Stack Wasn't Built for This

Most teams underestimate this part. Moving to usage-based pricing for AI features isn't just a pricing decision. It's an infrastructure decision. And your billing system almost certainly wasn't designed for it.

If you're on a typical SaaS billing stack (Stripe for payments, maybe Zuora or Chargebee for subscriptions, a spreadsheet for reconciliation), you have a system that understands seats and tiers. It can bill $50/user/month all day long. What it can't do:

**Meter usage in real time.** When a customer burns through their token allocation mid-request, your billing system finds out hours or days later in a batch process. By then, you've already delivered the compute for free.

**Gate access at the moment it matters.** Can your billing system tell your application, right now, in the request path, whether this specific customer is allowed to use this specific feature? Or does that logic live in a custom feature flag system your engineers built because billing couldn't handle it?

**Show you margin per feature, per customer.** You know what you charge. But do you know what it costs you to deliver each AI feature, per customer, per billing period? If that calculation lives in a spreadsheet someone updates quarterly, you're flying blind on the thing that matters most.

And then there's the transition itself. You need to run legacy seat-based plans and new usage-based AI pricing side by side. Same customer, same invoice. Most billing platforms force you to choose one model or the other.

---

## Billing Was Never Designed for This

Traditional billing systems were designed as record-keepers. They sit downstream of your application. Your app makes decisions, serves requests, delivers value. After the fact, the billing system records what happened and generates an invoice.

That architecture works when your marginal cost per user is near zero, which it was in the seat-based era. It breaks when every API call has a real cost, because the billing system can't participate in the decision about whether to serve that request.

What's needed is billing in the request path. Not a batch process. A runtime system. One that answers the question *before* your app serves the request: Does this customer have credits? Are they within their usage limits? Is their entitlement active? It records the usage atomically, at the moment of consumption, not in a nightly batch.

AI-native companies figured this out early. Most SaaS companies adding AI features are learning the same lesson now.

---

## Credits Are Becoming the Default

Credits are showing up everywhere.

According to [Kyle Poyar's Growth Unhinged analysis](https://www.growthunhinged.com/p/2025-state-of-saas-pricing-changes) of the PricingSaaS 500, 79 companies now use credit-based models, up from 35 a year ago. A 126% increase. Among the new additions: Figma, HubSpot, and Salesforce.

Pure usage-based pricing (pay per token, pay per request) is economically correct but psychologically terrible. Enterprise buyers hate unpredictable spend. It's the number one barrier to AI feature adoption, ahead of price point.

The timeline tells the story:

- **May 2025:** [Salesforce](https://www.salesforce.com/news/press-releases/2025/05/15/agentforce-flexible-pricing-news/) launches Agentforce Flex Credits at $0.10/action
- **Jun 2025:** [HubSpot](https://ir.hubspot.com/news-releases/news-release-details/hubspot-credits) introduces Breeze Credits
- **2025:** [Adobe](https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-faq.html) runs generative credits across Creative Cloud. [Canva](https://www.canva.com/help/ai-access/) caps AI with monthly usage allowances.
- **Feb 2026:** [Notion](https://www.notion.com/help/custom-agent-pricing) launches Custom Agents. Free through May 3, then $10 per 1,000 credits.
- **Mar 2026:** [Figma](https://www.figma.com/blog/updates-to-ai-credits-in-figma/) starts selling credit subscriptions (Mar 11) and enforcing credit limits (Mar 18).

Credits are the visible surface change. The deeper shift is that AI workloads force pricing systems to participate in the request path.

Credits fix the buyer psychology problem. The customer pre-commits to a pool, say 50,000 tokens per month. They get spending predictability. You get variable-cost alignment. When the pool runs out, you can either hard-stop them (which actually increases adoption, because buyers trust the guardrail) or track the overage for billing.

But credits done right aren't simple. You need FIFO consumption across multiple grants, rollover policies, expiration dates, concurrent-safe balance updates, and the ability to check a credit balance in the request path before serving compute. That's not something you bolt onto Stripe.

---

## The Repricing Is Underway

Poyar and PricingSaaS tracked [more than 1,800 pricing changes across the top 500 SaaS companies](https://www.growthunhinged.com/p/2025-state-of-saas-pricing-changes) in 2025 alone. That's 3.6 changes per company. And [ICONIQ's State of AI survey](https://www.iconiqcapital.com/growth/insights/the-state-of-ai-in-2025) found 37% of companies plan to change their AI pricing model in the next year.

SaaS companies that figure out AI metering before the margin pressure forces their hand will have a real advantage. They'll price with precision, protect their unit economics, and avoid the trust erosion that comes from a sudden, reactive pricing change. The kind Cursor just went through.

The ones that wait will face a harder transition. Re-architecting billing under financial pressure. Migrating customers off plans that were never sustainable. Explaining to investors why gross margins contracted before they found a fix.

You could argue inference costs are falling fast enough to make this a non-issue. Maybe 5-10x per year. But usage isn't holding still. When costs drop, usage expands to fill the gap. A company that was running 1,000 AI requests a day at higher costs starts running 50,000 a day at lower costs. The per-unit cost falls, but total spend grows. Margin compression still occurs. The need for variable cost alignment doesn't go away just because the unit price drops. I could be wrong about the timeline. But I doubt the direction.

---

## A quick gut check

If you shipped AI features in the last two years, four questions worth asking:

**What does your highest-volume AI feature cost you per unit?**
If you can't answer this from your billing system, per customer, per feature, you have a visibility gap that grows with every user who adopts the feature.

**When a customer hits a usage limit, how long until your app knows?**
If the answer is "next billing cycle" or "when someone updates a feature flag," your entitlements aren't connected to your billing.

And two more that tend to be uncomfortable:

**How many systems would need to change to add usage-based pricing to one feature?**
If it's more than one, your billing stack is fragmented. Every pricing experiment will require engineering time you don't have.

**Can you run a margin report right now, per customer, per AI feature?**
If that requires a spreadsheet and a two-week lag, you don't have the operational visibility to make pricing decisions at the speed your cost structure demands.

---

The real problem isn't seat-based pricing. It's delayed economic feedback. When your billing system can't tell you, in real time, what a customer costs you to serve, every pricing decision is a guess. And when usage patterns shift as fast as they do with AI, guessing gets expensive.

Most SaaS companies that bundled "unlimited AI" are repricing or starting to. The ones that get ahead of it will treat billing as a runtime system. One that gates access, meters consumption, and gives finance real-time visibility into what each AI feature actually costs. Not a downstream invoicing tool that reconciles after the fact.
