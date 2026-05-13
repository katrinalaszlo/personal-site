---
impact: HIGH
impactDescription: HCI research foundation for agent UX design decisions
---

# Mutual Legibility

Two-way communication problem: making human and model readable to each other.

## Two directions

**Direction A (human to agent)**: How does the agent read non-agent things? Ambiguous instructions, codebases, environment state. System that cannot ground will silently fail or confidently hallucinate.

**Direction B (agent to human)**: How does the human read the agent? Plan, reasoning, tool calls, confidence, failures. System that cannot make itself observable is a black box taking consequential action.

## Three counterintuitive findings

1. **First-person hedges work, generic don't.** "I'm not sure" reduces overreliance on wrong answers. "It's not clear" doesn't reach significance. The model speaking as itself about its uncertainty matters.

2. **Explanations raise credibility uniformly, including for wrong answers.** More explanation makes everything sound more convincing. Show sources, not explanations. Expose evidence chains, not reasoning narratives.

3. **Humans adapt down, not up.** Paired with poor-grounding AI, humans reduce their own grounding behavior. They provide less context, accept more without checking. The interface must compensate because the human won't.

## Grounding solutions that work

- **Externalized memory files** (CLAUDE.md, replit.md): agent's knowledge base, readable and editable by human
- **Structured prompt scaffolding** (v0 framework): nudge users toward inputs agents can ground on. 19-26 seconds faster.
- **User-driven context injection** (Cursor @ mentions): explicit, not implicit
- **Bounded inputs** (Apple Intelligence buttons): constrain input space to agent's reliable capability

## Anti-patterns

| Pattern | Direction | Problem |
|---|---|---|
| Silent failure | B | Agent marks complete without showing failures |
| Confidence theater | B | Spinners without surfacing plan or progress |
| Explanation inflation | B | Fluent explanations uniformly raise credibility |
| Context collapse | A | Stale context across tasks without clean breaks |
| Permission fatigue | B | Same prompt for every action, users click through |
| Reasoning as decoration | B | Long traces nobody reads |

## Verification tax

Programmers using Copilot spend substantial time reading, simulating, verifying suggestions (Mozannar et al., CHI 2024). Invisible to acceptance-rate metrics. Reasoning displays should support efficient verification, not just comprehension.

## Theoretical foundations

Horvitz (1999), Clark & Brennan (1991), Lee & See (2004), Dragan & Srinivasa (HRI 2013).
