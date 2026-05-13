---
impact: MEDIUM
impactDescription: Message-based agent coordination via pub/sub patterns
---

# Hermes Orchestration

Message-based coordination system for multi-agent workflows.

## Core Pattern
Pub/sub for agents. Agents subscribe to topics, publish results, coordinate without direct coupling. Decoupled architecture where agents don't need to know about each other.

## How It Works
1. Define topics (e.g., "research-complete", "review-needed", "deploy-ready")
2. Agents subscribe to relevant topics
3. When an agent finishes work, it publishes to a topic
4. Subscribing agents pick up the message and act

## Benefits
- Agents are independent and replaceable
- Adding new agents doesn't require changing existing ones
- Natural parallelism (multiple agents can subscribe to same topic)
- Clean separation of concerns

## When to Use
Best for workflows where agents produce artifacts other agents consume, but the producer doesn't need to know who consumes. Contrast with direct agent-to-agent calls which create tight coupling.
