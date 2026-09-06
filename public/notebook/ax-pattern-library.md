---
title: "The AX Pattern Library"
description: "Design patterns for software that agents use. Four patterns for instruction files, documentation, tool interfaces, and access control, every one mapped to documented, named failures."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/ax-pattern-library
---

# The AX Pattern Library

> Design patterns for software that agents use. v1: four patterns for instruction files, documentation, tool interfaces, and access control. Each pattern starts with a documented failure and asks what a design change could improve.

## The thesis

When an agent fails on your product, a new SDK or template may not address what went wrong. The incidents below also involve design: what the agent reads first, how it chooses a tool, and whether it understands its permissions.

**Build** Developer ships something that technically works.
**Fail** An agent uses it and fails. The interface gives it too little guidance about what to do.
**Search** Developer looks for engineering fixes: "MCP best practices," "CLAUDE.md template."
**Stuck** The answers don't solve it, because the problem is design.

> **The frame:** a CLAUDE.md is an onboarding flow. Docs are a usability test. A tool list is a choice architecture. A budget is progressive disclosure. Developers already live these problems; they've just never been told it's the same problem they'd hand to a designer.

## P1: Specs are design artifacts

CLAUDE.md · AGENTS.md
The break
Instruction files get written like READMEs, every rule in one flat dump. Agents hold consistent compliance for roughly the first 15 tool calls, then degrade; past ~150 lines, more rules produce *worse* adherence, and context compaction drops procedural rules while keeping task objectives.

The reframe
A CLAUDE.md is not documentation. It is an **onboarding flow for a non-human user**, and nobody would ship an onboarding screen that shows every feature at once. The questions are information-architecture questions: what comes first, what stays global, what gets disclosed where the work happens.

The practice

- **Priority layering.** The few rules that must never break go first, stated once, in imperative voice. Everything else is context, not law.

- **Directory-level scoping.** Rules about `src/features/` live in `src/features/CLAUDE.md`, disclosed when the agent is there, invisible when it isn't.

- **State the current pattern, not the history.** Agents infer conventions from whatever code they see first; say explicitly which pattern wins.

- **Test it like a flow.** Give a fresh agent a real task and watch where it deviates. Every deviation is an IA bug in the file, not a model failure.

Before · the README approach

```
# CLAUDE.md  (one file, 400 lines)
We use TypeScript. PostgreSQL with Prisma.
Follow existing patterns. Run tests before
committing. Don't modify the auth middleware.
API responses use camelCase. Errors use the
AppError class. Components live in…
…390 more lines: style rules, deploy notes,
git etiquette, every edge case ever hit…
```

Agent re-reads all 400 lines every turn. Complies for ~15 tool calls, then drifts. "Follow existing patterns" means whichever file it opened first.

After · the onboarding-flow approach

```
# CLAUDE.md  (root: 25 lines, non-negotiables)
NEVER modify src/auth/middleware.ts.
New endpoints go in src/features/<name>/
src/routes/ is legacy. Do not add to it.
All DB access through Prisma. Raw SQL is
always wrong here. Run `npm test` pre-commit.

# src/features/CLAUDE.md  (scoped)
Each feature: route.ts, schema.ts (zod),
service.ts. Copy segments/ as the template.
```

Same knowledge, layered: 25 global lines the agent can hold, with feature rules disclosed only where the work happens, and a named template to copy.

**4,090 upvotes** on the AGENTS.md issue, 7 months unanswered
**~15 tool calls** before compliance degrades
**−25% completeness** from a bad AGENTS.md (Augment Code)
"200 lines of rules. All ignored."

## P2: The agent is your usability tester

docs · quickstarts · references
The break
Docs are designed for human scanning: framework tabs, accordions, interactive selectors. Agents read linearly. They take the first code block they reach, never see tab three, and confidently generate integrations that crash. Worse: they misread outcomes. Stripe documented agents treating 400 errors as success and marking the task complete.

The reframe
Every agent failure on your docs is a **usability finding**. The method already exists: it's a usability test where the participant happens to be a model. Netlify runs this internally; nobody has published it as practice.

The practice

- **Run the test before shipping.** Fresh agent, real task ("integrate this SDK into a Next.js app"), no hints. Log every wrong turn.

- **Serialize what interaction hides.** Every tab variant and accordion answer must exist in the linear reading order, or in llms.txt.

- **Put the load-bearing command first.** JetBrains found 16 agents independently hitting the same problem: the critical command was buried at line 91.

- **Make errors legible as errors.** If a failure response can be read as success, an agent will read it as success.

**50% → 67–88%** task success with an agent-purpose-built doc (Supabase)
**400-as-success** failure mode (Stripe)
**Line 91**: most important command, found by 16 agents (JetBrains)
"If an agent can't figure out your API, neither can your users" (Stytch)

## P3: Tools are choices, not endpoints

MCP servers · tool schemas
The break
Developers map REST endpoints 1:1 to MCP tools. The agent faces 30, 50, 101 near-identical options, burns half its context loading schemas, picks wrong, or fails silently. A Queen's University study found **97.1% of MCP tool descriptions contain anti-patterns**. The servers work. The interfaces don't.

The reframe
A tool list is a **choice architecture**. The LLM sees only names, descriptions, parameters, and outputs. If something isn't explicit there, it doesn't exist. That's interface design, with the same disciplines: reduce options, name by intent, describe *when*, not just *what*.

The practice

- **Design for the decision, not the API.** Block went from 30+ Linear tools to 2, across three rebuilds. GitHub Copilot cut 40 to 13 and measured the improvement.

- **Write "use this when…" descriptions.** The description's job is disambiguation between tools, not endpoint documentation.

- **Fail loudly.** A tool that silently drops an unknown parameter costs the agent attempt after attempt; a crash costs one.

- **Ask whether it should be a tool at all.** If the agent can run a CLI command, a tool that wraps the same thing is pure schema tax (Nx deleted theirs).

**97.1%** of tool descriptions have anti-patterns (Queen's)
**30+ → 2 tools**, three rebuilds (Block)
**101 tools, 64.6k tokens** at startup (GitHub MCP)
**52% of MCP servers** dead on arrival (Rapid Claw audit)

## P4: Safety rails are the experience

budgets · keys · permissions
The break
Agent access is binary: blocked entirely, or unrestricted. The result is a documented incident class: a $500M monthly Claude bill at one enterprise, Uber's annual AI budget gone in four months, a $47,000 two-agent loop that ping-ponged for eleven days because no per-agent ceiling existed. The opposite failure is just as real: **permission fatigue**, agents that ask approval for every step until users click "allow" blindly. A satirical game about exactly this hit the Hacker News front page.

The reframe
Scoped capability is **product UX, not a security afterthought**. A well-designed boundary is what lets an agent act confidently, and lets its human delegate without watching. The industry term forming for this is **progressive delegation**: the user's approval history sets the pace of autonomy, so the agent earns permission through demonstrated reliability instead of demanding it upfront. The gap between 6% of companies fully trusting agents and 40% projected enterprise adoption makes those boundaries worth testing.

The practice

- **Per-agent, per-session budgets by default.** Vercel ships a $200 default budget with agent deploys; default-unlimited is a design decision too, a bad one.

- **Scoped, time-bounded, introspectable keys.** An agent should be able to ask what it's allowed to do before it tries.

- **Graduated trust, made explicit.** New agent: read-only with caps. Proven agent: wider scopes. Let approval history widen the ladder automatically; that's progressive delegation in practice, and the cure for permission fatigue.

- **Budget exhaustion is a UX state.** Design what the agent sees at the limit: a legible "stop and report" beats a silent failure loop.

**$500M** one-month bill, no caps (US enterprise)
**$47K loop**: 11 days, no ceiling
**6% trust vs 40% adoption**: the collision course (Gartner)
**"Continue? Y/N"**: permission-fatigue game, HN front page

## A worked example, caught live

> **Divergent surfaces.** While preparing this library I audited my own product's site, one I'd already made agent-readable (llms.txt, AGENTS.md, MCP discovery, agent auth). The human page and the agent page disagreed: the llms.txt still described the previous product, with prices 3x higher than the live pricing table. An agent comparing vendors for its human would have read the wrong product at the wrong price, and the page "worked" the whole time. The durable fix is generating every surface from one source of truth so they *can't* diverge. I study this full-time and still missed it on my own site.

## Why a pattern library, and why from a designer

The discipline is being named right now: John Maeda's 2026 Design in Tech Report is titled "From UX to AX," and agencies are publishing frameworks monthly. Meanwhile the people best equipped for this work are locked out of it: in a widely shared r/UXDesign thread, a designer at an AI-agent company describes having no input when agents get built, because agent behavior is treated as "technical workflows," with design called in afterward to decorate the output.

That's the gap this library exists for. Agent behavior *is* interface design, and designers need the vocabulary and the patterns to claim the room. Three serious frameworks already exist, none of them are practitioner guidance:

| Org | Framework | What's missing |
| --- | --- | --- |
| NNGroup | "Agents are users"; accessibility as near-term agent compatibility | Research and theory, no implementation practice |
| Microsoft | Space/Time/Core, six principles, uncertainty as a design element | Engineering principles, no UX process |
| Amazon | Three zones of delegation plus coordination curves | Describes the handoff, doesn't teach the design |

> These guides leave room for a practical design process: observe an agent attempting a task, find where it gets confused, and test a change. That is the work I want this library to support.

v1 covers the surfaces agents *consume*. Two directions are next: the supervision surfaces (planning visibility, tool-use disclosure, memory surfacing, workflow tracking, recovery routing, documented across the field, productized by nobody) and pricing pages agents can read. If you're building either, I want to hear about it.

> Patterns verified against named incidents: Block, GitHub, Supabase, Stripe, JetBrains, AWS, Netlify/Clerk, Workato, Nx, Vercel, Uber, and a Queen's University audit of MCP tool descriptions. Community signal: r/UXDesign, Hacker News, the 2026 Design in Tech Report. Research method: two rounds of parallel-agent verification; all claims trace to published sources. Part of the [notebook](/notebook) · [Agent Experience](/notebook/agent-experience) · [Mutual Legibility](/notebook/mutual-legibility)
