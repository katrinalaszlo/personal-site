#!/usr/bin/env node
// blog/build.js — generates HTML post pages from .md files
// Run: node blog/build.js (from personal-site root)
// No dependencies required (uses built-in node modules only)

const fs = require("fs");
const path = require("path");

const BLOG_DIR = __dirname;
const POST_CSS = "/blog/post.css";

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length)
      meta[key.trim()] = rest
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2].trim() };
}

function mdToHtml(md) {
  let html = "";
  const lines = md.split("\n");
  let inList = false;
  let inOl = false;
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (!tableRows.length) return "";
    const header = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    let t = "<table><thead><tr>";
    header
      .split("|")
      .filter((c) => c.trim())
      .forEach((c) => {
        t += `<th>${inline(c.trim())}</th>`;
      });
    t += "</tr></thead><tbody>";
    body.forEach((row) => {
      t += "<tr>";
      row
        .split("|")
        .filter((c) => c.trim())
        .forEach((c) => {
          t += `<td>${inline(c.trim())}</td>`;
        });
      t += "</tr>";
    });
    t += "</tbody></table>";
    tableRows = [];
    return t;
  }

  function inline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/--/g, "&mdash;");
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^\|.*\|/)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      html += flushTable();
      inTable = false;
    }

    if (line.trim() === "---") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
      html += "<hr>";
    } else if (line.startsWith("# ")) {
      html += `<h1>${inline(line.slice(2))}</h1>`;
    } else if (line.startsWith("## ")) {
      html += `<h2>${inline(line.slice(3))}</h2>`;
    } else if (line.startsWith("### ")) {
      html += `<h3>${inline(line.slice(4))}</h3>`;
    } else if (line.startsWith("> ")) {
      html += `<blockquote><p>${inline(line.slice(2))}</p></blockquote>`;
    } else if (line.match(/^- /)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(line.slice(2))}</li>`;
    } else if (line.match(/^\d+\. /)) {
      if (!inOl) {
        html += "<ol>";
        inOl = true;
      }
      html += `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`;
    } else if (line.trim() === "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inOl) {
        const next = lines.slice(i + 1).find((l) => l.trim() !== "");
        if (!next || (!next.match(/^\d+\. /) && !next.match(/^ {2,}/))) {
          html += "</ol>";
          inOl = false;
        }
      }
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inOl && line.match(/^ {2,}/)) {
        html = html.replace(/<\/li>$/, ` ${inline(line.trim())}</li>`);
      } else {
        if (inOl) {
          html += "</ol>";
          inOl = false;
        }
        html += `<p>${inline(line)}</p>`;
      }
    }
  }
  if (inList) html += "</ul>";
  if (inOl) html += "</ol>";
  if (inTable) html += flushTable();
  return html;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildPost(mdFile) {
  const slug = path.basename(mdFile, ".md");
  const content = fs.readFileSync(path.join(BLOG_DIR, mdFile), "utf8");
  const { meta, body } = parseFrontmatter(content);

  const title = meta.title || slug;
  const date = meta.date || "2026-01-01";
  const description = meta.description || "";
  const author = meta.author || "Kat Laszlo";
  const canonical = meta.canonical || "";
  const url = `https://katrinalaszlo.com/blog/${slug}`;

  // Determine OG image
  let ogImage;
  if (canonical) {
    // Tanso posts use original OG images
    const ogMap = {
      "ai-pricing-differences":
        "https://www.tansohq.com/images/blog-pricing-decisions-og.png",
      "pricing-infrastructure-complexity":
        "https://www.tansohq.com/images/blog-pricing-infrastructure-og.png",
      "pricing-moat-ai-saas":
        "https://www.tansohq.com/images/blog-pricing-moat-og.png",
      "more-customers-bigger-losses":
        "https://www.tansohq.com/images/blog-ai-costs-black-box-og.png",
      "is-outcome-based-pricing-real":
        "https://www.tansohq.com/images/blog-outcome-pricing-og.png",
      "ai-included": "https://www.tansohq.com/images/blog-bundled-ai-og.png",
    };
    ogImage = ogMap[slug] || `https://katrinalaszlo.com/blog/og/${slug}.svg`;
  } else {
    const ogMap = {
      "rethinking-pricing-because-of-ai": "/blog/og/rethinking-pricing.svg",
      "product-discovery-with-llm-wiki": "/blog/og/product-discovery.svg",
      "building-a-pricing-database": "/blog/og/pricing-database.svg",
    };
    ogImage = ogMap[slug] || "/og-image.png";
  }

  // Skip the h1 from body (it's redundant with the title)
  const bodyWithoutH1 = body.replace(/^# .+\n\n?/, "");
  const articleHtml = mdToHtml(bodyWithoutH1);

  const canonicalTag = canonical
    ? `<link rel="canonical" href="${canonical}">`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Kat Laszlo</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${date}">
<meta property="article:author" content="${author}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@Katlaszlo">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">
<link rel="alternate" type="application/rss+xml" title="Kat Laszlo's Blog" href="/blog/feed.xml">
${canonicalTag}
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='white'/><text x='50' y='50' font-size='70' font-weight='600' text-anchor='middle' dominant-baseline='central'>K</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/blog/post.css">
<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: ogImage,
    author: {
      "@type": "Person",
      name: author,
      url: "https://katrinalaszlo.com",
    },
    datePublished: date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  },
  null,
  2,
)}
</script>
</head>
<body>
<div class="container">
  <header>
    <nav>
      <a href="/" class="nav-name">Katrina Laszlo</a>
      <div class="nav-links">
        <a href="/notebook/" class="nav-link">Notebook</a>
        <a href="/blog/" class="nav-link">Blog</a>
      </div>
    </nav>
  </header>

  <article>
    <h1>${title}</h1>
    <div class="post-meta-row">
      <p class="post-meta">
        <a href="/">${author}</a> &middot; ${formatDate(date)}
      </p>
      <div class="share-bar share-bar-top">
        <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <button class="share-btn" onclick="navigator.clipboard.writeText('${url}').then(()=>this.textContent='Copied!')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </button>
      </div>
    </div>
    ${articleHtml}
  </article>

  <div class="share-bar">
    <span>Share:</span>
    <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Post
    </a>
    <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      Share
    </a>
    <button class="share-btn" onclick="navigator.clipboard.writeText('${url}').then(()=>this.textContent='Copied!')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
      Copy link
    </button>
    <button class="share-btn" onclick="fetch('/blog/${slug}.md').then(r=>r.text()).then(t=>{navigator.clipboard.writeText(t);this.textContent='Copied!'})">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Copy MD
    </button>
  </div>

  <footer>
    <a href="https://x.com/Katlaszlo">X</a>
    <a href="https://www.linkedin.com/in/katrinalaszlo/">LinkedIn</a>
    <a href="https://github.com/katrinalaszlo">GitHub</a>
    <a href="/blog/feed.xml">RSS</a>
  </footer>
</div>
</body>
</html>`;

  const outPath = path.join(BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`  ${slug}.html`);
}

// Find all .md files (exclude build.js, feed.xml, index.html, etc.)
const mdFiles = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md") && f !== "README.md");

console.log(`Building ${mdFiles.length} posts...`);
mdFiles.forEach(buildPost);
console.log("Done.");
