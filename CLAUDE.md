# Personal Site — katrinalaszlo.com

Static site hosted on Vercel. No build step — push to GitHub and it deploys.

## Architecture

Pure HTML/CSS/JS. No framework, no dependencies, no build tool.

```
index.html          # Homepage
notebook/           # Learning notebook — deployed
sitemap.xml         # SEO sitemap
llms.txt            # LLM-readable profile
agents.json         # Machine-readable capabilities manifest
robots.txt          # Crawler permissions
og-image.png        # Open Graph image
```

## Blog

Posts live in `blog/` as `.md` files with YAML frontmatter (title, date, description, author).
`blog/build.js` converts them to static HTML. Run `node blog/build.js` after any post changes.

- **OG images**: `blog/og/{slug}.png` — 1200x630, white bg, indigo stripe, title + author
- **Styles**: `blog/post.css` — shared across all posts
- **Index**: `blog/index.html` — blog listing page
- **Feed**: `blog/feed.xml` — RSS feed

After publishing a new post, run `/publish-post` to QA metadata, rendering, agent readiness,
and visual quality. The skill runs 4 parallel subagents and produces a ship-readiness report.

## What NOT to change

- `og-image.png` — only update if branding changes
- `robots.txt` — already allows all AI crawlers
- `.vercel/` — managed by Vercel, don't touch
