---
title: "MCP Endpoint"
description: "Reference for the exported Vercel handler, supported JSON-RPC methods, request validation, and lifecycle behavior."
---

This page documents the only exported runtime module in the repository: [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js).

## Module

**Path:** `api/mcp.js`

**Runtime signature:**

```ts
const handler: (req: VercelRequest, res: VercelResponse) => Promise<void>;
module.exports = handler;
```

The handler expects JSON-RPC requests over HTTP `POST` and is written for a Vercel-style serverless environment.

## Constructor or Initialization

There is no class or constructor. Initialization is protocol-level and happens through the JSON-RPC `initialize` method.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize"
}
```

### Supported methods

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `initialize` | none | server info object | Negotiates protocol version and capabilities. |
| `tools/list` | none | tool list | Returns `query_notebook`, `list_topics`, and `get_skill`. |
| `tools/call` | `name`, `arguments` | tool-specific text content | Dispatches to one of the supported tools. |
| `notifications/initialized` | none | empty result | Acknowledges client readiness. |

## Request Handling Behavior

### HTTP constraints

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| HTTP method | `POST` | — | Any non-`POST` method returns `405` with `{ "error": "POST only" }`. |
| `OPTIONS` preflight | `OPTIONS` | — | Returns `200` with no body. |
| `Content-Type` | JSON body | — | The handler expects `req.body` to already be parsed into an object. |

### CORS headers

The handler always sets:

```ts
Access-Control-Allow-Origin: "*"
Access-Control-Allow-Methods: "POST, OPTIONS"
Access-Control-Allow-Headers: "Content-Type, Authorization"
```

### Validation

If `req.body` is missing or `req.body.method` is absent, the handler returns:

```json
{ "error": "Invalid JSON-RPC request" }
```

That check happens before any method dispatch.

## Response Types

### `initialize`

```ts
type InitializeResult = {
  protocolVersion: "2024-11-05";
  serverInfo: {
    name: "katrinalaszlo-notebook";
    version: "1.0.0";
  };
  capabilities: {
    tools: {
      listChanged: false;
    };
  };
};
```

Example:

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}'
```

### `tools/list`

Returns a `tools` array whose entries include `name`, `description`, and `inputSchema`.

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

### `tools/call`

Request signature:

```ts
type ToolsCallRequest = {
  jsonrpc: "2.0";
  id: string | number;
  method: "tools/call";
  params: {
    name: "query_notebook" | "list_topics" | "get_skill";
    arguments?: Record<string, unknown>;
  };
};
```

Example:

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "list_topics",
      "arguments": {}
    }
  }'
```

## Errors

| Condition | Code | Response |
|-----------|------|----------|
| Non-POST request | HTTP `405` | `{ "error": "POST only" }` |
| Missing JSON-RPC method | HTTP `400` | `{ "error": "Invalid JSON-RPC request" }` |
| Unknown JSON-RPC method | JSON-RPC `-32601` | `Method not found: ...` |
| Unknown tool name | JSON-RPC `-32601` | `Unknown tool: ...` |

## Source Notes

The dispatch logic is a direct `switch (body.method)` in [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js). There is no middleware stack, router abstraction, or schema library. That makes the endpoint easy to inspect, but it also means every new method or validation rule must be hand-coded.
