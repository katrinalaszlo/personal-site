---
title: "Tool Contracts"
description: "Reference for the three public MCP tools: query_notebook, list_topics, and get_skill."
---

This page documents the public tool surface returned by `tools/list` in [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js).

## `query_notebook`

Search the notebook content, skill descriptions, and skill references.

**Definition source:** [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js)

**Signature:**

```ts
type QueryNotebookArgs = {
  query: string;
  topic?:
    | "agent-experience-design"
    | "ai-foundations"
    | "knowledge-systems"
    | "ai-system-design"
    | "agent-tools";
};
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | — | Required search text. The implementation lowercases and splits it on whitespace. |
| `topic` | `string` | `undefined` | Optional skill scope. When present, skill searching is restricted to that one topic. |

### Returns

```ts
type QueryNotebookResult = Array<
  | { type: "skill"; name: string; description: string; score: number }
  | { type: "reference"; skill: string; name: string; content: string; score: number }
  | { type: "page"; name: string; title: string; content: string; score: number }
>;
```

The array is sorted descending by `score` and truncated to five items.

### Example

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "query_notebook",
      "arguments": {
        "query": "mutual legibility",
        "topic": "agent-experience-design"
      }
    }
  }'
```

### Notes

- Notebook page content is stripped from HTML before indexing.
- References are truncated to `2000` characters.
- Search is lexical, not semantic.

## `list_topics`

List every published skill and the reference files attached to it.

**Definition source:** [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js)

**Signature:**

```ts
type ListTopicsArgs = Record<string, never>;
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| none | — | — | This tool accepts an empty object. |

### Returns

```ts
type ListTopicsResult = Array<{
  name: string;
  description: string;
  references: string[];
}>;
```

### Example

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "list_topics",
      "arguments": {}
    }
  }'
```

### Notes

The returned list is derived from the already-loaded skill registry, not from notebook page metadata.

## `get_skill`

Return the full `SKILL.md` content for a specific skill, with optional reference expansion.

**Definition source:** [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js)

**Signature:**

```ts
type GetSkillArgs = {
  skill_name:
    | "agent-experience-design"
    | "ai-foundations"
    | "knowledge-systems"
    | "ai-system-design"
    | "agent-tools";
  include_references?: boolean;
};
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skill_name` | `string` | — | Required published skill name. |
| `include_references` | `boolean` | `false` | When true, appends each reference file under a `## Reference:` heading. |

### Returns

```ts
type GetSkillResult = string;
```

If the skill is missing, the tool returns a plain text message saying `Skill not found: ...`.

### Example

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "get_skill",
      "arguments": {
        "skill_name": "knowledge-systems",
        "include_references": false
      }
    }
  }'
```

## Common Patterns

Query first, then expand:

```ts
// 1. list_topics
// 2. query_notebook({ query: "RAG vs wiki" })
// 3. get_skill({ skill_name: "knowledge-systems", include_references: true })
```

That pattern matches the intent in the tool descriptions: `query_notebook` finds candidates, `list_topics` reveals the available skill namespaces, and `get_skill` pulls the full packaged content once you know which skill you need.
