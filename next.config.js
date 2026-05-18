/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "query", key: "mode", value: "agent" }],
          destination: "/api/agent",
        },
        { source: "/", destination: "/index.html" },
      ],
      afterFiles: [
        { source: "/blog/:slug", destination: "/blog/:slug.html" },
        { source: "/notebook/:page", destination: "/notebook/:page.html" },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Link",
            value:
              "</llms.txt>; rel=service-desc, </agents.json>; rel=describedby, </.well-known/ai-plugin.json>; rel=ai-plugin",
          },
        ],
      },
    ];
  },
};
