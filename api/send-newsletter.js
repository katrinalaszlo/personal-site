const { list } = require("@vercel/blob");

const AGENT_MAIL_KEY = process.env.AGENT_MAIL_KEY;
const INBOX_ID = process.env.AGENT_MAIL_INBOX_ID;
const ADMIN_SECRET = process.env.NEWSLETTER_ADMIN_SECRET;

function buildEmailHtml({ title, url, content }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="background:#fff;border-radius:8px;border:1px solid #e4e4e7;overflow:hidden;">
    <div style="padding:32px 32px 0;">
      <p style="margin:0 0 24px;font-size:14px;color:#71717a;">New post from <a href="https://katrinalaszlo.com" style="color:#0a0a0a;font-weight:500;text-decoration:none;">Katrina Laszlo</a></p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;line-height:1.3;color:#0a0a0a;letter-spacing:-0.02em;">${title}</h1>
    </div>
    <div style="padding:0 32px 32px;font-size:16px;line-height:1.7;color:#27272a;">
      ${content}
    </div>
    <div style="padding:24px 32px;border-top:1px solid #e4e4e7;">
      <a href="${url}" style="display:inline-block;padding:10px 20px;background:#0a0a0a;color:#fff;border-radius:6px;font-size:14px;font-weight:500;text-decoration:none;">Read on site</a>
    </div>
  </div>
  <div style="padding:24px 0;text-align:center;">
    <p style="margin:0 0 8px;font-size:13px;color:#71717a;">
      <a href="https://x.com/Katlaszlo" style="color:#71717a;text-decoration:none;margin:0 8px;">X</a>
      <a href="https://www.linkedin.com/in/katrinalaszlo/" style="color:#71717a;text-decoration:none;margin:0 8px;">LinkedIn</a>
      <a href="https://github.com/katrinalaszlo" style="color:#71717a;text-decoration:none;margin:0 8px;">GitHub</a>
      <a href="https://katrinalaszlo.com/blog/" style="color:#71717a;text-decoration:none;margin:0 8px;">Blog</a>
    </p>
    <p style="margin:0;font-size:12px;color:#a1a1aa;">You received this because you subscribed at katrinalaszlo.com</p>
  </div>
</div>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const authHeader = req.headers["x-admin-secret"];
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!AGENT_MAIL_KEY || !INBOX_ID) {
    return res
      .status(500)
      .json({ error: "Missing AGENT_MAIL_KEY or AGENT_MAIL_INBOX_ID" });
  }

  const { title, url, content } = req.body || {};
  if (!title || !url || !content) {
    return res.status(400).json({ error: "title, url, and content required" });
  }

  let subscribers = [];
  try {
    const { blobs } = await list({ prefix: "subscribers.json" });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      subscribers = await response.json();
    }
  } catch (e) {
    return res.status(500).json({ error: "Failed to read subscribers" });
  }

  if (subscribers.length === 0) {
    return res.status(200).json({ message: "No subscribers", sent: 0 });
  }

  const html = buildEmailHtml({ title, url, content });
  const results = [];

  for (const email of subscribers) {
    try {
      const resp = await fetch(
        `https://api.agentmail.to/inboxes/${INBOX_ID}/messages/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AGENT_MAIL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            subject: title,
            html,
            text: `New post: ${title}\n\nRead it here: ${url}`,
          }),
        },
      );
      results.push({ email, status: resp.ok ? "sent" : "failed" });
    } catch (e) {
      results.push({ email, status: "error" });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  return res
    .status(200)
    .json({ message: `Sent to ${sent}/${subscribers.length}`, results });
};
