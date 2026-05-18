---
impact: CRITICAL
impactDescription: Framework for designing AI-powered products, from user research to failure modes
---

# AI System Design: Eight Decisions

Framework from Aman Agarwal for adding AI to a product.

## 1. Start with users, not the system
Pick one segment. Map the journey. Find the pain. "I'd build an LLM chatbot" is a reflex, not a design decision. Start with a person and their problem.

## 2. Name the three pillars
- **Model**: what does the thinking. What type? Why? Latency budget?
- **Data**: what feeds the model. Where from? How fresh? Privacy constraints?
- **Memory**: what persists across interactions. What does the system remember?

## 3. LLM is not the default
Different jobs need different models. Churn prediction = XGBoost (structured data, $0.001/prediction). Customer conversation = LLM (natural language, $0.01-0.10/prediction). Match the tool to the job.

## 4. Orchestration before agents
Design the router before the specialists. Intent classification with confidence scores. Below threshold routes to human with transcript. System learns from every handoff.

## 5. Memory is three tiers
- **Session**: current conversation. Dies when conversation ends.
- **Episodic**: past interactions with this user. Permanent, per-user, vector DB.
- **Semantic**: knowledge base, docs, policies. Permanent, shared across users.

## 6. Show failure modes
Model down (health check, human handoff). High latency (monitoring, async notification). Repeat question (escalate immediately). Low confidence (route to human with context). Hallucination (grounding check, verified response).
