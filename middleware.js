import { NextResponse } from "next/server";

export function middleware(request) {
  const accept = request.headers.get("accept") || "";
  const path = request.nextUrl.pathname;
  const ua = request.headers.get("user-agent") || "";

  const wantsMarkdown =
    accept.includes("text/markdown") ||
    (accept.includes("text/plain") && !accept.includes("text/html"));
  const wantsJSON =
    accept.includes("application/json") && !accept.includes("text/html");

  if (wantsJSON) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/agents.json";
      const res = NextResponse.rewrite(url);
      res.headers.set("Vary", "Accept");
      res.headers.set("Content-Type", "application/json");
      return res;
    }
    const res = NextResponse.json(
      { error: "Not Found", path, hint: "Try / for structured data" },
      { status: 404 },
    );
    res.headers.set("Vary", "Accept");
    return res;
  }

  if (wantsMarkdown) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/index.md";
      const res = NextResponse.rewrite(url);
      res.headers.set("Vary", "Accept");
      res.headers.set("Content-Type", "text/markdown; charset=utf-8");
      return res;
    }

    const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blogMatch) {
      const url = request.nextUrl.clone();
      url.pathname = `/blog/${blogMatch[1]}.md`;
      const res = NextResponse.rewrite(url);
      res.headers.set("Vary", "Accept");
      res.headers.set("Content-Type", "text/markdown; charset=utf-8");
      return res;
    }

    const notebookMatch = path.match(/^\/notebook\/([a-z0-9-]+)$/);
    if (notebookMatch) {
      const url = request.nextUrl.clone();
      url.pathname = "/llms-full.txt";
      const res = NextResponse.rewrite(url);
      res.headers.set("Vary", "Accept");
      res.headers.set("Content-Type", "text/plain; charset=utf-8");
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|api/|.*\\.).*)"],
};
