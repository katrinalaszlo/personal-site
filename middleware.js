export default async function middleware(request) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return;

  const url = new URL(request.url);
  const path = url.pathname;

  let mdPath;
  if (path === "/") {
    mdPath = "/index.md";
  } else {
    const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blogMatch) {
      mdPath = `/blog/${blogMatch[1]}.md`;
    }
  }

  if (!mdPath) return;

  const mdUrl = new URL(mdPath, request.url);
  const res = await fetch(mdUrl);
  if (!res.ok) return;

  return new Response(res.body, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control":
        res.headers.get("cache-control") || "public, max-age=3600",
    },
  });
}

export const config = {
  matcher: ["/", "/blog/:slug*"],
};
