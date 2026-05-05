import { next } from "@vercel/edge";

export default async function middleware(request: Request) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return next();

  const url = new URL(request.url);
  const llmsUrl = new URL("/llms.txt", url.origin);
  const res = await fetch(llmsUrl);
  const markdown = await res.text();

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-source": "llms.txt",
    },
  });
}

export const config = {
  matcher: "/",
};
