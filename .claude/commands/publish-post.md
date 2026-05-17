---
description: "QA a blog post before publishing. Validates metadata, OG image, rendering, agent readiness, links, and visual quality using 4 parallel subagents."
---

# /publish-post — Blog Post Publish QA

Run after writing a new blog post (or updating an existing one). Validates metadata,
rendering, agent readiness, and visual quality. Fixes issues found.

Post to publish: $ARGUMENTS (slug or filename — if blank, detect from recent git changes or newest .md in blog/)

## Phase 1: Detect target post

1. If $ARGUMENTS is provided, use it as the slug (strip `.md`/`.html` if present).
2. Otherwise, check `git diff --name-only` and `git diff --cached --name-only` for `.md` files in `blog/`.
3. Fallback: find the most recently modified `.md` file in `blog/`.
4. Read the `.md` file and parse its frontmatter. Store: slug, title, date, description, author, canonical.
5. If frontmatter is missing required fields (title, date, description), stop and ask the user.

## Phase 2: Parallel subagent swarm (4 lanes)

Launch ALL FOUR agents in a SINGLE message so they run concurrently.

### Lane A — Metadata & OG Image

Check and fix metadata + generate OG image if missing.

1. Verify frontmatter has: title, date, description, author.
2. Check if `blog/og/{slug}.png` exists (or if it's a canonical/Tanso post with an external OG URL).
3. If OG image is missing, generate it as PNG (not SVG — LinkedIn/Twitter won't render SVG OGs):
   a. Create a temporary SVG at `blog/og/{slug}.svg` matching the existing style:
      - 1200x630, white background, 4px indigo (#4f46e5) top stripe
      - Title text wrapped at ~25 chars/line, Inter font, 48px, weight 700, fill #0a0a0a
      - "Kat Laszlo" at bottom-left, "katrinalaszlo.com" at bottom-right, 20px, fill #71717a
      - Use `<tspan>` elements for line wrapping
   b. Convert to PNG using one of: `/browse` screenshot, `npx sharp-cli`, or `rsvg-convert`.
      If no conversion tool available, keep the SVG and flag to the user that it needs manual PNG conversion.
   c. Delete the temporary SVG after PNG is confirmed.
4. Verify `build.js` has the OG image mapped in its `ogMap` objects (update extension from .svg to .png). If not, add the mapping.
5. Check that the og:image meta tag will resolve (relative path for local, absolute URL for Tanso).

### Lane B — Build & Rendering QA

Run the build and verify HTML output quality.

1. Run `node blog/build.js` to regenerate all HTML.
2. Read the generated `blog/{slug}.html`.
3. Check for these known rendering bugs (fix in `build.js` if found):
   - **Bold in tables**: table cells must call `inline()` on cell content. If `<td>` content contains
     raw `**text**`, fix `build.js` to pipe table cell text through the `inline()` function.
   - **Ordered list restart**: if separate `<ol>` blocks each start at 1 when they should be continuous,
     fix `build.js` to not close `<ol>` on blank lines between numbered items.
   - **Dividers**: `---` on its own line should produce `<hr>`, not `&mdash;-` text.
     Fix `build.js` to check for `line.trim() === '---'` BEFORE the inline replacement.
   - **Multi-line blockquotes**: consecutive `> ` lines should merge into one `<blockquote>`.
4. After fixing, re-run `node blog/build.js` and verify the fixes in the output HTML.
5. Grep the generated HTML for any remaining raw `**`, broken `&mdash;-`, or `<ol>` immediately followed by `</ol><ol>`.

### Lane C — Agent Readiness & SEO

Update all discovery/indexing files for the new post.

1. **sitemap.xml**: verify `blog/{slug}` URL is listed. If not, add it with today's date.
2. **llms.txt**: verify the blog post is referenced. If not, add a one-line entry under the blog section.
3. **llms-full.txt**: verify the post content is included. If not, append a section with the post's
   full markdown content (title, description, and body).
4. **blog/feed.xml**: verify the post has an `<item>` entry. If not, add one with title, link, description, pubDate.
5. **blog/index.html**: verify the post appears in the blog listing. If not, add it in date order.
6. **Heading hierarchy**: verify single H1 (the title), logical H2/H3 nesting in the .md source.
7. **Internal links**: check if at least one other page on the site links to this post (blog index counts).
8. **JSON-LD structured data**: verify the generated HTML includes valid Article schema.

### Lane D — Link & Content QA

Validate all links and content quality.

1. Extract all URLs from the .md source (both `[text](url)` links and any raw URLs).
2. For internal links: verify the target file exists.
3. For external links: verify they return 200 (use curl -sI, timeout 5s). Flag any 404s or timeouts.
4. Check for orphaned images: any `![alt](path)` references to files that don't exist.
5. Word count and estimated reading time (word count / 200 wpm). Flag if missing from display.
6. Check for common typos: double spaces, trailing whitespace, unclosed markdown syntax.

## Phase 3: Collect results, fix issues (sequential)

1. Gather all findings from the 4 lanes.
2. Categorize as: BLOCKER (must fix), WARNING (should fix), INFO (nice to know).
3. Fix all BLOCKERs automatically (build.js bugs, missing sitemap entries, missing OG images).
4. Present WARNINGs to user and ask which to fix.
5. Re-run `node blog/build.js` after all fixes.

## Phase 4: Visual QA with browser (sequential, requires /browse or /gstack)

**Dependency**: This phase requires the browse/gstack skill. If unavailable, skip and note in report.

1. Start a local server: `npx serve . -l 3333` (or python3 -m http.server 3333) in the project root.
2. Open `http://localhost:3333/blog/{slug}` in the browser.
3. Take a full-page screenshot as "before" evidence.
4. Verify visually:
   - Bold text renders as bold (not raw `**`)
   - Ordered lists show incrementing numbers (1, 2, 3)
   - `---` dividers render as horizontal rules
   - Tables render with proper formatting
   - Share buttons are visible and positioned correctly
5. Click the "Copy link" button — verify clipboard action works (button text changes to "Copied!").
6. Click "Copy MD" button — verify it works.
7. Check mobile viewport (375px width) — take a screenshot.
8. **Illustration opportunities**: scan the post for sections that would benefit from a diagram,
   spectrum, comparison chart, or visual. Candidates:
   - Lists of 3+ items that form a spectrum or progression
   - Comparisons (X vs Y)
   - Processes or workflows
   - Abstract concepts that could be concrete with a visual
9. For each illustration opportunity:
   a. Create the illustration as clean HTML/CSS (match the site's Inter font, #0a0a0a/#71717a palette).
   b. Render it in the browser at the right width.
   c. Take a screenshot (PNG).
   d. Save the PNG to an appropriate location (e.g., `blog/images/{slug}-{diagram-name}.png`).
   e. Suggest where to embed it in the .md source as `![alt text](/blog/images/...)`.
   f. Present to user for approval before embedding.

## Phase 5: Final report

Output a checklist:

```
## Publish QA Report: {title}

### Metadata
- [ ] Title: {title} ({char count} chars)
- [ ] Description: {description} ({char count} chars)
- [ ] OG image: {path or URL}
- [ ] JSON-LD: valid/missing
- [ ] Canonical: {url or "none"}

### Rendering
- [ ] Bold text: pass/fail
- [ ] Ordered lists: pass/fail
- [ ] Dividers (<hr>): pass/fail
- [ ] Tables: pass/fail
- [ ] Blockquotes: pass/fail

### Agent Readiness
- [ ] sitemap.xml: updated/already current
- [ ] llms.txt: updated/already current
- [ ] llms-full.txt: updated/already current
- [ ] feed.xml: updated/already current
- [ ] blog/index.html: updated/already current

### Links
- [ ] Internal: {count} checked, {count} broken
- [ ] External: {count} checked, {count} broken/timeout

### Content
- [ ] Word count: {n}
- [ ] Reading time: {n} min
- [ ] Heading hierarchy: valid/issues

### Illustrations
- [ ] {n} opportunities identified
- [ ] {n} created and embedded

### Ship readiness: READY / BLOCKED ({reason})
```

Does NOT auto-commit or push. User decides when to commit.
