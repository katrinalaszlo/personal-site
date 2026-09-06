---
title: "Mutual Legibility"
description: "The two-way communication problem at the heart of agent UX. How agents read human things, how humans read agent things, and three counterintuitive research findings."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/mutual-legibility
---

# Mutual Legibility

> The two-way communication problem at the heart of agent UX. Neither party has reliable access to the other's introspection. The interface stands in for missing telepathy.

## Two directions

> Start with what each side needs to understand.

The agent needs to understand the human's intent and constraints. The human needs to understand what the agent plans to do and how confident to be in the result. A product can make either direction easier or harder.

### Direction A: Human to Agent

How does the agent read non-agent things? Ambiguous instructions, codebases, screenshots, environment state, prior conversation turns. The system that cannot ground its understanding will silently fail or confidently produce nonsense.

- Tool documentation (the agent's actual UI)

- Context files: CLAUDE.md, AGENTS.md, .cursorrules

- Structured prompt scaffolding

- User-driven context injection (@ mentions, file references)

### Direction B: Agent to Human

How does the human read the agent? Its plan, reasoning, tool calls, confidence, failures. The system that cannot make itself observable is a black box, and a black box that takes consequential action is a liability.

- Plan-before-execute patterns

- Live diffs and change previews

- Confidence disclosure and hedging

- Tool-call transparency and audit trails

Every surface-level agent UX question (should we show a plan? should we ask permission? should we display reasoning?) bottoms out at mutual legibility. The theoretical foundations are old: Horvitz on mixed-initiative interaction (1999), Clark and Brennan on grounding in communication (1991), Lee and See on trust in automation (2004). The application to LLM agents is new, and the empirical results are counterintuitive.

## Three research findings

> Research findings about uncertainty, explanations, and shared understanding.

### 1. First-person hedges work. Generic ones don't.

"I'm not sure about this" reduces overreliance on wrong answers. "It's not clear" doesn't reach statistical significance. The model speaking as itself about its own uncertainty is more effective than abstract uncertainty language. This is not intuitive: both sentences express the same doubt. But humans respond to the agent's self-report differently than to a generic disclaimer.

**Design implication:** When an agent is uncertain, it should say "I" and own the uncertainty. Passive or generic hedging gets filtered out by the reader.

### 2. Explanations raise credibility uniformly, including for wrong answers.

More explanation is not automatically better. When an agent provides detailed reasoning, humans rate both correct and incorrect answers as more credible. The explanation makes everything sound more convincing, which is exactly the wrong effect when the answer is wrong. The interventions that selectively improve trust calibration are different: showing sources and surfacing inconsistencies.

**Design implication:** AX products should show sources, not explanations. If you want users to catch errors, expose the evidence chain, not the reasoning narrative.

### 3. Humans adapt down, not up.

When paired with an AI that doesn't ground well (doesn't ask clarifying questions, doesn't confirm understanding), humans reduce their own grounding behavior rather than compensating. They provide less context, ask fewer questions, accept more outputs without checking. The interface must compensate because the human won't.

**Design implication:** The interface must compensate for poor grounding because users won't escalate. This is why bounded inputs (Apple Intelligence's buttons, Vercel v0's prompt framework) outperform open-ended text boxes. Specific prompts produced output 19-26 seconds faster in Vercel's data.

> **The combined effect:** These three findings together explain why "just add more explanation" is the wrong instinct. Explanations raise credibility for wrong answers (finding 2), users won't push back on bad outputs (finding 3), and generic uncertainty signals get ignored (finding 1). The interventions that work are specific: first-person hedges, source citations, inconsistency surfacing, and bounded inputs.

## Establishing shared understanding

> How agents build (and lose) shared understanding with humans.

In linguistics, "grounding" is the process by which two parties establish mutual understanding. Clark and Brennan (1991) identified the mechanisms: acknowledgments, clarification requests, reformulations, confirmations. Humans do this automatically in conversation. LLMs do it poorly.

The products that have found traction are the ones that externalize grounding into persistent, editable artifacts:

### Externalized Memory Files

CLAUDE.md, replit.md, .cursorrules. The agent's knowledge base, made readable and editable by the human. Version-controlled, inspectable, local. These are grounding documents: they represent the shared understanding between human and agent. More powerful than chat history because they're curated rather than accumulated.

### Structured Prompt Scaffolding

Vercel's v0 uses a framework that nudges users toward inputs the agent can work with. Instead of an empty text box, it provides structure that guides the user's specification. The prompt becomes a teaching surface: it shows users what good input looks like while constraining the space of possible miscommunication.

### User-Driven Context Injection

Cursor's @ mentions let users explicitly inject files, docs, and context into the agent's window. This shifts grounding from implicit (the agent guesses what's relevant) to explicit (the user points at what matters). The user does more work, but can choose the context explicitly.

### Bounded Inputs

Apple Intelligence uses buttons instead of open-ended prompts. "Rewrite: Professional / Concise / Friendly." This constrains the space of possible instructions to the space of things the agent can reliably do. The UI communicates the agent's capabilities through its affordances.

## The time spent checking

> The invisible cost of checking whether the agent did the right thing.

Mozannar et al. (CHI 2024) found that programmers using GitHub Copilot spend substantial time reading, simulating, and verifying suggestions. This time is invisible to acceptance-rate metrics. A high acceptance rate does not mean high productivity if every accepted suggestion requires 45 seconds of mental simulation to verify.

Reasoning displays (thinking traces, chain-of-thought) should support efficient verification, not just comprehension. Long thinking traces that no one reads are worse than no trace at all: they manufacture an appearance of legibility without the substance. The user sees "the agent thought about this" and lowers their guard.

> **The design question:** Not "should we show reasoning?" but "does showing reasoning help the user verify faster?" If the thinking trace is 500 tokens and the code change is 3 lines, the trace is a tax, not an aid. The right display depends on what the human needs to check, not on what the agent did internally.

## Failure patterns

> Legibility failures that show up in production agent products.

Silent failure
B
Agent marks task complete without surfacing failures. The user thinks it worked. It didn't.

Confidence theater
B
Spinners and progress indicators without surfacing the plan or actual progress. Looks productive, communicates nothing.

Explanation inflation
B
Fluent, detailed explanations that uniformly raise credibility, including for wrong answers. More words, worse calibration.

Chat as only interface
B
No affordances, no comparison views, no persistence. The user can ask questions but can't see state.

Context collapse
A
Stale context carried across tasks without clean breaks. The agent acts on assumptions from three tasks ago.

Permission fatigue
B
Same approval prompt for every action. Users click through automatically. "The result is not security, it is liability documentation."

Reasoning as decoration
B
Long thinking traces no one reads. Manufactures the appearance of legibility without substance.

## Open questions

> Questions to investigate in agent interfaces.

### Common-Ground Tooling

Grounding needs its own evaluation: does the agent understand the user's context, and can the user tell what the agent understood? Task completion alone won't answer both questions.

### Legibility vs Predictability

Dragan and Srinivasa (HRI 2013) showed these are mathematically distinct: an efficient robot path may communicate poorly, and a legible path may be non-optimal. Applied to software agents: should an agent take a slightly less efficient path if it's easier for the human to follow? Untested in LLM contexts.

### Supervision Overhead

Designing for minimum supervision burden has almost no product traction. Current products either ask too much (permission fatigue) or too little (silent failure). The middle ground, asking at the right moments for the right things, is wide open.

### Three-Way Legibility

Customer-service AI adds a third party: the customer, the agent, and the support human. Sierra's "Jiminy Cricket" supervisory agents and Cresta's "whispering" (guidance visible to the AI but not the customer) are early patterns. No consumer-AI equivalent exists.

> **Sources:** Horvitz (1999), Clark & Brennan (1991), Lee & See (2004), Dragan & Srinivasa (HRI 2013), Mozannar et al. (CHI 2024), Anthropic's ACI framework, Vercel v0 data, Biilmann's AX framework, Sierra and Cresta product documentation.
