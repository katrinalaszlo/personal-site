---
title: "n8n Workflow Automation"
description: "Visual workflow automation with code escape hatches. What n8n is, how it compares, core concepts, AI nodes, and when to use it over raw code."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/n8n-automation
---

# n8n Workflow Automation

> Visual workflow builder with code escape hatches. What it is, how it compares to Zapier and Make, core concepts, AI nodes, and when to skip it and write code instead.

## What n8n is

> A source-available workflow automation platform. Think "if this, then that" with branching, loops, custom code, and self-hosting.

n8n (pronounced "nodemation") is a workflow automation tool where you connect nodes on a visual canvas to build automations. Each node represents an action: fetch data from an API, transform JSON, send a Slack message, query a database, call an LLM. You wire them together, and n8n executes the chain.

The distinguishing trait: it is **fair-code licensed** and can run on your own infrastructure. The source code is public on GitHub. You can self-host on a $5/month VPS with unlimited executions, or use their managed cloud. Your data never has to leave your servers.

n8n ships with 1,000+ native integrations (called nodes), plus thousands more built by the community. The **HTTP Request** and **Code** nodes cover cases those integrations miss. If an API exists, you can call it. If the built-in nodes don't do what you need, you drop into JavaScript or Python inline.

> **Mental model:** n8n sits between no-code tools (Zapier) and writing everything from scratch. The canvas gives you speed for the 80% of automation that's just "fetch, transform, route, deliver." The Code node gives you an escape hatch for the 20% that needs real logic.

## How it differs from Zapier and Make

> Compare setup effort, branching, code support, and who operates the service.

| Dimension | Zapier | Make | n8n |
| --- | --- | --- | --- |
| Philosophy | Simplest path for non-technical users | Visual builder with more control than Zapier | Developer-first, visual when useful |
| Integrations | 7,000+ native apps | 2,000+ apps | 1,000+ native, plus HTTP/Code for anything |
| Hosting | Cloud only | Cloud only | Cloud or self-hosted |
| Pricing unit | "Tasks" (each step counts) | "Operations" (each step counts) | "Executions" (entire workflow run = 1) |
| Custom code | Limited (Code by Zapier steps) | Some (custom modules, JavaScript) | Full JavaScript/Python inline at any node |
| AI capabilities | Zapier Agents, Copilot (NL builder) | Maia assistant, Make AI Agents | LangChain integration, AI Agent node, LLM chains, RAG support |
| Data sovereignty | Data on Zapier servers | Data on Make servers | Self-host: data never leaves your infrastructure |

> **The pricing unit matters.** A 20-step workflow that runs 1,000 times costs 20,000 "tasks" on Zapier (each step is a task). On n8n, the same thing costs 1,000 executions (one per run, regardless of steps). For complex workflows, n8n can be 10-20x cheaper. This is the biggest practical difference for anyone building real automations.

Zapier wins on breadth of integrations and speed of setup for simple automations. Make wins on visual complexity at a mid-range price. n8n wins when you need code flexibility, self-hosting, data control, or AI workflows.

## Self-hosted vs. cloud

> The choice is about operations burden vs. cost and control.

### n8n Cloud

Starter
~$24/mo, 2,500 executions
Pro
~$60/mo, 10,000 executions
Business
~$800/mo, SSO, 40,000 executions

Managed infrastructure, automatic updates, zero ops work. No permanent free tier (14-day trial only).

### Self-hosted

License
Free (Community Edition)
Infra
$5-20/mo VPS (Hetzner, DigitalOcean, etc.)
Executions
Unlimited

You own the server. Updates, backups, SSL are on you. Docker Compose is the standard deployment method.

> **Recommendation for developers:** Start self-hosted. A basic Docker Compose setup on a $6/mo VPS gives you unlimited executions and full data control. The setup takes about 30 minutes. Move to cloud only if you need team features (SSO, audit logs) or don't want to maintain a server.

## Core concepts

> Five things to understand before you build anything.

### Nodes

The building blocks. Each node is a function: `items_out = f(items_in, config, credentials)`. A node might call an API, transform data, apply logic, or produce output. n8n ships with three categories:

- **App nodes** connect to specific services (Slack, GitHub, Postgres, Google Sheets).

- **Core nodes** handle infrastructure: HTTP Request, Code, IF, Switch, Merge, Set.

- **Trigger nodes** start a workflow (Webhook, Schedule, app-specific triggers like "new email").

### Triggers

Every workflow starts with a trigger. There are three patterns:

- **Webhook:** the workflow exposes a URL. When something hits it, the workflow runs. Use for incoming events from external services.

- **Schedule:** cron-style. Run every 5 minutes, every Monday at 9am, etc.

- **App trigger:** polls or subscribes to events in a specific service (e.g., "new row in Google Sheet").

### Connections

Wires between nodes on the canvas. Data flows along connections as **items**: an array of JSON objects. Each node receives items, processes them, and passes new items downstream. A node can have multiple outputs (like an IF node that routes to "true" or "false" branches).

### Credentials

Stored authentication for external services. API keys, OAuth tokens, database connection strings. Credentials are encrypted at rest and shared across workflows, so you configure them once and reuse them. Each node type knows which credential type it needs.

### Executions

One execution = one complete run of the workflow, from trigger to end. The execution log shows every node's input/output, making debugging straightforward: click any node in a past execution and see exactly what data flowed through it. Failed executions can be configured to retry automatically.

> **How it fits together:** A trigger fires and produces items. Those items flow through connected nodes, each transforming or routing them. Nodes use credentials to authenticate with external services. The whole run is logged as a single execution. That's it.

## AI and LLM nodes

> n8n has deep LangChain integration. You can build AI agent workflows on the canvas without writing orchestration code.

The AI capabilities break down into three layers:

### Basic LLM Chain

The simplest AI node. Send a prompt to a language model, get a response. Use it for summarization, classification, extraction, rewriting. Supports system messages, output parsing (JSON mode), and chaining multiple calls. This handles most "add AI to this workflow" use cases.

### AI Agent Node

The orchestrator. An autonomous agent that can use tools, maintain memory across turns, and decide which actions to take. You give it a set of tool nodes (HTTP requests, database queries, other sub-workflows), and the agent decides when to call them. This is how you build ReAct-style agents on the canvas.

### LangChain Integration

Under the hood, the AI nodes use LangChain. This means you get access to vector stores, retrieval chains, document loaders, and text splitters as visual nodes. Build RAG pipelines by dragging nodes onto a canvas instead of writing LangChain Python.

**Supported LLM providers:**

- OpenAI (GPT-4o, o1 series), Anthropic (Claude 3 and 4 families), Google Gemini

- Cohere, HuggingFace Inference, Mistral

- Local models via Ollama (run on your own hardware, no API costs)

> **Why this matters:** Most automation platforms bolt AI on as an afterthought (call OpenAI, get text back). n8n treats AI agents as first-class workflow participants with memory, tool use, and decision-making. The difference is the gap between "summarize this text" and "research this topic, decide which sources matter, extract structured data, and file it."

## Common patterns and a practical example

> Recurring shapes that show up in real workflows.

### Pattern 1: Webhook to action

The simplest useful workflow. An external event hits your webhook URL, n8n processes the payload and does something with it. Stripe payment received, form submitted, GitHub PR opened.

**Webhook**incoming event
->
**Transform**extract fields
->
**Action**Slack / DB / email

### Pattern 2: Scheduled sync

Poll a source on a schedule, compare against what you already have, update the delta. Classic ETL shape.

**Schedule**every 15 min
->
**Fetch**API / spreadsheet
->
**Compare**deduplicate
->
**Upsert**database / CRM

### Pattern 3: AI classify and route

Feed incoming data through an LLM to classify it, then branch based on the classification. The classification becomes the input to an IF or Switch node.

**Webhook**support ticket
->
**LLM Chain**classify intent
->
**Switch**route by label
->
**Actions**per category

### Practical example: AI-powered support triage

Here is a concrete workflow you could build in about 20 minutes. A customer submits a support form. n8n classifies it with an LLM, routes it to the right channel, and logs it.

Webhook
->
Set
->
Basic LLM Chain
->
Switch

bug ->
Linear: Create Issue
->
Slack: #eng-bugs

billing ->
Slack: #billing
->
Gmail: Send template

feature ->
Airtable: Add row

other ->
Slack: #support-general

The node breakdown:

- **Webhook** receives the form POST with `email`, `subject`, and `body` fields.

- **Set** extracts and renames fields into a clean shape.

- **Basic LLM Chain** sends the subject + body to Claude or GPT-4 with a system prompt: "Classify this support request as one of: bug, billing, feature, other. Respond with only the label." Output parsing is set to expect a single word.

- **Switch** routes on the LLM output to four branches.

- Each branch performs the right action(s) for that category.

Total nodes: 9. No custom code. The LLM prompt is the only thing that requires tuning. The rest is point-and-click configuration of existing nodes.

## Getting started

> Fastest path from zero to a running workflow.

1

### Run n8n locally

One command: `npx n8n` (requires Node.js 18+). Opens the editor at `localhost:5678`. Good for exploration. For persistent use, run via Docker.

2

### Build a test workflow

Start with Schedule Trigger + HTTP Request + Set. Fetch a public API (weather, HN top stories) every minute. Watch items flow through the canvas. Click each node to inspect its output.

3

### Add branching

Drop an IF node after your HTTP Request. Route based on a condition (temperature > 30, score > 100). Each branch gets its own downstream nodes. The canvas makes it easy to see which branch each item takes.

4

### Connect a real service

Add a Slack or email node. Configure credentials. Send yourself the filtered output. Now you have a real automation running.

5

### Deploy for production

For self-hosted: Docker Compose with n8n + Postgres, behind a reverse proxy (Caddy or nginx) for SSL. For cloud: sign up and import your workflow JSON. Activate the workflow so triggers fire automatically.

```
# Quickstart: run n8n locally
npx n8n

# Or via Docker (persistent, production-ready)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

## n8n vs. writing code

> When a visual workflow is easier to maintain, and when code is a better fit.

| Use n8n when... | Write code when... |
| --- | --- |
| The workflow is "fetch, transform, route, deliver" | You need complex state management across steps |
| You want non-developers to understand and modify flows | You need extensive unit testing and CI coverage |
| You're integrating 3+ services with standard APIs | Performance is critical (sub-100ms processing) |
| The logic is mostly conditional routing, not computation | You need complex data structures (trees, graphs, recursion) |
| You want visual debugging (click a node, see its data) | Version control and code review are non-negotiable |
| You're prototyping and speed matters more than polish | You're building a library or reusable module |

> **The Code node is a crutch, not a solution.** If you find yourself writing 50+ lines of JavaScript in a Code node, stop. That logic belongs in a proper codebase with tests, types, and version control. Call it from n8n via HTTP Request to your own API endpoint. n8n is the orchestrator, not the execution engine.

n8n does support version control via Git integration, and you can export workflows as JSON. But the diff experience is poor: workflow JSON is machine-generated and hard to review line-by-line. If your team's workflow is "PR review every change," n8n will feel awkward. If your workflow is "deploy and iterate," n8n is fast.

> **The right framing:** n8n replaces glue code, not application code. It replaces the 200-line script that polls an API, reformats the data, and posts to Slack. It does not replace your backend service. Use both: n8n for orchestration, your codebase for business logic.
