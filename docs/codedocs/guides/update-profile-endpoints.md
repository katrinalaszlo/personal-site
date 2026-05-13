---
title: "Update Profile Endpoints"
description: "Keep the homepage, llms files, structured JSON, and discovery manifests aligned when profile data changes."
---

This guide is for the most common maintenance task in the repository: changing profile information without letting the browser-facing page and agent-facing files drift apart.

## Problem

A role, project, expertise area, or contact link changed. The repository stores that information in multiple authored files, so updating just one surface leaves the public contract inconsistent.

## Solution

Treat the profile as a multi-output content update. The homepage, text endpoints, and structured JSON each have a specific role, and each needs a small targeted edit.

<Steps>
<Step>

### Update the primary profile page

Edit [`index.html`](/workspace/home/personal-site/index.html) for the human-facing presentation and [`index.md`](/workspace/home/personal-site/index.md) for the compact markdown version.

```html
<div class="proj-name">observe</div>
<div class="proj-desc">AI cost observability. See which customers and features are unprofitable.</div>
```

Use this step for visual ordering, copy changes, and section-level edits such as experience or projects.

</Step>
<Step>

### Update the text endpoints

Edit [`llms.txt`](/workspace/home/personal-site/llms.txt) and [`llms-full.txt`](/workspace/home/personal-site/llms-full.txt).

```md
## Projects

- observe: AI cost observability.
- buildnext: Evidence wiki for product development.
```

The shorter file is the concise profile. The full file is where this repository also documents notebook topics, architecture, and MCP usage.

</Step>
<Step>

### Update the structured JSON

Edit [`agents.json`](/workspace/home/personal-site/agents.json) so structured clients receive the same information.

```json
{
  "projects": [
    {
      "name": "observe",
      "url": "https://github.com/katrinalaszlo/observe",
      "description": "Open source AI cost observability"
    }
  ]
}
```

This is the authoritative structured surface for `interfaces`, `expertise`, `contact`, and `projects`.

</Step>
<Step>

### Check discovery manifests only if the capability surface changed

If you changed profile copy only, you usually do not need to touch discovery files. If you added or removed a capability such as an MCP resource or a contact route, update the relevant manifest.

```json
{
  "resources": {
    "profile": "https://katrinalaszlo.com/llms.txt",
    "structured": "https://katrinalaszlo.com/agents.json"
  }
}
```

Relevant files include [`.well-known/agent-card.json`](/workspace/home/personal-site/.well-known/agent-card.json), [`.well-known/ai-plugin.json`](/workspace/home/personal-site/.well-known/ai-plugin.json), and [`vercel.json`](/workspace/home/personal-site/vercel.json).

</Step>
<Step>

### Verify the live contract

Fetch all three main surfaces after deployment:

```bash
curl https://katrinalaszlo.com/
curl https://katrinalaszlo.com/llms.txt
curl https://katrinalaszlo.com/agents.json
```

If the change affects discovery, also inspect:

```bash
curl -I https://katrinalaszlo.com/
curl https://katrinalaszlo.com/.well-known/agent-card.json
```

</Step>
</Steps>

## Runnable Checklist

```text
index.html
index.md
llms.txt
llms-full.txt
agents.json
```

That five-file set covers almost every profile edit.

## Practical Notes

- Keep the short and full `llms` files distinct. The longer file is intentionally broader and includes operating guidance.
- Preserve the `interfaces` object in [`agents.json`](/workspace/home/personal-site/agents.json). It documents the site’s multi-surface design directly.
- When you add a new project, update the visible homepage and at least one machine-readable surface in the same commit so agents do not see stale data.
