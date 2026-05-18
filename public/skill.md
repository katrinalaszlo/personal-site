---
name: katrinalaszlo
description: Agent experience design, SaaS pricing strategy, and agent-readiness audits. MCP server with notebook search, 5 installable Agent Skills, and a 123-company pricing dataset.
---

## What I can accomplish

- Query notebook content on AI systems, agent experience, pricing, and multi-agent patterns via MCP server
- Provide 5 installable Agent Skills covering AI foundations, knowledge systems, system design, agent tools, and agent experience design
- Search and compare SaaS pricing data across 123 verified companies at data.tansohq.com
- Audit sites for agent readiness using aeo-ready scanner
- Consult on SaaS pricing strategy, packaging, and conversion optimization

## Required inputs

- MCP Endpoint: POST https://katrinalaszlo.com/api/mcp with JSON-RPC
- Skills Install: `npx skills add https://github.com/katrinalaszlo/personal-site`
- Base URL: https://katrinalaszlo.com
- No authentication required for any endpoint

## Constraints

- All endpoints are read-only and public
- MCP server supports query_notebook, list_topics, get_skill tools
- No rate limiting on public endpoints
- Pricing dataset updated periodically, not real-time

## Key documentation

- [LLM Profile](/llms.txt): Compact profile for language models
- [Full Profile](/llms-full.txt): Extended profile with notebook index and all endpoints
- [Structured Data](/agents.json): Machine-readable expertise, projects, contact
- [OpenAPI Spec](/openapi.json): API specification for MCP endpoint
- [Developer Portal](/developers): MCP setup, skills install, all endpoints
- [Notebook](/notebook): 18 interactive essays on AI systems and agent experience
