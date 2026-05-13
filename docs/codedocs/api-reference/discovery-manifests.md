---
title: "Discovery Manifests"
description: "Reference for the static discovery files that advertise profile data, skills, and the MCP endpoint."
---

This page covers the repository’s public static manifests. They are not JavaScript modules, but they are a major part of the public API because they tell agents where to find the rest of the system.

## `agents.json`

**Path:** [`agents.json`](/workspace/home/personal-site/agents.json)

**Purpose:** structured profile data

**Shape:**

```ts
type AgentsJson = {
  schema_version: string;
  name: string;
  also_known_as: string[];
  description: string;
  interfaces: {
    human: string;
    llm: string;
    structured: string;
  };
  expertise: string[];
  contact: Record<string, string>;
  projects: Array<{
    name: string;
    url: string;
    description: string;
  }>;
};
```

## `.well-known/agent-skills/index.json`

**Path:** [`.well-known/agent-skills/index.json`](/workspace/home/personal-site/.well-known/agent-skills/index.json)

**Purpose:** skill registry and discovery index

**Shape:**

```ts
type SkillIndex = {
  $schema: string;
  skills: Array<{
    name: string;
    type: "skill-md";
    description: string;
    url: string;
    digest: string;
  }>;
};
```

This file is consumed directly by `loadSkills()` in [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js).

## `.well-known/mcp/server-card.json`

**Path:** [`.well-known/mcp/server-card.json`](/workspace/home/personal-site/.well-known/mcp/server-card.json)

**Purpose:** advertise the MCP transport, capabilities, tools, and resources

**Shape:**

```ts
type ServerCard = {
  serverInfo: {
    name: string;
    version: string;
    description: string;
  };
  transport: {
    type: "streamable-http";
    url: string;
  };
  capabilities: {
    resources: boolean;
    tools: boolean;
    prompts: boolean;
  };
  tools: Array<{ name: string; description: string }>;
  resources: Array<{
    uri: string;
    name: string;
    description: string;
    mimeType: string;
  }>;
};
```

## `.well-known/agent-card.json`

**Path:** [`.well-known/agent-card.json`](/workspace/home/personal-site/.well-known/agent-card.json)

**Purpose:** advertise the site as an agent-facing service and consulting surface

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Human-readable identity. |
| `description` | `string` | High-level service description. |
| `url` | `string` | Canonical site URL. |
| `capabilities` | `string[]` | Top-level service capabilities. |
| `skills` | `Array<object>` | Named service skills, separate from Agent Skills files. |
| `contact` | `object` | Booking and email information. |
| `resources` | `object` | Links to profile, structured data, and related resources. |

## `.well-known/ai-plugin.json`

**Path:** [`.well-known/ai-plugin.json`](/workspace/home/personal-site/.well-known/ai-plugin.json)

**Purpose:** expose an AI plugin style manifest

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | `string` | Manifest version. |
| `name_for_human` | `string` | Human-facing display name. |
| `name_for_model` | `string` | Model-oriented identifier. |
| `description_for_human` | `string` | Short human-facing summary. |
| `description_for_model` | `string` | Model-facing integration hint. |
| `auth.type` | `string` | Authentication mode. |
| `api.type` | `string` | API descriptor format. |
| `api.url` | `string` | Structured API URL. |

## `.well-known/api-catalog`

**Path:** [`.well-known/api-catalog`](/workspace/home/personal-site/.well-known/api-catalog)

**Purpose:** publish a linkset that points at profile and service descriptions

The current file exposes:

- `rel: describedby` for `agents.json`
- `rel: service-desc` for `llms.txt`

## `vercel.json`

**Path:** [`vercel.json`](/workspace/home/personal-site/vercel.json)

**Purpose:** attach HTTP `Link` headers so discovery works at the response-header layer too

Example:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Link",
          "value": "</llms.txt>; rel=service-desc, </agents.json>; rel=describedby, </.well-known/ai-plugin.json>; rel=ai-plugin"
        }
      ]
    }
  ]
}
```

## Common Pattern

The intended discovery sequence is:

1. Fetch the site or inspect headers.
2. Read the discovery manifests.
3. Follow links to `llms.txt`, `agents.json`, the skill index, or the MCP server card.
4. Call `/api/mcp` only after discovering the tool surface.

That layered design keeps the site usable even for clients that only support a subset of the published standards.
