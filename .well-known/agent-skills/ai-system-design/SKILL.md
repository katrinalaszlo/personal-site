---
name: ai-system-design
description: >-
  Design and build AI-powered products. Covers the eight decisions framework
  (start with users not systems, three pillars of model/data/memory, LLM is not
  the default, orchestration before agents, three tiers of memory, failure modes),
  multi-agent team patterns (agent loops, DAGs, fan-out/fan-in, pipeline, checker,
  six knobs per agent, context protection, parallelism, meeting vs workspace model),
  and agent evaluation (vibes vs systematic, unit/trajectory/end-to-end/safety evals,
  LLM-as-judge with bias mitigation, key metrics, practical pipeline setup). Use when
  designing AI systems, building multi-agent architectures, setting up evaluation
  pipelines, choosing between single-agent and multi-agent approaches, or debugging
  agent team performance.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# Building AI Systems

Design, orchestrate, and evaluate AI-powered products. Three topics.

## AI System Design (8 Decisions)

1. Start with users, not the system. Pick one segment, map the journey, find the pain.
2. Name the three pillars: Model (what thinks), Data (what feeds it), Memory (what persists).
3. LLM is not the default. Churn prediction = XGBoost. Conversation = LLM. Match the tool to the job.
4. Orchestration before agents. Design the router before the specialists.
5. Memory is three tiers: Session (dies when conversation ends), Episodic (past interactions, per-user), Semantic (knowledge base, shared).
6. Show failure modes. Model down, high latency, repeat questions, low confidence, hallucination.

## Agent Teams (Multi-Agent Patterns)

An agent is a loop: Think, Act, Observe, repeat until termination condition.

**When to split**: context protection (focused contexts, clean output) or parallelism (independent evaluation, no anchoring). If neither applies, keep it in one agent.

**Four patterns**: Pipeline (A to B to C), Fan-out/Fan-in (coordinator splits to N workers, merges), Multi-wave (cascading fan-out), Checker (independent review after every write).

**Six knobs per agent**: model, tools, instructions, context, termination condition, output format.

## Agent Evaluation

Move from "seemed fine" to repeatable pipelines. Unit evals (single LLM call), trajectory evals (step sequence), end-to-end evals (final outcome), safety evals (what agent should NOT do). LLM-as-judge for subjective quality, calibrated against human labels. Start with unit evals, add complexity as needed.

## References

See `references/` for detailed content on each topic.
