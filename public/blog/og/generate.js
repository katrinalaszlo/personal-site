const { chromium } = require("/opt/homebrew/lib/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const posts = [
  { slug: "agent-self-serve", title: "Your Next Customer Might Be an Agent" },
  {
    slug: "ai-included",
    title: "The 'AI Included' Era Was Never Going to Last Forever",
  },
  {
    slug: "ai-pricing-differences",
    title: "What's Actually Different About AI Pricing",
  },
  { slug: "building-a-pricing-database", title: "Building a Pricing Database" },
  {
    slug: "is-outcome-based-pricing-real",
    title: "Is Outcome-Based Pricing Real, or Just Marketing Hype?",
  },
  {
    slug: "more-customers-bigger-losses",
    title: "When More Customers Mean Bigger Losses",
  },
  { slug: "onboarding-agents", title: "Onboarding Agents" },
  {
    slug: "pricing-infrastructure-complexity",
    title: "Why Pricing Infrastructure Gets Hard Fast for AI Startups",
  },
  { slug: "pricing-moat-ai-saas", title: "Pricing Is a Real Moat in AI SaaS" },
  {
    slug: "product-discovery-with-llm-wiki",
    title: "Product Discovery with Karpathy's LLM Wiki",
  },
  {
    slug: "rethinking-pricing-because-of-ai",
    title: "If You're Rethinking Your Pricing Because of AI, Read This First",
  },
  { slug: "site-ready-for-ai", title: "Is Your Site Ready for Agents?" },
];

function makeHTML(title) {
  const len = title.length;
  const fontSize = len < 25 ? "72px" : len < 45 ? "56px" : "44px";

  return `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    h1 {
      font-size: ${fontSize};
      font-weight: 700;
      color: #111827;
      text-align: center;
      line-height: 1.2;
      max-width: 900px;
      padding: 0 80px;
    }
  </style>
</head>
<body>
  <h1>${title.replace(/'/g, "&#39;")}</h1>
</body>
</html>`;
}

(async () => {
  const browser = await chromium.launch();
  const dir = path.dirname(__filename);

  for (const post of posts) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.setContent(makeHTML(post.title), { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(dir, `${post.slug}.png`),
      type: "png",
    });
    await page.close();
    console.log(`Generated ${post.slug}.png`);
  }

  await browser.close();
})();
