---
name: agent-tools
description: >-
  Specific agent platforms and orchestration tools. Covers OpenClaw personal agents
  (local-first agent framework, personal agent architecture, tool management,
  memory persistence, multi-agent coordination) and Hermes orchestration (message-based
  agent coordination, pub/sub patterns, agent-to-agent communication, workflow
  orchestration). Use when building personal AI agents, setting up agent orchestration
  infrastructure, or evaluating agent frameworks and coordination patterns.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# Agent Tools

Specific platforms and frameworks for building and orchestrating agents.

## OpenClaw Personal Agents

Local-first agent framework for personal AI. Key concepts: personal agent architecture (agents that work for one person across all their tools), tool management (agents discover and use tools via registries), memory persistence (agents remember across sessions), multi-agent coordination (personal agents collaborating with each other and external agents).

## Hermes Orchestration

Message-based agent coordination system. Pub/sub patterns for agent-to-agent communication. Workflow orchestration where agents subscribe to topics, publish results, and coordinate without direct coupling. Useful pattern for decoupled multi-agent systems where agents don't need to know about each other.

## References

See `references/` for detailed content on each topic.
