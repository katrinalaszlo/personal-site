---
description: "Write a build-in-public blog post from a repo, notes, and instructions. Generates post, OG image, metadata, and platform distribution copy."
---

# /write-post — Build-in-Public Blog Post

Write a blog post about building something. Takes a repo, notes, and instructions.
Outputs a complete .md file, OG image, metadata, and platform-specific distribution copy.

Inputs: $ARGUMENTS (repo path, topic, or instructions — can also reference note files)

## Phase 1: Gather material

1. If $ARGUMENTS contains a repo path, read it. Otherwise ask what to write about.
2. Read these from the repo (skip what doesn't exist):
   - README.md, CLAUDE.md, CHANGELOG.md
   - Recent git log (last 20 commits with messages)
   - Any files the user specifically mentioned as notes
   - Package.json / pom.xml / pyproject.toml (stack context)
   - Key source files the user points to
3. If the user provided note files, meeting transcripts, or bullet points, read those too.
4. Synthesize into a brief (internal, not shown to user):
   - What was built
   - Key decisions and why
   - What was hard / surprising / wrong
   - What's the lesson for the reader
   - Real numbers, company names, specific tools (anything concrete)

## Phase 2: Write the post

Write a complete blog post as a .md file with YAML frontmatter.

### Voice rules (match Kat's existing posts)

- **Open with the reader's situation.** No preamble, no "In this post I'll..." Start inside
  their problem or decision. "If you're staring at X wondering Y, you're probably right."
- **Fragment chains for emphasis.** Three-beat short sentences. "New labels. New meters. New behaviors."
- **Hinge phrases.** "Here's what I keep coming back to." / "Here's the thing:" /
  "The move is to..." / "The goal is not X. The goal is Y."
- **Credential through specifics.** Name real tools, real companies, real numbers, real roles.
  Never abstract authority. "I built this" not "one might consider."
- **Definitional snaps.** Name bad patterns with a derisive twist. "That's X wearing a Y hat."
- **Bold-lead paragraphs.** `**Concept.**` Then the explanation. Used for lists and section anchors.
- **End by sharpening, not summarizing.** Final line reframes the whole piece in one tight sentence.
- **Tone:** Direct, opinionated, anti-jargon. Speaks from experience, not theory. No hedging.
  No filler. No "I think" — just state it.
- **Never use:** "delve", "crucial", "robust", "comprehensive", "nuanced", "leverage",
  "ecosystem", "paradigm", "synergy", or any AI-slop vocabulary.
- **Never use em dashes.** Use commas, periods, or "..." instead.

### Structure: Build-in-Public

Follow this arc (adapt as needed, not every post needs every section):

1. **The situation** — What you were facing. What problem, what decision, what constraint.
   Open here. The reader should recognize themselves.
2. **What you tried / options you considered** — Show the thinking. Name alternatives.
   Why you ruled things out.
3. **What you built / chose** — The actual thing. Show it. Code snippets, screenshots,
   architecture decisions. Be specific.
4. **What happened** — Results, surprises, failures. Real numbers if you have them.
   "It took 3 days" or "conversion went from X to Y" or "it broke immediately because..."
5. **What you'd do differently / what's next** — Forward-looking. Gives readers a reason to follow.

### Formatting

- Use `##` for major sections, `###` for subsections
- Bold-lead paragraphs for lists of concepts: `**Term.** Explanation...`
- Tables for comparisons (3+ items with multiple dimensions)
- Inline links to sources, tools, companies mentioned
- Keep paragraphs short (2-4 sentences max)
- Use `---` between major sections for visual breathing room

### Illustrations

Create illustrations as HTML using `notebook/notebook.css` components, then screenshot as PNG.
Use these notebook components for illustrations:

- **Sequences/funnels**: `.sequence` with `.seq-step` cards and `.seq-num` numbered circles
- **Comparison tables**: `.contrast-table` with `.tag.green` / `.tag.red` pills
- **Callouts**: `.analogy` (indigo), `.connection` (green), `.warning` (orange) border-left boxes
- **Cards**: `.card` with `.card-grid` for side-by-side layouts
- **Code**: `.code-block` with dark background

Process:
1. Build the illustration as a standalone HTML file linking to `notebook/notebook.css`
2. Set body max-width to 660px with 32px padding
3. Open in `/browse`, measure actual height with `document.body.scrollHeight`
4. Screenshot at full height: `--clip 0,0,660,{height}`
5. Save to `blog/images/{slug}-{name}.png`
6. Embed in markdown as `![alt](/blog/images/{slug}-{name}.png)`

### Frontmatter

```yaml
---
title: "Post title — active voice, opinionated, under 70 chars"
date: YYYY-MM-DD
description: "One sentence that makes someone click. Under 160 chars."
author: Kat Laszlo
---
```

### Quality checks before showing the draft

- No passive voice in the opening paragraph
- At least one named tool, company, or specific number
- No section longer than 5 paragraphs without a visual break (table, list, or `---`)
- Title is opinionated, not descriptive ("Why I killed X" not "Thoughts on X")
- Description would make YOU click if you saw it in a feed
- No AI-slop words (grep the draft)

## Phase 3: Present draft for review

Show the complete draft to the user. Ask: "What do you want to change?"

Apply their feedback in one revision pass. Don't over-explain the changes.

## Phase 4: Finalize and build

After user approves:

1. **Save the .md file** to `blog/{slug}.md`
2. **Generate OG image** — MUST be PNG at `blog/og/{slug}.png` (LinkedIn/Twitter won't render SVG):
   - Build as temporary SVG (1200x630, white bg, 4px indigo #4f46e5 top stripe)
   - Title text wrapped at ~25 chars/line, Inter font, 48px weight 700, fill #0a0a0a
   - "Kat Laszlo" bottom-left, "katrinalaszlo.com" bottom-right, 20px, fill #71717a
   - Convert to PNG: open SVG in `/browse` at 1200x630 viewport and screenshot, or use `npx sharp-cli` / `rsvg-convert`.
   - Delete the temporary SVG after PNG is confirmed. Never ship SVG as the final OG image.
3. **Update build.js ogMap** if needed for the new slug
4. **Run `node blog/build.js`** to generate HTML
5. **Run /publish-post** (the QA skill) to validate metadata, rendering, agent readiness

## Phase 5: Distribution copy

Write ready-to-post copy for each platform. Save it into the repo at
`blog/distro/{slug}.distribution.md` (committed, not /tmp) so it lives alongside the
auto-generated Substack draft and travels with the post.

Note: `build.js` already emits `blog/distro/{slug}.substack.md` (paste-ready Substack
body with canonical-URL instructions) for every non-cross-posted article. You do NOT
write Substack copy here — that's mechanical and handled by the build. Your job in this
phase is the platform copy that needs authoring: the X thread, LinkedIn, and HN.

Put the **X thread first** in the file and format it paste-ready (each tweet as a
numbered block, blank line between), since X is the primary syndication target.

### X / Twitter thread (3-5 tweets)

- Tweet 1: The spiciest insight or most contrarian take. No links. Hook only.
- Tweet 2-3: Supporting evidence, a specific example or number.
- Tweet 4: The "here's what I learned" or "here's what I'd do differently."
- Tweet 5: Link to the post + a one-line CTA. Tag relevant people/tools if appropriate.
- Keep each tweet under 280 chars. No hashtags (they reduce engagement on X).

### LinkedIn (native post)

- Open with a one-line hook (question or bold statement).
- 3-5 short paragraphs telling the story. More narrative than the blog post.
- End with a question to prompt comments.
- Add the link as a COMMENT, not in the post body (algorithm penalizes external links in body).
- No hashtags in the first 3 lines.

### Hacker News (if applicable)

- Title: factual, no clickbait. "Show HN: I built X to solve Y" format.
- First comment: 2-3 paragraphs of honest context. What you built, why, what's interesting technically.
- Only suggest HN if the post has genuine technical depth or a novel approach.

### Timing suggestions

- **X:** Tuesday-Thursday, 8-10am PT or 12-2pm PT
- **LinkedIn:** Tuesday-Thursday, 7-8am or 12pm user's timezone
- **HN:** Tuesday-Thursday, 8-11am ET
- Post to X first (fastest feedback loop), LinkedIn same day, HN the next morning.

Save all distribution copy to `blog/distro/{slug}.distribution.md`.

## Output

After all phases complete, summarize:
- Blog post: `blog/{slug}.md` and `blog/{slug}.html`
- OG image: `blog/og/{slug}.png`
- Substack draft (auto-generated by build.js): `blog/distro/{slug}.substack.md`
- X / LinkedIn / HN copy: `blog/distro/{slug}.distribution.md`
- RSS feed `blog/feed.xml` is regenerated by build.js — no manual edit needed.
- Syndication is paste-ready: paste the Substack draft into Substack (set its canonical
  URL), paste the X thread into X. Site stays canonical; both channels link back.
- Remind user to commit and push when ready.
