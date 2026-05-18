import { put, list } from "@vercel/blob";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const email = req.query.email
    ? Buffer.from(req.query.email, "base64")
        .toString("utf8")
        .trim()
        .toLowerCase()
    : null;

  if (!email || !email.includes("@")) {
    return res.status(400).send(page("Invalid unsubscribe link."));
  }

  let subscribers = [];
  try {
    const { blobs } = await list({ prefix: "subscribers.json" });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      subscribers = await response.json();
    }
  } catch (e) {
    return res.status(500).send(page("Something went wrong. Try again later."));
  }

  if (!subscribers.includes(email)) {
    return res.status(200).send(page("You're not subscribed.", email));
  }

  subscribers = subscribers.filter((e) => e !== email);

  await put("subscribers.json", JSON.stringify(subscribers), {
    access: "public",
    addRandomSuffix: false,
  });

  return res.status(200).send(page("You've been unsubscribed.", email));
};

function page(message, email) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unsubscribe — Katrina Laszlo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; color: #0a0a0a; }
.box { text-align: center; max-width: 400px; padding: 2rem; }
h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
p { color: #52525b; font-size: 0.9375rem; margin-bottom: 1.5rem; }
a { color: #4f46e5; text-decoration: none; font-size: 0.875rem; }
</style>
</head>
<body>
<div class="box">
  <h1>${message}</h1>
  ${email ? `<p>${email}</p>` : ""}
  <a href="https://katrinalaszlo.com/blog/">Back to blog</a>
</div>
</body>
</html>`;
}
