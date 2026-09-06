---
title: "Hermes Orchestration"
description: "Nous Research's always-on agent framework. What it is, how it works, and where it fits next to Claude Code."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/hermes-orchestration
---

# Hermes Orchestration

> Nous Research's always-on agent framework -- what it is, how it works, and where it fits next to Claude Code

## What is Hermes Agent?

> An open-source autonomous agent that lives on your server, remembers what it learns, and gets more capable the longer it runs.

Hermes Agent is built by [Nous Research](https://nousresearch.com) and released under an MIT license. It launched in February 2026 and became one of the fastest-growing open-source agent projects of the year.

Hermes keeps running after you close the terminal. It accumulates knowledge, builds skills from experience, and runs scheduled tasks unattended. You talk to it from wherever you already are -- CLI, Telegram, Discord, Slack, WhatsApp, Signal, Email, and 20+ other platforms.

> **PM frame:** Claude Code is a contractor you hire per task. Hermes is a full-time employee who lives at the office, remembers every project, and proactively does work while you sleep.

### Key facts

- **License:** MIT (free). You pay only for LLM API usage from your chosen provider.

- **Model flexibility:** Any model -- OpenRouter (200+ models), OpenAI, Nous Portal, NVIDIA NIM, Hugging Face, or your own endpoint. Switch with `hermes model`.

- **Repo:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

- **Docs:** [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

## Five pillars

> Five concepts explain how Hermes stores instructions, remembers context, and runs scheduled work.

Soul
Memory
Skills
Crons
Learning Loop

### SOUL.md -- Identity and personality

SOUL.md is a markdown file that defines who the agent is. It occupies the first slot in the system prompt and sets the frame for everything else. Think of it as the agent's job description and personality profile combined.

1 SOUL.md -- How I behave (personality, communication style)
2 USER.md -- Who I'm talking to (your preferences)
3 AGENTS.md -- What we're working on (project context)
4 MEMORY.md -- What I know from past sessions (facts)
5 Session context -- What you're saying right now

Hermes ships with built-in personalities you can switch using `/personality`. Or write your own SOUL.md from scratch.

> **Claude Code parallel:** SOUL.md maps to your global CLAUDE.md. USER.md maps to MEMORY.md auto-memory. The layering order matters the same way -- identity first, then user preferences, then project context.

### Memory -- Facts that persist across sessions

MEMORY.md is where Hermes writes facts worth keeping: your name, tech stack, standing preferences, context that would be annoying to repeat every session. The agent writes here when it judges something worth persisting -- you do not have to tell it to.

Three memory layers:

- **MEMORY.md** -- Factual context about your environment and projects. Written to disk during the session.

- **Session history** -- Every conversation, stored in a searchable database.

- **Honcho** (optional) -- External service for smarter cross-session recall.

> **Gotcha:** When Hermes writes to MEMORY.md during a session, changes are persisted to disk immediately -- but they do not appear in the system prompt until the next session starts. The agent can "forget" something it just learned if you keep talking in the same session.

### Skills -- On-demand knowledge documents

Skills are structured markdown documents with procedures, pitfalls, and verification steps. After a complex task (typically 5+ tool calls), Hermes can autonomously create a skill. Over time, skills get refined as the agent encounters edge cases.

Progressive disclosure keeps token usage low:

- **Level 0:** Agent sees a list of skill names and descriptions (~3,000 tokens)

- **Level 1:** Full content of a specific skill loaded on demand

- **Level 2:** A specific reference file within a skill

To install a skill, Drop a SKILL.md in `~/.hermes/skills/` and it is live immediately -- no registration needed. Every skill auto-registers as a slash command. You can also search and install community skills: `hermes skills search` and `hermes skills install`.

> **Claude Code parallel:** Hermes skills are equivalent to Claude Code skills (`~/.claude/skills/`), but with two differences: (1) Hermes auto-generates skills from its own work, and (2) skills use progressive disclosure to avoid bloating context.

### Crons -- Scheduled tasks that run unattended

Natural language scheduling. Tell Hermes "every morning at 9am, check Hacker News for AI news and send me a summary on Telegram" and it creates a cron job that runs unattended.

Each cron job runs in a fresh agent session with no chat platform attached. The cron agent gets the toolset configured for the cron platform. Results get delivered to whatever platform you specified.

> **PM frame:** This is the killer feature Claude Code does not have. Claude Code is reactive -- you invoke it. Hermes is proactive -- it does work on a schedule without being asked. Code review every 30 minutes, daily standups, weekly digests.

Example production pattern: connect a GitHub MCP server, schedule a cron job that checks for new PRs every 30 minutes, let Hermes review the diff and create skills from its review patterns. It gets better at catching issues over time.

### Learning Loop -- Self-improvement over time

This is the mechanism that ties the other four pillars together. The loop:

Do task ->
Create skill ->
Retrieve on similar task ->
Refine from experience ->
Nudge to persist ->
Repeat

The nudge mechanism is what makes this different from simple persistent memory. Hermes actively prompts itself to persist knowledge rather than waiting for explicit instruction. Skill accumulation happens automatically rather than requiring manual curation.

> **Reality check:** The companion project `hermes-agent-self-evolution` (which applies DSPy + GEPA to optimize skills and prompts against benchmarks) is experimental. It is not integrated into the main agent and should not be relied on for production workflows. The built-in skill creation and refinement is production-ready; the meta-optimization layer is research.

## Architecture

> How the pieces fit together at runtime.

### Entry Points

hermes (CLI)
hermes --tui
Gateway (messaging)

### Terminal Backends

Local
Docker
SSH
Daytona
Modal
Singularity
Vercel Sandbox

### Storage

SOUL.md / USER.md
MEMORY.md
Skills (*.md)
Session DB
Kanban (SQLite)

### Multi-agent: Kanban board

Hermes ships a Kanban multi-agent system where agents -- each with their own tools, skills, and personality profiles -- claim tasks off a shared board, fan out work through linked dependencies, and pass files via shared workspaces or git worktrees.

Board

SQLite-backed task list

->

Dispatcher
Claims + spawns agents

->

Workers
Execute in parallel

->

Heartbeat
Liveness + zombie detect

The dispatcher runs a long-lived loop (default every 60 seconds) that reclaims stale claims, promotes ready tasks, atomically claims work, and spawns assigned agent profiles. Missed heartbeats trigger reclaim. Zombie detection catches workers that stopped responding.

### Goal planning

`/goal` sets a standing objective and starts the first turn. After each turn, an auxiliary judge model checks whether the goal is done. If not, the agent continues -- up to a 20-turn budget. This is the equivalent of setting a definition of done and letting the agent loop until it ships.

## MCP integration

> Hermes is both an MCP client and an MCP server.

### As MCP Client

Hermes discovers MCP servers at startup and registers their tools into the normal tool registry. Connect it to GitHub, databases, file systems, browser stacks, or internal APIs.

When a server's tools change at runtime, Hermes automatically re-fetches the tool list -- no manual reload needed.

The `allowed_tools` field is the primary security control. Only list the tools the agent actually needs.

### As MCP Server

Hermes can expose itself as an MCP server, letting other MCP-capable agents (Claude Code, Cursor, Codex) use its messaging capabilities -- list conversations, read history, and send messages across connected platforms.

This means you can use Claude Code as your coding agent and Hermes as your communication layer, without switching tools.

> **Practical pattern:** Run Claude Code for coding work. Connect Hermes as an MCP server to Claude Code. Now Claude Code can send you a Telegram message when a long task finishes, check your Slack for context, or post results to Discord -- all through Hermes.

## Getting started

> Install Hermes, choose a model, and try one conversation.

1

### Install

One-line installer handles all dependencies (Python, Node.js, ripgrep, ffmpeg), repo clone, venv, and global `hermes` command.

2

### Choose a model

Run `hermes model` to pick a provider interactively. Accept defaults unless you know why you are changing them.

3

### Start

`hermes` for CLI, `hermes --tui` for the modern terminal UI. Both share sessions, slash commands, and config.

4

### Get one clean conversation working

Then layer on gateway (messaging), cron (scheduling), skills, voice, or routing. Do not configure everything at once.

```
# Linux / macOS / WSL2
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Windows (early beta)
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

> **Note:** Hermes does not support native Windows environments outside the early beta PowerShell installer. WSL2 is the recommended path for Windows users.

## Claude Code vs Hermes vs OpenClaw

> Three different answers to "what should my AI agent do?"

### Claude Code

session-based

- Best-in-class code reasoning

- No persistent memory -- each session starts fresh

- Context managed via CLAUDE.md files

- VS Code, JetBrains, GitHub Actions

- No scheduled tasks, no messaging

- Predictable, consistent behavior

Best for: coding, code review, refactoring, debugging

### Hermes Agent

always-on

- Autonomous memory + self-nudging

- Auto-generates skills from work

- Cron scheduling, goal planning

- 20+ messaging platforms

- Multi-agent Kanban board

- Any LLM provider, no lock-in

Best for: recurring tasks, cross-platform ops, workflows that compound

### OpenClaw

orchestrator

- File-based memory (MEMORY.md + diary)

- Static skills, manually updated

- Cron + messaging integrations

- 50+ messaging integrations

- Largest community skill library

- More mature ecosystem

Best for: daily life automation, broad integration reach

| Dimension | Claude Code | Hermes | OpenClaw |
| --- | --- | --- | --- |
| Memory | None (CLAUDE.md is static config) | Autonomous + self-nudging | File-based, explicit logging |
| Learning | None (by design) | Auto-creates + refines skills | None (manual skill updates) |
| Scheduling | None | Built-in cron, natural language | Built-in cron |
| Coding ability | Best in class | Model-dependent | Model-dependent |
| Multi-agent | Subagents (ephemeral) | Kanban board (durable) | Orchestrator pattern |
| Model lock-in | Claude only | Any provider | Any provider |
| Pricing | Subscription + API | Free (MIT), pay for LLM API | Free (AGPL), pay for LLM API |

> **PM frame:** Claude Code is the best individual contributor on the planet but has no memory and clocks out every night. Hermes is a junior employee who is always on, remembers everything, and gets meaningfully better every week. OpenClaw is the office manager who connects to every system but does not learn on its own. The experienced move is to run Claude Code for coding and Hermes for everything else.

## Key patterns

> How people actually use Hermes in production.

### Automated code review

Connect GitHub MCP server with `allowed_tools` set to `get_file_contents`, `create_issue`, `create_review`. Schedule a cron job that checks for new PRs every 30 minutes. Hermes reviews the diff, creates skills from its review patterns, and improves over time.

### Cross-platform relay

Run Hermes as an MCP server for Claude Code. When Claude Code finishes a long task, it calls Hermes to send you a Telegram message. Hermes becomes the communication layer between your coding agent and your phone.

### Daily intelligence brief

Cron job at 8am: scan Hacker News, relevant subreddits, and competitor feeds. Filter by your interests (stored in MEMORY.md). Deliver a summary to Slack or Email. The agent learns what you click on and refines the filter over time.

### Multi-agent project execution

Use `/goal` to set a standing objective. Break it into Kanban tasks. Hermes dispatches workers to claim tasks in parallel, each with scoped tools and context. You unblock from one view instead of juggling terminals.

## Limitations

> What to know before investing time.

### Honest assessment

- **Token costs at scale.** Gateway (Telegram, Discord) adds 2-3x overhead vs CLI -- 15-20K tokens per message vs 6-8K. Heavy users feel this on the API bill.

- **Memory lag.** MEMORY.md changes are written to disk immediately but do not appear in the system prompt until the next session. Same-session "forgetting" is a real edge case.

- **No web UI.** Community projects are building GUIs, but nothing is merged into main yet. You need comfort with a terminal.

- **Self-evolution is research.** The DSPy/GEPA self-evolution pipeline is experimental and not integrated into the main agent. The built-in skill creation works; the meta-optimization does not ship.

- **Windows support is early beta.** Native Windows is not recommended. Use WSL2.

- **API stability.** Between v0.x releases, breaking changes are expected. Documentation is incomplete, the community is young.

- **Coding quality is model-dependent.** Hermes is a harness, not a model. Its coding output is exactly as good as whatever LLM you connect. If you connect a weaker model, you get weaker code.

### When NOT to use Hermes

- If your work is pure coding and you want the best reasoning model -- use Claude Code.

- If you need enterprise-grade stability and SLAs -- wait for a more mature release.

- If you want zero setup -- Hermes requires CLI comfort, VPS configuration, and API key management.

## The question for a PM

> When does adding Hermes to your stack actually pay off?

For someone already using Claude Code daily, the question is whether persistent, scheduled work and messaging access justify another service to maintain.

**Add Hermes when you have recurring agent work.** Code review on a schedule. Daily digests. Automated triage. Anything where "I wish Claude Code would just do this every morning without me asking" is a thought you have had.

**Add Hermes when you want cross-platform reach.** If you need an agent that lives in Telegram, Slack, and Email simultaneously -- not just in your terminal -- Hermes does this natively.

**Skip Hermes if your work is pure coding sessions.** Claude Code's reasoning on Claude models is materially better than Hermes running the same models through OpenRouter. And Claude Code's session model (no persistent state, deterministic behavior) can suit bounded coding tasks.

> Written May 2026. Based on the Hermes Agent [official documentation](https://hermes-agent.nousresearch.com/docs/) and [GitHub repo](https://github.com/NousResearch/hermes-agent). Stats and adoption figures from secondary sources and should be verified against primary data.
