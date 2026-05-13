---
impact: HIGH
impactDescription: Multi-agent orchestration patterns, six knobs per agent, when to split
---

# Agent Teams

## What is an agent?
A loop. Think, Act, Observe, repeat until termination condition. A function runs once. An agent keeps going until it decides it's finished.

## When to split into multiple agents
Two reasons only. If neither applies, keep it in one agent.
1. **Context protection**: focused contexts produce cleaner output than bloated ones
2. **Parallelism**: independent tasks run simultaneously, avoid anchoring bias

## Four patterns

### Pipeline
A to B to C. Each stage does one thing, passes output to next. Simple, linear, easy to debug.

### Fan-Out/Fan-In
One coordinator splits work to N workers, results get merged. Map-reduce. "Research 5 competitors" becomes 5 parallel agents, coordinator synthesizes.

### Multi-Wave
Cascading fan-out/fan-in. Each wave's output shapes the next. Most powerful pattern.

### Checker
After every write, independent agent checks the work. Pass = next step. Fail = back to writer. Cheap, catches most regressions.

## Six knobs per agent
1. Model (which LLM)
2. Tools (what it can do)
3. Instructions (what it should do)
4. Context (what it knows)
5. Termination condition (when to stop)
6. Output format (how to return results)

## Meeting vs Workspace model
Meeting: agents share a conversation (serial, context pollution). Workspace: agents share files/artifacts (parallel, clean contexts). Workspace model works better.
