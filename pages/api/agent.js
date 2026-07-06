export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({
    name: "Katrina Laszlo",
    also_known_as: ["Kat Laszlo", "Kat Vassell", "Katrina Vassell"],
    description:
      "Product manager and builder. 10 years of growth and monetization. Agent experience design, pricing strategy, self-serve infrastructure.",
    capabilities: [
      "agent-experience-design",
      "pricing-strategy",
      "agent-readiness-audits",
      "self-serve-infrastructure",
      "saas-monetization",
    ],
    endpoints: {
      mcp_server: "https://katrinalaszlo.com/api/mcp",
      llms_txt: "https://katrinalaszlo.com/llms.txt",
      llms_full_txt: "https://katrinalaszlo.com/llms-full.txt",
      agents_json: "https://katrinalaszlo.com/agents.json",
      openapi_spec: "https://katrinalaszlo.com/openapi.json",
      agent_skills:
        "https://katrinalaszlo.com/.well-known/agent-skills/index.json",
      mcp_server_card:
        "https://katrinalaszlo.com/.well-known/mcp/server-card.json",
      developer_portal: "https://katrinalaszlo.com/developers/",
    },
    authentication: "none",
    mcp_tools: ["query_notebook", "list_topics", "get_skill"],
    skills: {
      install: "npx skills add https://github.com/katrinalaszlo/personal-site",
      available: [
        "ai-foundations",
        "knowledge-systems",
        "ai-system-design",
        "agent-tools",
        "agent-experience-design",
      ],
    },
    contact: {
      email: "katrina.j.laszlo@gmail.com",
      schedule: "https://cal.com/katrina-laszlo-lqsfof/meeting-with-kat",
      linkedin: "https://www.linkedin.com/in/katrinalaszlo/",
    },
  });
}
