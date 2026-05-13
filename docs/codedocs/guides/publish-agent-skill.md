---
title: "Publish a New Agent Skill"
description: "Create a new skill directory, register it in the discovery index, and expose it through the MCP server."
---

This guide covers the full workflow for publishing a new Agent Skill in the format this repository expects.

## Problem

You have a new topic that should be installable as a skill and queryable through `/api/mcp`, but the skill must be published in a way that existing clients can discover.

## Solution

Create the skill directory, write `SKILL.md`, optionally add references, and then register the skill in [`.well-known/agent-skills/index.json`](/workspace/home/personal-site/.well-known/agent-skills/index.json). The index entry is what makes the skill public.

<Steps>
<Step>

### Create the directory

Add a new folder under [`.well-known/agent-skills/`](/workspace/home/personal-site/.well-known/agent-skills/index.json).

```text
.well-known/agent-skills/my-new-skill/
  SKILL.md
  references/
    deep-dive.md
```

</Step>
<Step>

### Write `SKILL.md`

Follow the frontmatter and trigger-oriented structure used by the existing skills.

```md
---
name: my-new-skill
description: >-
  Explain the exact situations where this skill should be used.
metadata:
  author: Katrina Laszlo
  version: "1.0.0"
---

# My New Skill

## When to use this skill

- Specific trigger one
- Specific trigger two

## Core framework

Document the model, checklist, or process the skill teaches.
```

</Step>
<Step>

### Register the skill in `index.json`

Add an object to [`.well-known/agent-skills/index.json`](/workspace/home/personal-site/.well-known/agent-skills/index.json).

```json
{
  "name": "my-new-skill",
  "type": "skill-md",
  "description": "Short public description for discovery and search.",
  "url": "/.well-known/agent-skills/my-new-skill/SKILL.md",
  "digest": "sha256:replace-with-real-digest"
}
```

`loadSkills()` only iterates over `index.skills`, so this step is mandatory.

</Step>
<Step>

### Add optional references

Reference files are loaded automatically when they sit under `references/` and end in `.md`.

```md
# Deep Dive

Longer examples, comparisons, or background material that would make the main skill too heavy.
```

</Step>
<Step>

### Verify the public surface

Check both the static discovery file and the MCP tool layer.

```bash
curl https://katrinalaszlo.com/.well-known/agent-skills/index.json
```

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 10,
    "method": "tools/call",
    "params": {
      "name": "get_skill",
      "arguments": {
        "skill_name": "my-new-skill",
        "include_references": true
      }
    }
  }'
```

</Step>
</Steps>

## Complete Runnable Example

```text
.well-known/agent-skills/my-new-skill/SKILL.md
.well-known/agent-skills/my-new-skill/references/deep-dive.md
.well-known/agent-skills/index.json
```

That file set is enough for:

- skill installation from GitHub
- `list_topics` discovery
- `get_skill` retrieval
- `query_notebook` skill matching

## Practical Notes

- Keep the `name` in `SKILL.md`, the directory name, and the `index.json` entry aligned. `get_skill` keys lookups by the registry name.
- Use concise descriptions in `index.json`. Those strings are part of the search corpus.
- If you do not need deep reference content, omit the `references/` directory entirely. `loadSkills()` already treats it as optional.
