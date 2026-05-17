---
title: "My Experience Setting Up OpenClaw"
date: 2026-05-16
description: "How I set up an always-on AI assistant that runs on a $6 droplet, posts to Slack while I sleep, and once accidentally replied to someone's WhatsApp message."
author: Kat Laszlo
---

# My Experience Setting Up OpenClaw

I wanted an AI assistant that doesn't forget everything when I close the tab. One that knows my research, runs while I'm offline, and can answer questions from my phone.

I set this up with [OpenClaw](https://github.com/nichochar/openclaw). I named her Claudia. Here's how it actually went.

## The setup experience

OpenClaw has a browser UI, but I found it confusing. I tried a few approaches and the CLI ended up being the fastest path. Most of my configuration happened through Claude Code -- I'd describe what I wanted and it would edit the JSON config directly, SSH into my droplet, validate the schema, restart the gateway. If you're comfortable in a terminal, skip the UI.

The hardest part wasn't the installation. It was the config schema. OpenClaw validates its JSON config strictly, and I kept hitting validation errors for keys that didn't exist in the schema. At one point I had a model routing config that worked perfectly in the gateway but made the CLI refuse to run any commands. Claude Code figured out the routing key wasn't in the schema, moved the config to the right place, and the CLI started working again.

## What I ended up with

Four pieces, connected by git:

**My laptop** -- Claude Code for interactive research, Obsidian for the knowledge vault. Everything starts here.

**A $6/month DigitalOcean droplet** -- runs the OpenClaw Gateway as a systemd service. Pulls my vault from GitHub every 30 minutes so Claudia always has my latest research. Auto-restarts on crash.

**GitHub** -- sync layer. My vault (262 pages of structured research) pushes here and the droplet pulls it.

**Slack channels** -- three private channels, one per agent. They run on the droplet, not my laptop. They work when my laptop is closed.

## The three agents

Each agent has its own private Slack channel. They post scheduled reports and respond when I message them.

**#agent-threat-intel** -- Daily security and market intelligence scan (6 AM ET weekdays). Scans GitHub, Hacker News, security feeds. Reads its own instruction file, checks previous reports for my feedback, and adapts. Weekly summary on Mondays.

**#agent-monetization** -- Daily Observe product report (9 AM PT). Analyzes customer usage patterns, flags churn risks and expansion opportunities.

**#agent-community-research** -- Community pain point scanner (Wednesdays and Saturdays, 7 AM ET). Scans Reddit, HN Show/Ask threads, and GitHub Discussions for recurring problems, workarounds people are building themselves, and tools people are asking for that don't exist yet.

These are interactive. I can reply in any channel and Claudia responds with full context of the conversation. No @mention needed.

## The knowledge vault

The infrastructure is plumbing. The vault is what makes this useful.

It has a simple schema:

- **raw/** -- immutable source documents. Transcripts, papers, screenshots. Never modified.
- **wiki/** -- structured synthesis. Source summaries, entity pages (people, companies), concept pages (ideas, frameworks), and synthesis pages that connect ideas across sources.
- **CLAUDE.md** -- the rules for how to read, write, and cross-reference.

Every time I ingest a new source, the AI reads it, creates a structured summary, updates related pages, checks for contradictions, and logs what it did. After 30+ sessions, the vault contains connections I never would have spotted manually. It compounds instead of accumulating.

## Model routing

Not every question needs the same model. Claudia routes by task type:

| Task | Model | Why |
|---|---|---|
| Summarize, classify, extract, search | Haiku 4.5 | Fast, cheap, no reasoning needed |
| Code, implement, debug, review, chat | Sonnet 4.6 | Balanced speed + quality |
| Analyze, design, architect, plan, strategy | Opus 4.6 | Full reasoning capability |
| Default (unmatched) | Sonnet 4.6 | Safe fallback |

A quick lookup costs almost nothing. A deep analysis session gets the full model. I don't think about which model to use.

## Things that went wrong

**The WhatsApp incident.** Before I moved everything to Slack, Claudia was connected to WhatsApp in self-chat mode. The idea was I'd text myself and she'd respond. But the settings weren't locked down properly, and when someone WhatsApped me, they got a response from Claudia. I had to quickly update the allowlist to restrict it to only my number. Moved to Slack after that -- private channels are easier to control.

**Config validation loops.** I added a model routing config that the gateway accepted but the CLI rejected. Spent a while going back and forth before Claude Code pulled the schema, found that `agents.routing` wasn't a valid key, and removed it. The routing still works through the model definitions -- it just doesn't live where I originally put it.

**TLS for remote access.** The droplet runs on a public IP. OpenClaw's CLI refuses to connect over plaintext `ws://` to non-loopback addresses, which is the right security call. I can't run `openclaw cron list` from my laptop against the remote. Not actually a problem -- I SSH into the droplet when I need to manage it. But it surprised me at first.

## The cost

- **Infrastructure**: $6/month (DigitalOcean droplet). GitHub, OpenClaw, and Obsidian are free.
- **API costs**: The real bill. Opus for strategy, Sonnet for day-to-day, Haiku for lookups. Model routing helps, but a deep analysis session can still be several dollars. I spend roughly what I'd spend on a couple SaaS subscriptions.
- **Time**: One afternoon for infrastructure. Weeks to build a vault worth having -- but that's research I'd be doing anyway.

## What this actually feels like

Monday morning, I open Slack and there are three reports waiting. Threat intel caught a new CVE relevant to my stack. The monetization agent flagged a usage pattern. Community research found three Reddit threads about a problem nobody's solving.

I reply to the threat intel channel asking for more detail on the CVE. Claudia responds with context from previous reports and my vault's security research.

I was on a walk last week and remembered a question about how two researchers define "agent experience" differently. I messaged the channel from my phone. By the time I got home, the answer was there with citations to specific pages in my vault.

That's the difference between AI as a tool and AI as a system. The tool resets. The system compounds.

## If you want to try this

1. **Start with the vault.** Pick a topic you're actively researching. Write a CLAUDE.md with your schema. Ingest 5 sources. Structure matters more than volume.
2. **Set up OpenClaw.** Install it, connect API keys, pair your channels. If the UI is confusing, the config is just JSON. Claude Code can help you edit it directly.
3. **Get a cheap VPS.** Any $6 droplet works. Install OpenClaw, set up systemd, add a cron to pull your vault repo.
4. **Start with one agent.** Don't set up three channels on day one. Get one cron job posting to one channel. Add more when you know what you want.

No vector databases, no embeddings pipeline, no Kubernetes. Just git, a cheap server, and a markdown folder with rules.

---

*I'm researching agent experience -- how software should change when AI agents are the user. More at [katrinalaszlo.com](https://katrinalaszlo.com).*
