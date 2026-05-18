import { NextResponse } from "next/server";

export function middleware(request) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return NextResponse.next();

  const path = request.nextUrl.pathname;

  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/index.md";
    return NextResponse.rewrite(url);
  }

  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/blog/${blogMatch[1]}.md`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog/:slug*"],
};
