---
title: "Trends in Credit-Based Pricing Patterns"
date: 2026-05-18
description: "Seven credit pricing frameworks reviewed by someone who built pricing at a B2B data API company. What holds up in production, and the operator's framework that came out the other side."
author: Kat Laszlo
---

# Trends in Credit-Based Pricing Patterns

Seven frameworks for credit-based pricing came out in the last few months. I read all of them. They're the best collective thinking on this topic right now.

I wanted to test each one against what I've actually seen -- building pricing at a B2B data API company and talking to AI founders about their pricing every week. Where does the theory hold up? Where does it run into reality?

This is a field report, not a critique. I'd genuinely love a conversation with any of these authors about where my experience doesn't match their models.

---

## The seven

### COMPASS — Mansard / Zuora

**Start here.** Structured diagnostic for picking the pricing metric before designing credits.

**Pros:** The right starting point. What are you charging for? That's the first question.

**Cons:** Founders overestimate their own attributability. Simpler test: can you write one sentence that says "one credit = one [thing the customer cares about]"? "$Y per record successfully returned" -- not "$X per enrichment credit."

### 10-Choice System — Forth / ValueIQ

**Most complete.** 10 design choices, 4 clusters. Anchored in EVE value methodology. The "Two Dials" insight.

**Pros:** The Two Dials -- price per credit vs credits per action as two independent levers. You can adjust specific actions quietly without a public price change. Useful for competitive response. I'd use this regardless of which framework I followed.

**Cons:** It assumes credits are always the right abstraction. Sometimes they are. Sometimes you should just price per action directly. What is an "AI credit"? Nobody knows. "$0.01 per record returned" -- everyone knows.

### Four-Step Calibration — Wilton / Monevate

**Sharpest insight.** Key reframe: credits are a payment mechanism, not a price metric.

**Pros:** That reframe. The thing you measure (value metric) and how money moves (billing mechanism) are separate decisions. You can price on outcomes and bill annually upfront. "Outcome-based" does not mean "pay-as-you-go." People conflate them constantly.

**Cons:** The maturity model (Level 1/2/3) tells you where you are but not how to get to the next level.

### Credit-Led Growth — Medina / Paid.ai

**Powerful when it fits.** AI agents as "synthetic labor." Repositions from IT spend to operations budget.

**Pros:** "This pool replaces 2.3 FTEs" moves the conversation to a 10x larger budget. The Value-to-Burn ratio as a CS metric is concrete and useful.

**Cons:** Most buyers aren't viewing AI as replacing labor yet. And the framework wants a full org restructure -- new sales comp, new CS triggers. In practice, you build pricing infrastructure that supports the org you have. The alignment follows the data.

### BVP AI Pricing Playbook — Bessemer Venture Partners

**Good first filter.** Business model typology: Copilot / Agent / AI-Enabled Service.

**Pros:** Stops you from debating pricing before you know what kind of product you're building. Their 2026 warning is real: the grace period for AI products that can't prove value is ending.

**Cons:** Selection framework, not design framework. Tells you which lane. Still need another framework to build the car.

### Poyar 2x2 + Dual-Track — Kyle Poyar / Growth Unhinged

**Best positioning tool.** Four credit archetypes. Dual-track: platform fee + token pass-through.

**Pros:** The 2x2 (cost vs value x customer-friendly vs vendor-friendly) is the best positioning tool in the set.

**Cons:** The Dual-Track solves a real problem -- protecting margins as LLM costs fall. The trade-off is that sales now has to explain two billing layers. Worth it for high AI-cost products. For the rest, a single value-metric price is simpler.

### Metronome AI Pricing Index — Metronome

**Reality check.** Empirical look at 50+ live AI pricing models.

**Pros:** Most honest document in the set. Shows what companies actually do vs. what frameworks say they should do. The gap is large.

**Cons:** Snapshot, not trend line. Can't tell which practices are sticking. Longitudinal tracking would be more valuable than any single framework.

---

## My framework

After reading all seven, here's what I'd actually do. It pulls from each of them and fills in the gaps I've seen in production.

> The value metric (what you measure) and the billing mechanism (when money moves) are separate decisions. Start there.

### 1. Know your customer. Name what they get.

If the buyer is a human, make it easy to understand. If the buyer is an agent, go as complex as you want -- agents can parse 500-row weight tables. The complexity ceiling is a property of the buyer, not the product. Either way: say what the credit buys. "Per record returned." "Per resolution." Not "AI credits."

### 2. Universal credit pool with cross-product flexibility

You can limit credits to one product. But architect it so you can convert across products later. When a customer miscalculated, or the use case changed, or they discover a different product is a better fit -- credits that convert keep them in the ecosystem. This is a retention mechanism. At PDL, each endpoint had different credit weights, but the pool was universal.

### 3. Per-key controls and limits

Customers at PDL wanted budget controls at the API key level. A data science team gets 5K credits/month. A production pipeline gets 50K. The API key is already how they scope access -- per-key limits are governance without a new abstraction. In agent architectures, this is per-agent budgets for free.

### 4. Rollover mitigates churn

Customers who have balance are less likely to leave. Credits that roll over (up to the next plan level, forfeited on cancel) tie credit preservation to continued commitment. This turns a lifecycle policy into a retention lever.

### 5. Burndown prediction: "When will I run out?"

This was the #1 ask at PDL from sales teams and customers. Projected depletion date based on current burn rate. A customer who sees they'll hit zero in 3 weeks starts the re-up conversation early instead of churning at the wall. This is retention infrastructure.

### A few more things I believe

1. **Cost-plus is the floor.** Everyone does it. Set the floor. Then layer buyer context on top -- use case, competitive risk, customer segment, field value. The floor protects margin. Everything above it is the value work.

2. **Be careful lowering the entry point.** Lower entry drives acquisition. It also sets the anchor for renewal. At renewal, customers pick the lowest tier that covers their usage. Feature-gated tiers resist downgrade better than volume-only tiers.

3. **Outcome confidence is on the seller.** The frameworks frame outcome pricing as a buyer trust problem. In practice, the confidence gap is on the seller side. If you trust your product, offer committed outcome pools at a discount. That signals confidence.

4. **Build for the org you have.** Define PQL and SQL thresholds from consumption data. Route high-error customers to CS. Surface burn rate to sales. Ship pricing infrastructure first. Org alignment follows the data.

---

Seven frameworks in. Filtered through production. That's what came out the other side.

The gaps in my experience are the places where these frameworks add the most value. I'd love to hear from Mansard, Forth, Wilton, Medina, the Bessemer team, Poyar, and the Metronome team on where I'm off.
