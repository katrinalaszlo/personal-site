# Personal Site — katrinalaszlo.com

Static site hosted on Vercel. No build step — push to GitHub and it deploys.

## Architecture

Pure HTML/CSS/JS. No framework, no dependencies, no build tool.

```
index.html          # Homepage
notebook/           # Private — gitignored, not deployed
sitemap.xml         # SEO sitemap
llms.txt            # LLM-readable profile
agents.json         # Machine-readable capabilities manifest
robots.txt          # Crawler permissions
og-image.png        # Open Graph image
```

## What NOT to change

- `og-image.png` — only update if branding changes
- `robots.txt` — already allows all AI crawlers
- `.vercel/` — managed by Vercel, don't touch
