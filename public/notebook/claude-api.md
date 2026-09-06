---
title: "Claude API"
description: "From Claude Code user to raw API caller. Messages, tools, streaming, and prompt caching."
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/claude-api
---

# Claude API

> From Claude Code user to raw API caller

## Three ways to use Claude

If you use Claude Code every day, you already know what Claude can do. But Claude Code is one of three surfaces. Each talks to the same models through different interfaces, with different tradeoffs.

### Claude.ai / Desktop

The consumer chat interface. You type, Claude responds. Anthropic manages the conversation, context, and billing.

- No code required

- Flat monthly subscription

- No programmatic access

### Claude Code

The agentic coding CLI. It reads your codebase, runs tools, edits files. Under the hood, it makes API calls on your behalf.

- Manages conversation for you

- Tool execution built in

- Pay-per-token (via API key)

### The API

The raw HTTP endpoint. You send JSON, you get JSON back. You control everything: prompts, tools, context, retries.

- Full control over every parameter

- Build any product on top

- Pay-per-token, you manage costs

> **When to use the API directly**
Claude Code is an opinionated wrapper. The API is the raw material. You want the API when you're building a product that uses Claude (a chatbot, a classifier, a data pipeline), when you need precise control over system prompts and tool definitions, or when you want to integrate Claude into an existing application. If you're just coding, Claude Code is better. If you're building something that uses Claude as a component, you want the API.

## Authentication

Everything starts with an API key from the [Anthropic Console](https://console.anthropic.com). The key goes in the `x-api-key` header on every request.

### Raw HTTP

```
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{ "model": "claude-sonnet-4-5-20241022", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello"}] }'
```

### With the SDKs

Both SDKs read `ANTHROPIC_API_KEY` from your environment automatically. You never have to pass the key in code if the env var is set.

```
# Python
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

# Or pass it explicitly
client = anthropic.Anthropic(api_key="sk-ant-...")
```

```
// TypeScript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();  // reads ANTHROPIC_API_KEY from env
```

> **Never commit API keys.**
Use environment variables or a secrets manager. The key has no scope restrictions. Anyone with it can make requests as you, at your cost. Rotate immediately if exposed.

## The Messages endpoint

The API has one core endpoint: `POST /v1/messages`. Every interaction with Claude goes through it. The API is stateless. There is no session, no memory, no conversation ID. You send the full conversation history every time.

### Minimal request

```
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

### Multi-turn conversation

The API doesn't remember anything. You maintain the conversation by appending messages to the array and sending the whole thing back.

```
messages = [
    {"role": "user", "content": "What's the tallest mountain?"},
    {"role": "assistant", "content": "Mount Everest, at 8,849 meters."},
    {"role": "user", "content": "How long does it take to climb it?"}
]

message = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    messages=messages
)
```

### System prompt

The system prompt sets Claude's behavior. It's a top-level parameter, not a message in the array.

```
message = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    system="You are a senior backend engineer. Be concise. Use code examples.",
    messages=[
        {"role": "user", "content": "How do I handle rate limiting in a REST API?"}
    ]
)
```

### The response object

```
# message.model_dump() returns something like:
{
    "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
    "type": "message",
    "role": "assistant",
    "content": [{"type": "text", "text": "The capital of France is Paris."}],
    "model": "claude-sonnet-4-5-20241022",
    "stop_reason": "end_turn",
    "usage": {
        "input_tokens": 14,
        "output_tokens": 10
    }
}
```

Key fields: `content` is always an array (it can contain text blocks and tool-use blocks). `stop_reason` tells you why Claude stopped: `"end_turn"` means it finished, `"max_tokens"` means you hit your limit, `"tool_use"` means it wants to call a tool. `usage` is how you track costs.

## Model Selection

Anthropic maintains three model tiers. Same architecture, different size-speed-cost tradeoffs. Pick the cheapest model that handles your task.

### Opus

$5 / $25 per 1M tokens
1M context
Most capable. Complex reasoning, nuanced writing, multi-step analysis. Use when quality matters most and cost is secondary.

### Sonnet

$3 / $15 per 1M tokens
200K context
Best balance. Strong at coding, analysis, and general tasks. The workhorse for most applications.

### Haiku

$1 / $5 per 1M tokens
200K context
Fastest, cheapest. Classification, extraction, simple Q&A. Use for high-volume, low-complexity tasks.

| Model ID | Tier | Context | Best for |
| --- | --- | --- | --- |
| `claude-opus-4-7-20250506` | Opus | 1M | Hardest problems, agentic tasks |
| `claude-opus-4-6-20250414` | Opus | 1M | Complex reasoning, coding |
| `claude-sonnet-4-5-20241022` | Sonnet | 200K | General-purpose workhorse |
| `claude-haiku-4-5-20250414` | Haiku | 200K | High-volume, low-latency |

> **Practical model selection**
Start with Sonnet. If the output quality isn't sufficient, move up to Opus. If Sonnet is overkill (simple classification, yes/no decisions), move down to Haiku. Most production systems use Sonnet for the main path and Haiku for preprocessing or routing.

## Streaming

By default, the API waits until Claude finishes the entire response before returning. For anything user-facing, you want streaming: tokens arrive as they're generated, so the user sees text appearing in real time.

### Python streaming

```
with client.messages.stream(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain TCP handshake"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# After the stream ends, get the full message
final = stream.get_final_message()
print(f"\n\nTokens used: {final.usage.input_tokens} in, {final.usage.output_tokens} out")
```

### TypeScript streaming

```
const stream = client.messages.stream({
  model: "claude-sonnet-4-5-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain TCP handshake" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}

const final = await stream.finalMessage();
console.log(`\nTokens: ${final.usage.input_tokens} in, ${final.usage.output_tokens} out`);
```

Under the hood, streaming uses Server-Sent Events (SSE). The SDK handles the connection management. Each event has a type: `message_start`, `content_block_start`, `content_block_delta` (the actual tokens), `content_block_stop`, `message_stop`.

> **Always stream for user-facing apps.**
A non-streaming request for a long response can take 10-30 seconds of silence before anything appears. Streaming gives perceived latency under 1 second. The total time is the same, but the user experience is dramatically better.

## Tool Use (Function Calling)

This is how Claude Code works under the hood. You define tools (functions) with names, descriptions, and input schemas. Claude decides when to call them and returns structured arguments. You execute the function and feed the result back.

### The tool-use loop

1

### Define tools + send message

You describe available tools with JSON Schema. Claude sees the descriptions and decides whether to use them.

2

### Claude returns a tool_use block

Instead of (or alongside) text, the response contains a tool call with structured input. `stop_reason` will be `"tool_use"`.

3

### You execute the function

Your code runs the actual function with the provided arguments. This happens on your side, not Anthropic's.

4

### Send the result back

You add the tool result to the messages array and call the API again. Claude uses the result to formulate its final answer.

### Full example: weather tool

```
import anthropic, json

client = anthropic.Anthropic()

# Step 1: Define tools
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name"}
        },
        "required": ["city"]
    }
}]

# Step 2: Send message with tools
response = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Step 3: Check if Claude wants to use a tool
if response.stop_reason == "tool_use":
    tool_block = next(b for b in response.content if b.type == "tool_use")

    # Step 4: Execute the function (your code)
    result = get_weather(tool_block.input["city"])  # your implementation

    # Step 5: Send the result back
    followup = client.messages.create(
        model="claude-sonnet-4-5-20241022",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": json.dumps(result)
            }]}
        ]
    )
    print(followup.content[0].text)
```

The `tool_choice` parameter controls when Claude uses tools:

- `{"type": "auto"}` -- Claude decides (default)

- `{"type": "any"}` -- Claude must call at least one tool

- `{"type": "tool", "name": "get_weather"}` -- force a specific tool

- `{"type": "none"}` -- disable tools for this call

> **This is exactly what Claude Code does.**
Claude Code defines tools like `Read`, `Edit`, `Bash`, and `Write`. When you ask it to fix a bug, it calls the API with those tool definitions. Claude responds with tool_use blocks. Claude Code executes them (reads files, runs commands) and sends results back. The loop continues until Claude stops calling tools. You're building the same loop when you use the API directly.

## Prompt caching

Prompt caching reduces the cost of repeated input. If you send the same system prompt or context on each request, cached reads cost 10% of the normal input price.

### How it works

Mark content blocks with `cache_control` to tell the API to cache them. On subsequent requests with the same prefix, cached tokens are read from cache instead of reprocessed.

```
response = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are a legal assistant specializing in contract review...",  # long system prompt
        "cache_control": {"type": "ephemeral"}  # cache this block
    }],
    messages=[{"role": "user", "content": "Review clause 4.2 of this agreement."}]
)
```

### Cost breakdown

Uncached input
$3.00 / 1M tokens

Cache write (first)
$3.75 / 1M (1.25x)

Cache read (reuse)
$0.30 / 1M (0.1x)

Prices shown for Sonnet. Same ratios apply across all models.

### Cache rules

- Minimum cache lifetime: 5 minutes (standard) or 60 minutes (extended, at 2x write cost)

- Caching works on system prompts, tool definitions, and message content

- Claude reads from the longest previously cached prefix automatically

- Cached content must be at the beginning of the prompt (system prompt, then tools, then early messages)

- Cache read tokens don't count against your input tokens per minute (ITPM) rate limit

> **When caching saves real money**
If your system prompt is 4,000 tokens and you make 1,000 requests/day: without caching, that's 4M input tokens/day just for the system prompt. With caching, the first request costs 1.25x, but the remaining 999 cost 0.1x each. You go from ~$12/day to ~$1.20/day on system prompt alone. The savings grow linearly with request volume and prompt length.

## Extended thinking

Extended thinking lets Claude reason through a problem step by step before responding. The thinking process is visible in the response but billed as output tokens. This improves quality on hard problems: math, logic, multi-step analysis, code architecture.

### Adaptive thinking (current approach)

```
response = client.messages.create(
    model="claude-opus-4-7-20250506",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # max tokens Claude can spend thinking
    },
    messages=[{"role": "user", "content": "Design a rate limiter that handles distributed systems."}]
)

# The response has thinking blocks + text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"Thinking ({len(block.thinking)} chars): {block.thinking[:200]}...")
    elif block.type == "text":
        print(f"Response: {block.text}")
```

On Opus 4.6+ and Sonnet 4.6+, you can also use adaptive thinking, where Claude decides how much to think based on query complexity:

```
response = client.messages.create(
    model="claude-opus-4-7-20250506",
    max_tokens=16000,
    thinking={"type": "adaptive"},  # Claude calibrates thinking depth
    messages=[{"role": "user", "content": "What's 2+2?"}]  # simple query = minimal thinking
)
```

> **Thinking tokens are billed as output tokens.**
A `budget_tokens` of 10,000 on Opus means up to $0.25 in thinking alone per request. For high-volume applications, start with a small budget and increase only if quality needs it. Adaptive thinking helps because Claude won't waste tokens thinking about simple questions.

## Structured output

Two ways to get structured data out of Claude: the `tool` trick, or native structured output.

### The tool trick (works everywhere)

Define a "tool" that's really just a schema. Force Claude to call it. The tool input is your structured data.

```
response = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    tools=[{
        "name": "extract_contact",
        "description": "Extract contact information from text",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "phone": {"type": "string"}
            },
            "required": ["name", "email"]
        }
    }],
    tool_choice={"type": "tool", "name": "extract_contact"},
    messages=[{"role": "user", "content": "John Smith, john@example.com, 555-0123"}]
)

tool_block = response.content[0]
contact = tool_block.input  # {"name": "John Smith", "email": "john@example.com", "phone": "555-0123"}
```

### Native structured output

For newer models, you can use `output_config.format` to get schema-validated JSON directly without the tool workaround.

```
response = client.messages.create(
    model="claude-sonnet-4-5-20241022",
    max_tokens=1024,
    output_config={
        "format": {
            "type": "json",
            "schema": {
                "type": "object",
                "properties": {
                    "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
                    "confidence": {"type": "number"}
                },
                "required": ["sentiment", "confidence"]
            }
        }
    },
    messages=[{"role": "user", "content": "This product is amazing, best purchase I've made!"}]
)
```

## Common patterns

### Pattern 1: Agentic loop

The fundamental pattern behind Claude Code and every AI agent. Keep calling the API until Claude stops requesting tools.

```
def run_agent(user_message, tools, system_prompt):
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5-20241022",
            max_tokens=4096,
            system=system_prompt,
            tools=tools,
            messages=messages
        )

        # Add Claude's response to conversation
        messages.append({"role": "assistant", "content": response.content})

        # If Claude didn't call any tools, we're done
        if response.stop_reason != "tool_use":
            return response

        # Execute each tool call and collect results
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)  # your dispatch
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result)
                })

        # Feed results back
        messages.append({"role": "user", "content": tool_results})
```

### Pattern 2: Classification pipeline

Use Haiku for cheap, fast classification. Force a tool call to guarantee structured output.

```
def classify_ticket(text):
    response = client.messages.create(
        model="claude-haiku-4-5-20250414",   # cheap and fast
        max_tokens=256,
        tools=[{
            "name": "classify",
            "description": "Classify a support ticket",
            "input_schema": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "enum": ["billing", "technical", "account", "other"]},
                    "urgency": {"type": "string", "enum": ["low", "medium", "high"]},
                    "summary": {"type": "string"}
                },
                "required": ["category", "urgency", "summary"]
            }
        }],
        tool_choice={"type": "tool", "name": "classify"},
        messages=[{"role": "user", "content": text}]
    )
    return response.content[0].input
```

### Pattern 3: Batch processing

For non-time-sensitive work (analytics, bulk classification, content generation), the Message Batches API gives 50% cost savings. You submit a batch of requests, and results are available within 24 hours.

```
# Submit a batch
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": f"ticket-{i}",
            "params": {
                "model": "claude-haiku-4-5-20250414",
                "max_tokens": 256,
                "messages": [{"role": "user", "content": ticket}]
            }
        }
        for i, ticket in enumerate(tickets)
    ]
)

# Poll for results
while batch.processing_status != "ended":
    batch = client.messages.batches.retrieve(batch.id)
    time.sleep(60)
```

## Tracking cost

Every API call returns `usage.input_tokens` and `usage.output_tokens`. Track them. A runaway agentic loop or an accidentally large context can burn through budget fast.

### Cost per request (Sonnet, no caching)

| Scenario | Input tokens | Output tokens | Cost |
| --- | --- | --- | --- |
| Simple question | ~100 | ~200 | $0.003 |
| Code review (1 file) | ~2,000 | ~500 | $0.014 |
| Full codebase context | ~50,000 | ~1,000 | $0.165 |
| Agentic loop (10 turns) | ~100,000 | ~10,000 | $0.450 |

### Cost reduction strategies

- **Prompt caching:** up to 90% savings on repeated context (system prompts, tool defs, documents)

- **Batch API:** 50% savings for non-real-time work

- **Model selection:** Haiku is 3x cheaper than Sonnet input, 3x cheaper output

- **Shorter prompts:** Every token in your system prompt is charged on every request (unless cached)

- **Max tokens:** Set `max_tokens` to the minimum you need. Don't default to 4096 for a yes/no question

- **Token counting:** Use `client.messages.count_tokens()` before sending to estimate cost

> **The agentic loop cost trap.**
In an agentic loop, each turn resends the entire conversation. By turn 10, you're sending all previous messages plus all previous tool results plus all previous Claude responses as input. Context grows quadratically. Set a maximum turn count. Summarize or truncate history when it gets long. Use prompt caching so at least the system prompt and tool definitions aren't re-charged at full price.

## SDK installation

### Python

```
pip install anthropic
```

### TypeScript / Node.js

```
npm install @anthropic-ai/sdk
```

Both SDKs are thin wrappers over the HTTP API. They handle authentication, retries, streaming, and type safety. The Python SDK uses Pydantic models. The TypeScript SDK is fully typed.

### TypeScript: full example

```
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20241022",
    max_tokens: 1024,
    system: "You are a helpful coding assistant.",
    messages: [
      { role: "user", content: "Write a TypeScript function to debounce." }
    ],
  });

  if (message.content[0].type === "text") {
    console.log(message.content[0].text);
  }

  console.log(`Cost: ${message.usage.input_tokens} input + ${message.usage.output_tokens} output tokens`);
}

main();
```

## Quick reference

| Parameter | Required | What it does |
| --- | --- | --- |
| `model` | Yes | Which Claude model to use |
| `max_tokens` | Yes | Maximum output tokens (caps cost + length) |
| `messages` | Yes | The conversation history array |
| `system` | No | System prompt (string or content blocks with caching) |
| `tools` | No | Array of tool definitions |
| `tool_choice` | No | Control tool calling (auto, any, specific, none) |
| `stream` | No | Enable SSE streaming (SDKs have `.stream()`) |
| `thinking` | No | Enable extended/adaptive thinking |
| `temperature` | No | Randomness (0.0-1.0, default 1.0) |
| `output_config` | No | Structured output format (JSON schema) |

### Stop reasons

| stop_reason | Meaning | Action |
| --- | --- | --- |
| `end_turn` | Claude finished normally | Read the response |
| `tool_use` | Claude wants to call a tool | Execute tool, send result back |
| `max_tokens` | Hit the output limit | Increase max_tokens or handle truncation |
| `stop_sequence` | Hit a custom stop sequence | Process partial response |

## From Claude Code User to API Builder

Claude Code manages files, tools, and conversation state for you. With the API, your application handles those pieces: send messages, receive text or tool calls, execute the requested tools, and send back their results.

Start with the simplest possible thing: a single `messages.create()` call. Get that working. Then add a system prompt. Then add a tool. Then add streaming. Then add prompt caching. Each layer is independent. You don't need all of them at once.

- **Day 1:** Install SDK, make one API call, print the response

- **Day 2:** Add a system prompt, build a multi-turn conversation loop

- **Day 3:** Define a tool, implement the tool-use loop

- **Day 4:** Add streaming for real-time output

- **Day 5:** Add prompt caching, monitor costs with `usage` fields

The API docs live at [docs.anthropic.com](https://docs.anthropic.com). The Python SDK is on [GitHub](https://github.com/anthropics/anthropic-sdk-python). The TypeScript SDK is at [anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript).
