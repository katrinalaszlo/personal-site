import { NextResponse } from "next/server";

const AGENT_UA =
  /ChatGPT-User|Claude-Web|Perplexity|GPTBot|Google-Extended|Amazonbot|anthropic-ai|cohere-ai|AI2Bot|Applebot-Extended|CCBot|Meta-ExternalAgent|PerplexityBot|Bytespider|ClaudeBot/i;

function serveMarkdown(request, mdPath) {
  const url = request.nextUrl.clone();
  url.pathname = mdPath;
  const res = NextResponse.rewrite(url);
  res.headers.set("Vary", "Accept, User-Agent");
  res.headers.set("Content-Type", "text/markdown; charset=utf-8");
  return res;
}

function markdownPathFor(path) {
  if (path === "/") return "/index.md";
  if (path === "/blog") return "/llms-full.txt";
  if (path === "/notebook") return "/llms-full.txt";
  if (path === "/developers") return "/llms-full.txt";

  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) return `/blog/${blogMatch[1]}.md`;

  const notebookMatch = path.match(/^\/notebook\/([a-z0-9-]+)$/);
  if (notebookMatch) return `/notebook/${notebookMatch[1]}.md`;

  return null;
}

export function middleware(request) {
  const accept = request.headers.get("accept") || "";
  const path = request.nextUrl.pathname;
  const ua = request.headers.get("user-agent") || "";

  // .md URL requests — serve with correct content type
  if (path.endsWith(".md")) {
    const res = NextResponse.next();
    res.headers.set("Content-Type", "text/markdown; charset=utf-8");
    res.headers.set("Vary", "Accept");
    return res;
  }

  const wantsMarkdown =
    accept.includes("text/markdown") ||
    (accept.includes("text/plain") && !accept.includes("text/html"));
  const wantsJSON =
    accept.includes("application/json") && !accept.includes("text/html");
  const isAgent = AGENT_UA.test(ua);

  if (wantsJSON) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/agents.json";
      const res = NextResponse.rewrite(url);
      res.headers.set("Vary", "Accept, User-Agent");
      res.headers.set("Content-Type", "application/json");
      return res;
    }
    const res = NextResponse.json(
      { error: "Not Found", path, hint: "Try / for structured data" },
      { status: 404 },
    );
    res.headers.set("Vary", "Accept, User-Agent");
    return res;
  }

  if (wantsMarkdown || isAgent) {
    const mdPath = markdownPathFor(path);
    if (mdPath) return serveMarkdown(request, mdPath);
  }

  const res = NextResponse.next();
  res.headers.set("Vary", "Accept, User-Agent");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|api/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|woff2?|ttf|xml|json|txt)$).*)",
  ],
};
