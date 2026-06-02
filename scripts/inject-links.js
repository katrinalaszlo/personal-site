#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public");

function inject(filePath, mdHref) {
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (!html.includes('rel="llms-txt"')) {
    html = html.replace(
      "</head>",
      '<link rel="llms-txt" href="/llms.txt">\n</head>',
    );
    changed = true;
  }

  if (mdHref && !html.includes(`href="${mdHref}"`)) {
    html = html.replace(
      "</head>",
      `<link rel="alternate" type="text/markdown" href="${mdHref}" title="Markdown version">\n</head>`,
    );
    changed = true;
  }

  // Add form tool annotations to subscribe forms that don't have them
  if (
    html.includes("subscribe") &&
    html.includes("<form") &&
    !html.includes("tool-name")
  ) {
    html = html.replace(
      /<form([^>]*onsubmit="[^"]*subscribe[^"]*")/g,
      '<form tool-name="subscribe-to-newsletter" tool-description="Subscribe an email address to receive new blog posts"$1',
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log(`  ${path.relative(ROOT, filePath)}`);
  }
}

console.log("Injecting link tags...");

// index.html
inject(path.join(ROOT, "index.html"), "/index.md");

// blog/index.html
inject(path.join(ROOT, "blog", "index.html"), null);

// developers/index.html
inject(path.join(ROOT, "developers", "index.html"), null);

// notebook/index.html
inject(path.join(ROOT, "notebook", "index.html"), null);

// All notebook pages
const notebookDir = path.join(ROOT, "notebook");
fs.readdirSync(notebookDir)
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .forEach((f) => {
    const slug = f.replace(".html", "");
    inject(path.join(notebookDir, f), `/notebook/${slug}.md`);
  });

// All blog post pages (skip index)
const blogDir = path.join(ROOT, "blog");
fs.readdirSync(blogDir)
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .forEach((f) => {
    const slug = f.replace(".html", "");
    inject(path.join(blogDir, f), `/blog/${slug}.md`);
  });

console.log("Done.");
