#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const NOTEBOOK_DIR = path.join(__dirname, "..", "public", "notebook");

function extractMeta(html) {
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
  const clean = title
    .replace(/ — Notebook — Katrina Laszlo$/, "")
    .replace(/ — Katrina Laszlo$/, "");
  const desc =
    (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || "";
  return { title: clean, description: desc };
}

function htmlToMd(html) {
  const mainMatch = html.match(/<main[\s>]([\s\S]*?)<\/main>/);
  if (!mainMatch) return "";
  let content = mainMatch[1];

  content = content.replace(/<!--[\s\S]*?-->/g, "");
  content = content.replace(/<script[\s\S]*?<\/script>/g, "");
  content = content.replace(/<style[\s\S]*?<\/style>/g, "");

  // Protect examples before stripping layout tags or converting headings.
  const examples = [];
  content = content.replace(
    /<pre\b[^>]*>([\s\S]*?)<\/pre>|<div class="code-block"[^>]*>([\s\S]*?)<\/div>/g,
    (_, pre, block) => {
      const code = (pre ?? block)
        .replace(/<[^>]*>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
      const key = `NOTEBOOK_CODE_${examples.length}_END`;
      examples.push(code.trim());
      return `\n\n${key}\n\n`;
    },
  );
  content = content.replace(
    /<span class="pat-no">([^<]+)<\/span>\s*<h2>([^<]+)<\/h2>/g,
    "<h2>$1: $2</h2>",
  );
  content = content.replace(/<summary[^>]*>([\s\S]*?)<\/summary>/g, "<h3>$1</h3>");
  content = content.replace(/<\/?details[^>]*>/g, "\n");

  // Must run before heading/paragraph conversion: the handler looks for raw <h3>/<p> tags.
  content = content.replace(
    /<div class="principle-item">([\s\S]*?)<\/div>\s*<\/div>/g,
    (match) => {
      const num = (match.match(/principle-num">(\d+)/) || [])[1] || "";
      const title =
        (match.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] ||
        (match.match(/<h4[^>]*>([\s\S]*?)<\/h4>/) || [])[1] ||
        "";
      const desc = (match.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || "";
      return `${num}. **${title.trim()}** ${desc.trim()}\n`;
    },
  );

  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "# $1\n\n");
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "## $1\n\n");
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "### $1\n\n");
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "#### $1\n\n");

  content = content.replace(/<p class="subtitle">([\s\S]*?)<\/p>/g, "> $1\n\n");

  content = content.replace(
    /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => {
      return (
        "```\n" +
        code
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&") +
        "\n```\n\n"
      );
    },
  );
  content = content.replace(/<code>([\s\S]*?)<\/code>/g, "`$1`");

  content = content.replace(/<thead>[\s\S]*?<\/thead>/g, (match) => {
    const cells = [];
    match.replace(/<th\b[^>]*>([\s\S]*?)<\/th>/g, (_, cell) => {
      cells.push(cell.trim());
    });
    if (!cells.length) return "";
    return (
      "| " +
      cells.join(" | ") +
      " |\n| " +
      cells.map(() => "---").join(" | ") +
      " |\n"
    );
  });
  content = content.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, (_, row) => {
    const cells = [];
    row.replace(/<td\b[^>]*>([\s\S]*?)<\/td>/g, (_, cell) => {
      cells.push(cell.trim());
    });
    if (!cells.length) return "";
    return "| " + cells.join(" | ") + " |\n";
  });
  content = content.replace(/<\/?table[^>]*>/g, "\n");
  content = content.replace(/<\/?tbody[^>]*>/g, "");

  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "- $1\n");
  content = content.replace(/<\/?[uo]l[^>]*>/g, "\n");

  content = content.replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**");
  content = content.replace(/<em>([\s\S]*?)<\/em>/g, "*$1*");
  content = content.replace(/<b>([\s\S]*?)<\/b>/g, "**$1**");
  content = content.replace(/<i>([\s\S]*?)<\/i>/g, "*$1*");
  content = content.replace(
    /<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g,
    "[$2]($1)",
  );

  content = content.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g,
    "> $1\n\n",
  );

  content = content.replace(
    /<div class="(analogy|warning|connection|credit)"[^>]*>([\s\S]*?)<\/div>/g,
    "> $2\n\n",
  );

  content = content.replace(/<span class="section-num">[^<]*<\/span>/g, "");

  content = content.replace(
    /<div class="principle-item">([\s\S]*?)<\/div>\s*<\/div>/g,
    (match) => {
      const num = (match.match(/principle-num">(\d+)/) || [])[1] || "";
      const title =
        (match.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] ||
        (match.match(/<h4>([\s\S]*?)<\/h4>/) || [])[1] ||
        "";
      const desc = (match.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || "";
      return `${num}. **${title.trim()}** ${desc.trim()}\n`;
    },
  );

  content = content.replace(
    /<div class="(pillar-card|card|stat-card)"[^>]*>([\s\S]*?)<\/div>/g,
    (_, cls, inner) => {
      return inner + "\n\n";
    },
  );

  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, "$1\n\n");

  content = content.replace(
    /<\/?(?:div|section|span|nav|header|footer|main|article|figure|figcaption|aside|button|form|input|img)[^>]*>/g,
    "",
  );

  content = content.replace(/&amp;/g, "&");
  content = content.replace(/&lt;/g, "<");
  content = content.replace(/&gt;/g, ">");
  content = content.replace(/&mdash;/g, "--");
  content = content.replace(/&ndash;/g, "-");
  content = content.replace(/&rarr;/g, "->");
  content = content.replace(/&middot;/g, ".");
  content = content.replace(/&nbsp;/g, " ");
  content = content.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));

  content = content.split("\n").map((line) => line.trim()).join("\n");
  content = content.replace(/^>\s*\n\s*/gm, "> ");
  content = content.replace(/(\|[^\n]*\|)\n\s*\n(?=\|)/g, "$1\n");
  content = content.replace(/\n{3,}/g, "\n\n");
  content = content.replace(/NOTEBOOK_CODE_(\d+)_END/g, (_, index) => {
    const code = examples[Number(index)];
    const longestFence = Math.max(2, ...(code.match(/`+/g) || []).map((run) => run.length));
    const fence = "`".repeat(longestFence + 1);
    return `${fence}\n${code}\n${fence}`;
  });
  content = content.trim();
  return content;
}

function buildNotebook() {
const htmlFiles = fs
  .readdirSync(NOTEBOOK_DIR)
  .filter((f) => f.endsWith(".html") && f !== "index.html");
console.log(`Converting ${htmlFiles.length} notebook pages...`);

htmlFiles.forEach((file) => {
  const slug = file.replace(".html", "");
  const html = fs.readFileSync(path.join(NOTEBOOK_DIR, file), "utf8");
  const { title, description } = extractMeta(html);
  const body = htmlToMd(html);

  const md = `---
title: "${title}"
description: "${description}"
author: Katrina Laszlo
url: https://katrinalaszlo.com/notebook/${slug}
---

${body}
`;

  fs.writeFileSync(path.join(NOTEBOOK_DIR, `${slug}.md`), md);
  console.log(`  ${slug}.md`);
});

console.log("Done.");

}

if (require.main === module) buildNotebook();
module.exports = { htmlToMd, extractMeta };
