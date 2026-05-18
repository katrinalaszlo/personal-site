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
  let inCode = false;
  let codeLang = "";
  let codeLines = [];
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
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" loading="lazy">',
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/--/g, "&mdash;");
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```") && !inCode) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
      codeLang = line.slice(3).trim();
      inCode = true;
      codeLines = [];
      continue;
    }
    if (line.startsWith("```") && inCode) {
      const escaped = codeLines
        .join("\n")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      html += `<div class="code-block"><button class="copy-code" data-copy onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)})">Copy</button><pre><code${codeLang ? ` class="language-${codeLang}"` : ""}>${escaped}</code></pre></div>`;
      inCode = false;
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }

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
      "agent-self-serve": "/blog/og/agent-self-serve.png",
      "always-on-ai-memory": "/blog/og/always-on-ai-memory.png",
    };
    ogImage = ogMap[slug] || "/og-image.png";
  }

  // Skip the h1 from body (it's redundant with the title)
  const bodyWithoutH1 = body.replace(/^# .+\n\n?/, "");
  const articleHtml = mdToHtml(bodyWithoutH1);

  const canonicalTag = canonical
    ? `<link rel="canonical" href="${canonical}">`
    : `<link rel="canonical" href="${url}">`;

  const tokenCount = Math.ceil(body.length / 4);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Kat Laszlo</title>
<meta name="description" content="${description}">
<meta name="ai:token-count" content="${tokenCount}">
<meta name="ai:page-type" content="article">
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
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-optimized content">
<link rel="alternate" type="text/markdown" href="/blog/${slug}.md" title="Markdown version">
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
      <div style="display:flex;gap:1.5rem;">
        <a href="/notebook/" class="nav-link">Notebook</a>
        <a href="/blog/" class="nav-link">Blog</a>
        <a href="/#connect" class="nav-link">Connect</a>
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
        <button class="share-btn" data-copy-ai onclick="fetch('/blog/${slug}.md').then(r=>r.text()).then(t=>{navigator.clipboard.writeText(t);this.innerHTML='Copied!'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy for AI
        </button>
        <a class="share-btn" href="/blog/${slug}.md">View source</a>
        <button class="share-btn" onclick="navigator.clipboard.writeText('${url}').then(()=>this.textContent='Copied!')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </button>
        <a class="share-btn" href="#subscribe" onclick="event.preventDefault();document.getElementById('subscribe').scrollIntoView({behavior:'smooth'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </a>
      </div>
    </div>
    ${articleHtml}
  </article>


  <div id="subscribe" class="subscribe-section">
    <h2>Get new posts by email</h2>
    <p>No spam. Unsubscribe anytime.</p>
    <form class="subscribe-form" onsubmit="event.preventDefault();const e=this.querySelector('input');const b=this.querySelector('button');b.disabled=true;b.textContent='...';fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e.value})}).then(r=>r.json()).then(d=>{b.textContent='Subscribed!';e.value='';}).catch(()=>{b.textContent='Try again';b.disabled=false;})">
      <input type="email" placeholder="you@example.com" required>
      <button type="submit">Subscribe</button>
    </form>
  </div>

  <footer>
    <div class="footer-inner">
      <span>Katrina Laszlo, 2026</span>
      <div class="footer-links">
        <a href="https://x.com/Katlaszlo" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        <a href="https://www.linkedin.com/in/katrinalaszlo/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
        <a href="https://github.com/katrinalaszlo" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>
        <a href="mailto:katrina.j.laszlo@gmail.com"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
      </div>
    </div>
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
