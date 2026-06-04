const { chromium } = require("/opt/homebrew/lib/node_modules/playwright");
const path = require("path");

const html = `<!DOCTYPE html>
<html><head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 630px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #ffffff;
      font-family: 'Inter', system-ui, sans-serif;
      padding-top: 12px;
    }
    .accent {
      width: 48px; height: 4px; background: #4f46e5;
      border-radius: 2px; margin-bottom: 28px;
    }
    h1 {
      font-size: 64px; font-weight: 700; color: #111827;
      text-align: center; letter-spacing: -0.02em;
    }
    p {
      font-size: 22px; font-weight: 400; color: #6b7280;
      margin-top: 16px; letter-spacing: 0.02em;
    }
  </style>
</head><body>
  <div class="accent"></div>
  <h1>Katrina Laszlo</h1>
  <p>Product and Growth</p>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.resolve(__dirname, "..", "..", "og-image.png"),
    type: "png",
  });
  await page.close();
  await browser.close();
  console.log("Generated og-image.png");
})();
