import { put, list } from "@vercel/blob";

const AGENT_MAIL_KEY = process.env.AGENT_MAIL_KEY;
const INBOX_ID = process.env.AGENT_MAIL_INBOX_ID;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const { email } = req.body || {};
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  const normalized = email.trim().toLowerCase();

  let subscribers = [];
  try {
    const { blobs } = await list({ prefix: "subscribers.json" });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      subscribers = await response.json();
    }
  } catch (e) {
    subscribers = [];
  }

  if (subscribers.includes(normalized)) {
    return res.status(200).json({ message: "Already subscribed" });
  }

  subscribers.push(normalized);

  await put("subscribers.json", JSON.stringify(subscribers), {
    access: "public",
    addRandomSuffix: false,
  });

  if (AGENT_MAIL_KEY && INBOX_ID) {
    await fetch(`https://api.agentmail.to/inboxes/${INBOX_ID}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AGENT_MAIL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "katrina.j.laszlo@gmail.com",
        subject: `New subscriber: ${normalized}`,
        text: `${normalized} just subscribed to your blog.\n\nTotal subscribers: ${subscribers.length}`,
      }),
    });
  }

  return res.status(200).json({ message: "Subscribed" });
};
