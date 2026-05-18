---
impact: HIGH
impactDescription: Moving from manual testing to repeatable eval pipelines for AI agents
---

# Agent Evaluation

Moving from "seemed fine" to a repeatable pipeline that catches regressions.

## Vibes vs Systematic
Vibes: try three inputs, they look good, deploy. Miss most regressions. Systematic: write test cases once, run on every change, get comparable scores.

## Four Types of Evals

### Unit Evals
Single LLM call in isolation. Fast, deterministic. "Given this complaint, does the classifier output the correct category?"

### Trajectory Evals
Sequence of steps. "Did the agent look up the order before issuing the refund?" Catches planning failures unit evals miss.

### End-to-End Evals
Final outcome regardless of path. "Is the address actually updated in the database?" Slowest, hardest to debug, catches integration issues.

### Safety/Adversarial Evals
What the agent should NOT do. Prompt injection, jailbreaks, system prompt extraction. Regression tests for guardrails.

## Two Layers
When an eval fails, know which layer broke:
- **Reasoning**: task understanding, planning, tool selection. Wrong tool, misinterprets request.
- **Action**: tool execution, API calls, transforms. Right tool, wrong parameters.

## LLM-as-Judge
Use one LLM to score another's output against a rubric. Known biases: position bias (~40% inconsistency on swap), verbosity bias (+15% for longer), self-preference, anchoring. Mitigate: run both orderings, use 1-4 scales, different model family as judge, randomize examples. Calibrate against human labels (aim 75-90% agreement).

## Rubric Design
Vague rubrics produce vague scores. Each level needs concrete description. "Rate helpfulness 1-5" is bad. "1 = doesn't address question, 5 = fully addresses + anticipates follow-ups" is good.
