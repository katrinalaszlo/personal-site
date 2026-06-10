---
title: "The AX Pattern Library"
description: "Design patterns for software that agents use. Four patterns for instruction files, documentation, tool interfaces, and access control, every one mapped to documented, named failures."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/ax-pattern-library
---

# The AX Pattern Library

> Design patterns for software that agents use. v1: four patterns for instruction files, documentation, tool interfaces, and access control. Every pattern maps to documented, named failures. None of them are engineering problems.

## The thesis

When an agent fails on your product, the instinct is to search for the engineering fix: a better template, a newer SDK. But the failures follow the same arc every time, and the missing discipline is UX methodology applied to non-human users.

The arc, in every documented incident:

1. **Build**: developer ships something that technically works.
2. **Fail**: an agent uses it and fails. Not broken; just not designed for how agents read.
3. **Search**: developer looks for engineering fixes: "MCP best practices," "CLAUDE.md template."
4. **Stuck**: the answers don't solve it, because the problem is design.

The frame: a CLAUDE.md is an onboarding flow. Docs are a usability test. A tool list is a choice architecture. A budget is progressive disclosure. Developers already live these problems; they've just never been told it's the same problem they'd hand to a designer.

## P1: Specs are design artifacts (CLAUDE.md / AGENTS.md)

**The break.** Instruction files get written like READMEs, every rule in one flat dump. Agents hold consistent compliance for roughly the first 15 tool calls, then degrade; past ~150 lines, more rules produce *worse* adherence, and context compaction drops procedural rules while keeping task objectives.

**The reframe.** A CLAUDE.md is not documentation. It is an onboarding flow for a non-human user, and nobody would ship an onboarding screen that shows every feature at once. The questions are information-architecture questions: what comes first, what stays global, what gets disclosed where the work happens.

**The practice.**
- Priority layering: the few rules that must never break go first, stated once, in imperative voice.
- Directory-level scoping: rules about `src/features/` live in `src/features/CLAUDE.md`, disclosed when the agent is there.
- State the current pattern, not the history: agents infer conventions from whatever code they see first.
- Test it like a flow: give a fresh agent a real task and watch where it deviates. Every deviation is an IA bug.

**Before (the README approach):** one 400-line file. "We use TypeScript. PostgreSQL with Prisma. Follow existing patterns…" plus 390 more lines of style rules, deploy notes, and edge cases. The agent re-reads it every turn, complies for ~15 tool calls, then drifts.

**After (the onboarding-flow approach):** a 25-line root file with only non-negotiables ("NEVER modify src/auth/middleware.ts. New endpoints go in src/features/<name>/. src/routes/ is legacy."), plus a scoped `src/features/CLAUDE.md` with the feature template. Same knowledge, layered.

**Evidence:** 4,090 upvotes on the AGENTS.md GitHub issue (7 months unanswered) · compliance degrades after ~15 tool calls (Kathpal) · −25% task completeness from a bad AGENTS.md (Augment Code) · "200 lines of rules. All ignored." (DEV Community)

## P2: The agent is your usability tester (docs)

**The break.** Docs are designed for human scanning: framework tabs, accordions, interactive selectors. Agents read linearly: they take the first code block they reach, never see tab three, and confidently generate integrations that crash. Stripe documented agents treating 400 errors as success and marking the task complete.

**The reframe.** Every agent failure on your docs is a usability finding. It's a usability test where the participant happens to be a model. Netlify runs this internally; nobody has published it as practice.

**The practice.**
- Run the test before shipping: fresh agent, real task, no hints. Log every wrong turn.
- Serialize what interaction hides: every tab variant must exist in the linear reading order, or in llms.txt.
- Put the load-bearing command first (JetBrains: 16 agents independently found the critical command buried at line 91).
- Make errors legible as errors: if a failure response can be read as success, an agent will read it as success.

**Evidence:** 50% → 67–88% task success with an agent-purpose-built doc (Supabase) · 400-as-success failure mode (Stripe) · "If an agent can't figure out your API, neither can your users" (Stytch)

## P3: Tools are choices, not endpoints (MCP)

**The break.** Developers map REST endpoints 1:1 to MCP tools. The agent faces 30, 50, 101 near-identical options, burns half its context loading schemas, picks wrong, or fails silently. A Queen's University study found 97.1% of MCP tool descriptions contain anti-patterns. The servers work. The interfaces don't.

**The reframe.** A tool list is a choice architecture. The LLM sees only names, descriptions, parameters, and outputs. If something isn't explicit there, it doesn't exist. That's interface design: reduce options, name by intent, describe *when*, not just *what*.

**The practice.**
- Design for the decision, not the API: Block went from 30+ Linear tools to 2, across three rebuilds. GitHub Copilot cut 40 to 13 and measured the improvement.
- Write "use this when…" descriptions: the description's job is disambiguation, not endpoint documentation.
- Fail loudly: silent parameter-dropping costs the agent attempt after attempt; a crash costs one.
- Ask whether it should be a tool at all: if the agent can run a CLI command, a wrapping tool is schema tax (Nx deleted theirs).

**Evidence:** 97.1% of tool descriptions have anti-patterns (Queen's) · 30+ → 2 tools (Block) · 101 tools consuming 64.6k tokens at startup (GitHub MCP) · 52% of MCP servers dead on arrival (Rapid Claw audit)

## P4: Safety rails are the experience (budgets, keys, permissions)

**The break.** Agent access is binary: blocked entirely, or unrestricted. The result is a documented incident class: a $500M monthly Claude bill at one enterprise, Uber's annual AI budget gone in four months, a $47,000 two-agent loop over eleven days with no per-agent ceiling. The opposite failure is just as real: permission fatigue, agents that ask approval for every step until users click "allow" blindly.

**The reframe.** Scoped capability is product UX, not a security afterthought. A well-designed boundary is what lets an agent act confidently, and lets its human delegate without watching. The industry term forming for this is **progressive delegation**: approval history sets the pace of autonomy, so the agent earns permission through demonstrated reliability. With 6% of companies fully trusting agents against 40% projected enterprise adoption, this is the design problem of the next two years.

**The practice.**
- Per-agent, per-session budgets by default (Vercel ships a $200 default budget; default-unlimited is a design decision too, a bad one).
- Scoped, time-bounded, introspectable keys: an agent should be able to ask what it's allowed to do before it tries.
- Graduated trust, made explicit: read-only with caps for new agents, wider scopes earned through approval history.
- Budget exhaustion is a UX state: a legible "stop and report" beats a silent failure loop.

**Evidence:** $500M one-month bill, no caps (US enterprise) · $47K eleven-day loop · 6% trust vs 40% adoption (Gartner) · "Continue? Y/N" permission-fatigue game on the HN front page

## A worked example, caught live

**Divergent surfaces.** While preparing this library I audited my own product's site, one I'd already made agent-readable (llms.txt, AGENTS.md, MCP discovery, agent auth). The human page and the agent page disagreed: the llms.txt still described the previous product, with prices 3x higher than the live pricing table. An agent comparing vendors for its human would have read the wrong product at the wrong price, and the page "worked" the whole time. The durable fix is generating every surface from one source of truth so they can't diverge. If it happened on the site of someone who studies this full-time, it's happening on yours.

## Why a pattern library, and why from a designer

The discipline is being named right now: John Maeda's 2026 Design in Tech Report is titled "From UX to AX." Meanwhile the people best equipped for the work are locked out of it: designers at AI-agent companies report having no input when agents get built, because agent behavior is treated as "technical workflows."

Three serious frameworks exist, none of them practitioner guidance:

| Org | Framework | What's missing |
| --- | --- | --- |
| NNGroup | "Agents are users"; accessibility as agent compatibility | Research and theory, no implementation practice |
| Microsoft | Space/Time/Core, six principles | Engineering principles, no UX process |
| Amazon | Three zones of delegation + coordination curves | Describes the handoff, doesn't teach the design |

The whitespace: every agentic guide covers architecture with zero UX methodology, and every MCP tutorial teaches *how to build*, never *how to design*. This library is the bridge, written by someone who has shipped UX for humans, DX for developers, and now AX for agents.

v1 covers the surfaces agents *consume*. Next: the supervision surfaces (planning visibility, tool-use disclosure, memory surfacing, workflow tracking, recovery routing) and pricing pages agents can read. If you're building either, I want to hear about it.

---

Patterns verified against named incidents: Block, GitHub, Supabase, Stripe, JetBrains, AWS, Netlify/Clerk, Workato, Nx, Vercel, Uber, and a Queen's University audit of MCP tool descriptions. Research method: two rounds of parallel-agent verification; all claims trace to published sources.
