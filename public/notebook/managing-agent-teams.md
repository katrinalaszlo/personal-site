---
title: "Agent Teams"
description: "From managing engineers to managing agents. Delegation patterns, evaluation, and coordination."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/managing-agent-teams
---

# Agent Teams

> From managing engineers to managing agents

## What is an agent?

> An agent repeatedly observes, chooses an action, and checks the result.

Observe → Think → Act → Check → Done?

If not done, loop back to Observe. Repeat until termination condition met.

> **PM analogy:** An engineer working a ticket does the same loop. Look at the ticket, think about the approach, write code, check if it works. Repeat until done. The difference: agents loop in seconds, not hours.

A function runs once and returns. An agent keeps going until it decides it's finished.

When you give Claude Code a task and it reads files, edits code, runs tests, fixes errors, and tries again -- that's this loop.

### The key word: termination condition

"Tests pass" is a termination condition. "I've been going for 50 iterations" is a termination condition. Without one, the agent keeps running forever.

This is the equivalent of an engineer who never ships -- they keep polishing forever.

## What is a DAG?

> A directed acyclic graph. Or: a project plan drawn as a diagram.

Alice research

↓          ↓

Bob backend
Carol frontend

↓          ↓
You review

> **PM analogy:** This is just a project plan. Alice writes a spec. Bob and Carol work in parallel (they don't depend on each other). You review at the end. You already think in DAGs -- every Gantt chart is one. The only new thing: the workers are agents instead of humans.

**Directed** means data flows one way (Alice to Bob, not Bob to Alice). **Acyclic** means no circles -- nobody waiting on someone who's waiting on them.

## Meeting model vs Workspace model

> Compare agents exchanging messages with agents working from shared files.

### Meeting Model

chaotic

A: I found the API docs
B: That changes my approach
C: I disagree with B
D: Wait, what about...
A: No, listen to me
B: This contradicts A
C: Can someone clarify?
D: Are we done yet?

Every message fills every agent's context with irrelevant noise. Like putting your whole team in one Slack channel.

### Workspace Model

clean

A
B
C

spec.md ← A wrote
api.ts ← B wrote
ui.vue ← C wrote
result/ ← all write

Agents read/write to shared files. No direct communication. Like engineers pushing to a repo. Each sees only what's relevant.

> **PM analogy:** The meeting model is every engineer in one noisy Slack channel doing all work by chatting. Works for 3, chaos for 10. The workspace model is how your team actually works: push to repo, pull what you need, never sit in a meeting about it.

## The two reasons to split

> If neither applies, keep it in one agent.

### Context Protection

LLMs can lose focus as context fills with irrelevant content. Modern long-context models handle this better than earlier ones, but keeping context focused still improves output quality.

### One Agent

context window

quality

Bloated context, degrading output

### Two Agents

agent A context

agent B context

quality

Focused contexts, clean output

> **PM analogy:** You don't invite the whole company to every meeting. You invite the people who need to be there and give them only the context they need.

### Parallelism

Independent tasks run at the same time. But the subtler benefit: it avoids path dependence. Two distinct benefits: speed (parallel execution) and independence (each agent reasons from scratch, avoiding anchoring bias from prior results).

### Sequential (slow, anchored)

A

B
C

Each anchored by previous result

### Parallel (fast, independent)

A
B
C

Independent evaluation, no anchoring

> **PM analogy:** You send two engineers to evaluate two approaches independently. If one evaluates both sequentially, they unconsciously favor whichever they looked at first.

### The Filter

Before splitting any task across agents, ask: **"Am I buying context protection, parallelism, or neither?"** If neither, you've added complexity for nothing.

## Six knobs per agent

> These six settings are a useful place to start when configuring an agent or diagnosing a failure.

## Four patterns

> Almost every multi-agent system is one of these, or a combination.

Pipeline
Fan-out / Fan-in
Phased-parallel
Verifier-in-the-loop

**A -> B -> C.** Each stage does one thing, passes output to the next.

Example: Research -> Implement -> Test. Simple, linear, easy to debug. Use when each step genuinely needs different context or tools.

**One coordinator splits work to N workers, results get merged.** This is map-reduce.

Example: "Research 5 competitors" -> 5 agents each research one -> coordinator synthesizes. parallel section highlighted.

**Multiple waves of fan-out/fan-in.** Each wave's output shapes the next. Useful when later work depends on the results of an earlier batch.

Example: Classify notes (parallel) -> Cross-reference per category (parallel) -> Write articles (parallel) -> Editorial review.

**After every write, an independent agent checks the work.** If pass, next step. If fail, back to writer.

Equivalent of requiring code review before merge. Adds a separate review before the next step.

## A real setup

> 20+ agents. 4 scopes. You're the orchestrator -- and you can't see the system you're orchestrating.

### Agent scopes

◆ Global (cross-project agents)

skill-capture
workforce-review
learnings
pr-review
hallucination-audit
drift-check
config-audit
context-degradation
bug-ledger

◆ Org / Shared (domain agents)

feature-dev
spec-first
testing-expert
security-expert
performance-expert
error-handling
api-design
docker-expert
ci-fixer
qa-reviewer

◆ Backend (repo-specific)

optimize-db
security-audit
monitoring
hotfix-deploy
rest-api
perf-audit

◆ Frontend (repo-specific)

component-lib
a11y-checker

### The instruction stack

Every time an agent runs, it inherits layers of context. This is what you can't see:

1 System prompt (model baseline)
2 Global CLAUDE.md (your rules, identity, code quality)
3 Global rules (framework conventions, lint rules)
4 Global rules (error handling, code style)
5 MEMORY.md (auto-persisted context)
6 Project CLAUDE.md (repo-specific rules)
7 Project settings.json (tools, permissions)
8 Hooks (pre/post-commit, lint, format)
9 Skill definitions (~/.claude/skills/)
10 Plugin instructions (MCP servers)
11 Conversation context (your messages + tool results)
12 Subagent scoping (when spawned)
13 Tool schemas (available capabilities)

### The gap

Without visibility into each agent's tools, instructions, and current task, coordination becomes guesswork. Make that state inspectable from one place.

## Check your understanding

> Look at a system and name its parts. Three scenarios, increasing difficulty.

Scenario 1 of 3

0/18
You understand multi-agent systems when you can name these six things on sight for any system.
