---
impact: MEDIUM
impactDescription: Local-first personal agent framework and architecture patterns
---

# OpenClaw Personal Agents

Local-first framework for personal AI agents that work for one person across all their tools.

## Core Concepts
- **Personal agent architecture**: agents that serve one user, not a platform. Your agent knows your preferences, tools, accounts.
- **Tool management**: agents discover and use tools via registries. MCP servers, CLI tools, APIs.
- **Memory persistence**: agents remember across sessions via file-based and vector-based memory.
- **Multi-agent coordination**: personal agents collaborating with each other and with external agents (like Devin or company agents).

## Key Pattern
The personal agent is a coordinator that delegates to specialized sub-agents. Calendar agent, email agent, code agent, research agent. Each has scoped tools and context. The personal agent routes tasks and merges results.
