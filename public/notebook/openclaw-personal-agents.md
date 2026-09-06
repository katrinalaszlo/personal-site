---
title: "OpenClaw Personal Agents"
description: "What OpenClaw is, how it works, when to use it vs Claude+MCP or Letta."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/openclaw-personal-agents
---

# OpenClaw Personal Agents

> What it is, how it works, when to use it vs. Claude+MCP or Letta. Evaluated from the perspective of a PM who already lives inside Claude Code.

## What OpenClaw actually is

> An open-source personal AI assistant you self-host. It talks to you over the channels you already use.

OpenClaw is a self-hosted agent framework. You run a single Gateway process on your machine (or a server). That gateway connects to messaging channels like WhatsApp, Telegram, Slack, Discord, iMessage, Signal, and a web UI. You talk to your agent wherever you already are. The agent reasons with an LLM of your choice, uses tools to act on the world, and persists memory across sessions.

It runs a personal assistant across messaging channels, with persistent memory and access to tools.

### What it does well

- Multi-channel inbox: one agent, many surfaces

- Model-agnostic: Claude, GPT, Gemini, DeepSeek, local models

- Proactive scheduling via heartbeat and cron

- Skills and tool ecosystem with clear override layers

- Runs on your hardware. Your data stays local.

### What it does not do

- No managed hosting. You run it yourself (or pay a third-party host).

- Memory is LLM-directed, not guaranteed. The model decides what to save.

- Broad permissions surface creates security exposure.

- Not a coding agent. For code, you want Claude Code or Codex.

## Architecture: three layers

> Messaging adapters receive the request, the model decides what to do, and tools carry out the action.

### Channel

Messaging adapters. WhatsApp (Baileys), Telegram (grammY), Slack, Discord, iMessage, Signal, web. Each adapter normalizes input into a standard message object: sender, body, attachments, channel metadata.

### Brain

The LLM. Makes API calls to your chosen provider. Handles multi-step reasoning and task decomposition. Model-agnostic: swap providers without changing your setup.

### Body

Tools and execution. Browser automation, file access, long-term memory, canvas rendering. This layer turns conversation into action.

The Gateway sits at the center as the control plane: it manages sessions, routes messages, loads tools, and orchestrates events. Everything flows through it.

### The agentic loop

Every message triggers the same seven-stage loop:

1

### Normalize

Channel adapter converts platform-specific message into a standard format.

2

### Route

Gateway identifies the session and determines which agent handles the message.

3

### Assemble context

Loads SOUL.md, conversation history, relevant memory, and skill instructions.

4

### Infer

LLM generates a response or decides to use a tool.

5

### ReAct loop

If the model called a tool, execute it, feed results back, let the model reason again. Repeat until the model produces a final response.

6

### Load skills

On-demand skill activation based on the task at hand.

7

### Persist memory

Save relevant facts to MEMORY.md or daily memory files for future sessions.

> **If you use Claude Code:** This loop will feel familiar. Claude Code does something similar (read context, reason, tool-call, iterate). The difference is that OpenClaw wraps this in a persistent gateway serving multiple channels, rather than a terminal session that ends when you close it.

## Core concepts: the workspace files

> OpenClaw is configured with plain Markdown files, not YAML or JSON schemas. You write instructions in English.

The workspace lives at `~/.openclaw/workspace` by default. These are the files that matter:

### SOUL.md

Defines the agent's identity, communication style, values, and boundaries. Injected into the system prompt at the start of every session. Does not control which tools are available (that is handled by `openclaw.json` and MCP config). Controls how the agent uses them.

Five sections: Identity, Communication Style, Values, Boundaries, Example Responses. Keep it under 2,000 words.

### MEMORY.md

Long-term memory. Durable facts, preferences, and decisions. Loaded at session start. The LLM also has access to `memory_search` and `memory_get` tools for retrieval during a session.

Daily notes are auto-generated as separate Markdown files in the `memory/` directory.

### HEARTBEAT.md

Turns the agent from reactive to proactive. A checklist the agent reviews every 30 minutes (configurable). If nothing needs attention, the agent replies `HEARTBEAT_OK` and stays silent.

Use heartbeat for periodic awareness (inbox, calendar, notifications). Use cron for exact-time jobs (daily reports, weekly reviews).

### AGENTS.md

Defines multi-agent configurations. If you run multiple specialized agents (e.g., a research agent and a scheduling agent), this file tells the gateway how to route between them.

> **Memory caveat:** OpenClaw's default memory system does not guarantee persistence. Memory storage and retrieval are LLM-directed, meaning the model decides what to save based on prompts and heuristics. There is no hidden state. If the model does not write a fact to disk, it is gone. Third-party plugins like Mem0 and AgentMemory offer more structured persistence.

## Skills and tools

> Skills are prompt-based capabilities loaded on demand. Tools are executable actions. They are separate layers.

**Tools** are the execution surface: browser automation, file read/write, shell commands, MCP servers. Core tools (read, exec, edit, write) are always available. Additional tools are configured via `openclaw.json` and MCP.

**Skills** are Markdown files (`SKILL.md`) that inject domain-specific instructions when activated. They follow a three-tier override model:

1

### Bundled skills

Ship with the installation. Cover common capabilities.

2

### Local skills ~/.openclaw/skills/

Override or extend bundled defaults for your setup.

3

### Workspace skills highest precedence

Scoped to a specific agent or project. Override everything.

> **Connection to Claude Code:** If you use CLAUDE.md project files and skills, you already know this pattern. OpenClaw's SOUL.md is analogous to CLAUDE.md. OpenClaw skills work like Claude Code skills. The difference is that OpenClaw's skill system is designed for an always-on agent, not a session-based CLI.

## Installation on macOS

> Node 22+, one command, 10 minutes to first message.

### Prerequisites

- macOS 12 Monterey or later (Apple Silicon and Intel both supported)

- Node.js 22 or newer

### One-line installer

```
# Detects OS, installs Node if needed, installs OpenClaw, launches onboarding
curl -fsSL https://get.openclaw.ai | bash
```

### Manual install

```
# If you already have Node 22+
npm install -g openclaw@latest
```

### What happens next

The onboarding wizard walks you through:

- Authentication and gateway settings

- Choosing your LLM provider (Anthropic, OpenAI, OpenRouter, local)

- Connecting your first channel (Telegram and WebChat are easiest to start with)

- Creating your initial SOUL.md

The installer sets up OpenClaw as a background service so the gateway stays running after you close Terminal.

### Key paths

```
~/.openclaw/workspace/           # Workspace root
~/.openclaw/workspace/SOUL.md     # Agent identity
~/.openclaw/workspace/MEMORY.md   # Long-term memory
~/.openclaw/workspace/HEARTBEAT.md# Proactive scheduling
~/.openclaw/workspace/AGENTS.md   # Multi-agent config
~/.openclaw/skills/               # Local skill overrides
```

> **Time to first value:** About 10-15 minutes for the install. Another 10-20 minutes to configure SOUL.md and connect a channel. You will be talking to your agent within 30 minutes.

## OpenClaw vs. Letta vs. custom Claude+MCP

> Three different tools solving different problems. They are not direct substitutes.

OpenClaw packages a personal assistant with multi-channel messaging. Letta (formerly MemGPT) provides a framework for developers building applications with persistent memory. Claude with MCP supplies a model and a protocol for tools; the surrounding application determines how it behaves.

| Dimension | OpenClaw | Letta | Custom Claude+MCP |
| --- | --- | --- | --- |
| What it is | Packaged personal assistant | Stateful agent framework / runtime | LLM + tool protocol (you build the rest) |
| Primary interface | Messaging channels (WhatsApp, Slack, Telegram, web) | API / developer console | Terminal (Claude Code) or API |
| Hosting | Self-hosted (your machine or VPS) | Self-hosted or Letta Cloud | Anthropic-hosted (Managed Agents) or local (Claude Code) |
| Model lock-in | None. Claude, GPT, Gemini, DeepSeek, local. | None. Model-agnostic. | Claude only |
| Memory model | LLM-directed Markdown files + plugins (Mem0, AgentMemory) | OS-inspired tiers: core (RAM), recall (conversation), archival (vector store). Agent manages its own memory via function calls. | Session context + CLAUDE.md. No native cross-session memory beyond file system. |
| Proactive behavior | Yes. Heartbeat (30-min periodic checks) + cron jobs. | Possible via custom scheduling | Not built-in. Requires external orchestration. |
| MCP support | Native | Native | Native (Anthropic built MCP) |
| Setup effort | 30 minutes to working agent | Hours to days (developer-oriented) | Minutes for Claude Code. Days for a custom harness. |
| Best for | Personal assistant across messaging platforms | Building customer-facing apps with persistent agent memory | Coding, analysis, terminal-based workflows |

### Pick OpenClaw when

- You want an always-on assistant across multiple messaging channels

- Model flexibility matters (switching providers without re-architecting)

- You want proactive behavior (monitoring, scheduled tasks)

- You prefer self-hosting and data sovereignty

### Pick Letta when

- You are building an application where agents need structured long-term memory

- You want the agent to explicitly manage its own memory (paging data in and out)

- Your use case is customer-facing, not personal

- You need a framework, not a finished product

### Stick with Claude+MCP when

You are a PM or developer who works primarily in the terminal. Your workflows are code-centric: reading repos, writing features, running tests, analyzing data. Claude Code with MCP servers already gives you tools, context, and session memory scoped to projects.

OpenClaw adds value when you want the same intelligence available on your phone via Telegram, or running tasks while you sleep. If you never need that, Claude Code is simpler and already working.

## Key workflows

> What you actually do with a personal agent once it is running.

### Triage and inbox management

Connect your email, calendar, and Slack. The agent monitors via heartbeat, surfaces what needs attention, and stays quiet otherwise. The HEARTBEAT_OK protocol means it does not spam you with "all clear" messages.

**Example HEARTBEAT.md:** "Check email for anything from investors or customers. Check calendar for meetings in the next 2 hours. If Slack has unread DMs, summarize them. Otherwise, HEARTBEAT_OK."

### Research and synthesis

Send a question via Telegram while away from your desk. The agent uses browser tools and web search to gather information, synthesizes it, and sends back a structured answer. Memory persists, so follow-up questions build on prior context.

This is where multi-channel matters: you can start a research thread on your phone and pick it up on desktop later.

### Scheduled reports and cron jobs

Cron is for exact-time, isolated tasks. "Every Monday at 9am, pull my GitHub notifications and summarize open PRs." "Every evening, check HN for posts about agent frameworks."

Cron tasks run in separate sessions from the main conversation, so they do not pollute your chat history.

### Multi-agent routing

If one agent is not enough, AGENTS.md lets you define specialized agents (research, scheduling, coding) with routing rules. The gateway classifies intent and dispatches to the right specialist. Same pattern as the orchestration layer in [AI System Design](/notebook/ai-system-design.html).

## Security considerations

> Broad permissions are the feature and the risk.

OpenClaw's value comes from deep access: email, calendar, messaging, browser, file system. That same access surface is a security concern.

| Risk | What it means | Mitigation |
| --- | --- | --- |
| Prompt injection | Malicious instructions embedded in emails, messages, or web pages can hijack the agent. | SOUL.md boundaries. Tool policy in openclaw.json. Restrict write tools to specific paths. |
| Credential exposure | API keys and tokens stored in config files on disk. | Environment variables. Never commit openclaw.json to version control. |
| Overprivileged tools | The agent can do anything its tools allow. No granular permission gates by default. | Audit your tool list. Remove tools the agent does not need. Use MCP scoping. |
| Public exposure | If the gateway is reachable from the internet without auth, anyone can talk to your agent. | Run behind a firewall. Use auth tokens on all channel adapters. |

> **The honest assessment:** OpenClaw gives an LLM the keys to your digital life. The architecture does not enforce least-privilege by default. You need to configure boundaries yourself. If you are not comfortable doing that, a session-based tool like Claude Code is safer because it only has access while you are actively using it.

## Decision framework

> Do you actually need a personal agent? Or is a good CLI session enough?

OpenClaw adds value

- You want AI accessible from your phone, not just your terminal

- You need proactive monitoring (inbox triage, calendar alerts, web watching)

- You want one agent identity across multiple platforms

- You switch LLM providers and do not want to rebuild your setup

- You are building a personal knowledge system that the agent maintains

OpenClaw is overhead

- Your work is code-centric and terminal-based (Claude Code is better)

- You only need AI during active work sessions, not 24/7

- You are not comfortable self-hosting and managing a background service

- Your security posture requires explicit permission prompts for every action

- You are building a product, not a personal tool (use Letta or a custom harness)

> **The honest test:** If you already use Claude Code daily and your workflows are project-scoped terminal sessions, OpenClaw mostly adds a messaging layer you may not need. It becomes compelling when you want the agent to do things while you are not at your desk, or when you want non-technical family members to interact with it via a chat app.

> Sources: [OpenClaw Docs](https://docs.openclaw.ai/), [openclaw/openclaw on GitHub](https://github.com/openclaw/openclaw), [freeCodeCamp](https://www.freecodecamp.org/news/how-to-build-and-secure-a-personal-ai-agent-with-openclaw/), [Letta: Agent Memory](https://www.letta.com/blog/agent-memory), [NVIDIA Technical Blog](https://developer.nvidia.com/blog/build-a-secure-always-on-local-ai-agent-with-nvidia-nemoclaw-and-openclaw/).
