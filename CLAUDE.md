# Personal Site — katrinalaszlo.com

Static site hosted on Vercel. No build step — push to GitHub and it deploys.

## Architecture

Pure HTML/CSS/JS. No framework, no dependencies, no build tool.

```
index.html          # Homepage
notebook/           # Interactive learning pages
  index.html        # Notebook listing page
  nav.js            # Sidebar navigation (auto-injected on all notebook pages)
  *.html            # Individual notebook articles
sitemap.xml         # SEO sitemap
llms.txt            # LLM-readable profile
agents.json         # Machine-readable capabilities manifest
robots.txt          # Crawler permissions
og-image.png        # Open Graph image
```

## Deploy checklist

When notebook pages are added, removed, or renamed, these files must all stay in sync:

1. **`notebook/index.html`** — add/remove entry card with title, description, tags, accent color
2. **`sitemap.xml`** — add/remove `<url>` entry for the page
3. **`llms.txt`** — update the notebook section with title + URL
4. **`agents.json`** — update `notebook.entries` array with title + URL
5. **`notebook/nav.js`** — update the topics array if the page should appear in the sidebar

When any page content changes significantly:
- Update the description in `notebook/index.html` entry card
- Update the description in `llms.txt` if it's listed there

## Style conventions

All notebook pages use the same design system:

- Font: Inter (system fallback stack)
- CSS variables: `--accent: #4f46e5`, `--bg: #ffffff`, `--text: #1a1a1a`, `--bg-inset: #f4f4f5`, `--border: #e4e4e7`
- Max-width: 900px
- Components: `.card`, `.analogy`, `.connection`, `.warning`, `.contrast-table`, `.tag`, `.sequence`
- Nav: header with "Katrina Laszlo" left, "Notebook" + "Connect" right
- Breadcrumb bar with prev/next links
- All CSS inline in each HTML file (no shared stylesheet)

## Notebook page template

New pages must include:
- Header nav (same as other pages)
- Breadcrumb with prev/next links
- `<main>` with sections
- Credit block at bottom linking to related pages
- Same CSS variable block as other notebook pages

## What NOT to change

- `og-image.png` — only update if branding changes
- `robots.txt` — already allows all AI crawlers
- `.vercel/` — managed by Vercel, don't touch
