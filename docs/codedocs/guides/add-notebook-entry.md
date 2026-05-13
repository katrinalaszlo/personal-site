---
title: "Add a Notebook Entry"
description: "Create a new notebook page, wire it into navigation, and make it searchable through the MCP server."
---

This guide shows how to add a new notebook essay in the format this repository already uses: standalone HTML plus shared CSS and shared navigation injection.

## Problem

You want a new essay page to appear in the notebook UI and become searchable through `/api/mcp`, but you do not want to introduce any framework or build tooling.

## Solution

Follow the same file-level workflow the repository already uses. The important detail is that [`api/mcp.js`](/workspace/home/personal-site/api/mcp.js) automatically indexes any `notebook/*.html` file except `index.html`, so once the page exists it becomes searchable without extra backend code.

<Steps>
<Step>

### Create the HTML page

Add a new file such as [`notebook/your-topic.html`](/workspace/home/personal-site/notebook/agent-readable-sites.html) using an existing page as the template.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Topic — Notebook — Katrina Laszlo</title>
  <meta name="description" content="One-sentence summary of the note.">
  <link rel="stylesheet" href="notebook.css">
</head>
<body>
  <main>
    <h1>Your Topic</h1>
    <p class="subtitle">Short subtitle for the note.</p>
    <section>
      <h2>Part 1</h2>
      <p>Write the content in plain HTML.</p>
    </section>
  </main>
  <script src="nav.js"></script>
</body>
</html>
```

</Step>
<Step>

### Add the page to the shared navigation

Update [`notebook/nav.js`](/workspace/home/personal-site/notebook/nav.js) by inserting the new page under the correct `sections` entry.

```js
{
  label: "Agent Experience",
  items: [
    {
      title: "Your Topic",
      href: "/notebook/your-topic.html"
    }
  ]
}
```

`nav.js` flattens all section items into a `topics` array, so adding the entry here also enables previous and next links automatically.

</Step>
<Step>

### Add the landing card

Update [`notebook/index.html`](/workspace/home/personal-site/notebook/index.html) so the new page appears in the notebook listing.

```html
<a href="/notebook/your-topic.html" class="entry">
  <div class="entry-accent" style="background:#0d9488"></div>
  <div class="entry-body">
    <div class="entry-title"><span class="entry-num">14</span>Your Topic</div>
    <div class="entry-desc">One-line explanation of what the page covers.</div>
    <div class="entry-meta">
      <div class="entry-tags">
        <span class="tag">agents</span>
        <span class="tag">ux</span>
      </div>
      <span class="entry-date">May 13, 2026</span>
    </div>
  </div>
  <div class="entry-arrow">&rarr;</div>
</a>
```

</Step>
<Step>

### Verify MCP search picks it up

Because `loadNotebookPages()` reads every notebook HTML file on disk, the new page becomes queryable automatically after deployment.

```bash
curl -X POST https://katrinalaszlo.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "tools/call",
    "params": {
      "name": "query_notebook",
      "arguments": {
        "query": "your topic keyword"
      }
    }
  }'
```

</Step>
</Steps>

## Complete Pattern

```text
notebook/
  your-topic.html
  index.html
  nav.js
  notebook.css
```

That is the full surface you normally touch. There is no content registry for notebook pages beyond the navigation file and index page.

## Real-World Notes

- Use [`notebook.css`](/workspace/home/personal-site/notebook/notebook.css) classes such as `.card`, `.analogy`, `.connection`, `.warning`, and `.contrast-table` so the page matches the rest of the notebook.
- Keep the `<script src="nav.js"></script>` line at the bottom of the page. Without it, the page still renders, but the shared navigation and prev/next controls do not appear.
- If you change a file name after linking it in [`notebook/nav.js`](/workspace/home/personal-site/notebook/nav.js), update both the nav entry and the notebook landing page card.
