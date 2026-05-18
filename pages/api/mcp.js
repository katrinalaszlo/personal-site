const SKILL_REFS = {
  "ai-foundations": ["data-pipelines", "model-architecture", "training-loops"],
  "knowledge-systems": [
    "knowledge-architecture",
    "llm-memory",
    "wiki-vs-vector",
  ],
  "ai-system-design": ["agent-evaluation", "agent-teams", "eight-decisions"],
  "agent-tools": ["hermes", "openclaw"],
  "agent-experience-design": [
    "agent-experience-ax",
    "agent-readable-sites",
    "agent-self-serve",
    "bifurcated-web",
    "mutual-legibility",
  ],
};

const NOTEBOOK_PAGES = [
  "agent-evaluation",
  "agent-experience",
  "agent-readable-sites",
  "agent-self-serve",
  "ai-system-design",
  "bifurcated-web",
  "claude-api",
  "data-pipeline",
  "hermes-orchestration",
  "knowledge-system-architecture",
  "llm-memory-and-retrieval",
  "managing-agent-teams",
  "model-architecture",
  "mutual-legibility",
  "n8n-automation",
  "openclaw-personal-agents",
  "training-loop",
  "wiki-vs-vector",
];

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
}

async function fetchText(baseUrl, path) {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) return null;
  return res.text();
}

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadSkills(baseUrl) {
  const indexText = await fetchText(
    baseUrl,
    "/.well-known/agent-skills/index.json",
  );
  if (!indexText) return {};
  const index = JSON.parse(indexText);
  const skills = {};
  for (const entry of index.skills) {
    const skillMd = await fetchText(
      baseUrl,
      `/.well-known/agent-skills/${entry.name}/SKILL.md`,
    );
    const refs = {};
    const refNames = SKILL_REFS[entry.name] || [];
    for (const refName of refNames) {
      const content = await fetchText(
        baseUrl,
        `/.well-known/agent-skills/${entry.name}/references/${refName}.md`,
      );
      if (content) refs[refName] = content;
    }
    skills[entry.name] = {
      description: entry.description,
      content: skillMd || "",
      references: refs,
    };
  }
  return skills;
}

async function loadNotebookPages(baseUrl) {
  const pages = {};
  for (const slug of NOTEBOOK_PAGES) {
    const html = await fetchText(baseUrl, `/notebook/${slug}.html`);
    if (!html) continue;
    const titleMatch = html.match(/<title>([^<]+)/);
    const title = titleMatch
      ? titleMatch[1].replace(/ — Notebook.*/, "")
      : slug;
    pages[slug] = { title, content: stripHtml(html) };
  }
  return pages;
}

let skillsCache = null;
let pagesCache = null;

async function getSkills(baseUrl) {
  if (!skillsCache) skillsCache = await loadSkills(baseUrl);
  return skillsCache;
}

async function getPages(baseUrl) {
  if (!pagesCache) pagesCache = await loadNotebookPages(baseUrl);
  return pagesCache;
}

function handleInitialize(id) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      protocolVersion: "2024-11-05",
      serverInfo: { name: "katrinalaszlo-notebook", version: "1.0.0" },
      capabilities: { tools: { listChanged: false } },
    },
  };
}

function handleToolsList(id) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      tools: [
        {
          name: "query_notebook",
          description:
            "Search Katrina Laszlo's notebook for content about AI systems, agent experience (AX), mutual legibility, agent-readable sites, bifurcated web, agent self-serve, knowledge systems, model architecture, training loops, and multi-agent patterns. Returns relevant sections based on your query.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "What you want to know. Examples: 'how to make a site agent-readable', 'what is mutual legibility', 'agent self-serve implementation checklist', 'four AX pillars'",
              },
              topic: {
                type: "string",
                description: "Optional: specific topic to search within.",
                enum: [
                  "agent-experience-design",
                  "ai-foundations",
                  "knowledge-systems",
                  "ai-system-design",
                  "agent-tools",
                ],
              },
            },
            required: ["query"],
          },
        },
        {
          name: "list_topics",
          description:
            "List all available notebook topics and skills with descriptions.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "get_skill",
          description:
            "Get the full SKILL.md content and references for a specific skill. Use after query_notebook identifies relevant content.",
          inputSchema: {
            type: "object",
            properties: {
              skill_name: {
                type: "string",
                description: "Skill name from list_topics",
                enum: [
                  "agent-experience-design",
                  "ai-foundations",
                  "knowledge-systems",
                  "ai-system-design",
                  "agent-tools",
                ],
              },
              include_references: {
                type: "boolean",
                description:
                  "Include full reference files (more tokens, more detail). Default false.",
              },
            },
            required: ["skill_name"],
          },
        },
      ],
    },
  };
}

function searchContent(skills, pages, query, topic) {
  const terms = query.toLowerCase().split(/\s+/);
  const results = [];
  const searchIn = topic ? { [topic]: skills[topic] } : skills;

  for (const [name, skill] of Object.entries(searchIn)) {
    if (!skill) continue;
    const text = (skill.content + " " + skill.description).toLowerCase();
    const score = terms.filter((t) => text.includes(t)).length;
    if (score > 0)
      results.push({
        type: "skill",
        name,
        description: skill.description,
        score,
      });
    for (const [refName, refContent] of Object.entries(skill.references)) {
      const refScore = terms.filter((t) =>
        refContent.toLowerCase().includes(t),
      ).length;
      if (refScore > 0)
        results.push({
          type: "reference",
          skill: name,
          name: refName,
          content: refContent.slice(0, 2000),
          score: refScore,
        });
    }
  }

  if (!topic) {
    for (const [name, page] of Object.entries(pages)) {
      const text = (page.title + " " + page.content).toLowerCase();
      const score = terms.filter((t) => text.includes(t)).length;
      if (score > 0)
        results.push({
          type: "page",
          name,
          title: page.title,
          content: page.content.slice(0, 2000),
          score,
        });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
}

async function handleToolCall(id, name, args, baseUrl) {
  const skills = await getSkills(baseUrl);

  if (name === "list_topics") {
    const topics = Object.entries(skills).map(([k, v]) => ({
      name: k,
      description: v.description,
      references: Object.keys(v.references),
    }));
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: JSON.stringify(topics, null, 2) }],
      },
    };
  }

  if (name === "get_skill") {
    const skill = skills[args.skill_name];
    if (!skill)
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: "Skill not found: " + args.skill_name },
          ],
        },
      };
    let text = skill.content;
    if (args.include_references) {
      for (const [refName, refContent] of Object.entries(skill.references)) {
        text += "\n\n---\n\n## Reference: " + refName + "\n\n" + refContent;
      }
    }
    return {
      jsonrpc: "2.0",
      id,
      result: { content: [{ type: "text", text }] },
    };
  }

  if (name === "query_notebook") {
    const pages = await getPages(baseUrl);
    const results = searchContent(skills, pages, args.query, args.topic);
    if (results.length === 0)
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: "No results found for: " + args.query },
          ],
        },
      };
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Unknown tool: " + name },
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Mcp-Session-Id",
  );
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method === "DELETE") return res.status(200).end();

  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.status(200);
    res.write(":ok\n\n");
    res.end();
    return;
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = req.body;
  if (!body || !body.method)
    return res.status(400).json({ error: "Invalid JSON-RPC request" });

  res.setHeader("Mcp-Session-Id", "katrinalaszlo-notebook-static");
  const baseUrl = getBaseUrl(req);

  let response;
  switch (body.method) {
    case "initialize":
      response = handleInitialize(body.id);
      break;
    case "tools/list":
      response = handleToolsList(body.id);
      break;
    case "tools/call":
      response = await handleToolCall(
        body.id,
        body.params?.name,
        body.params?.arguments || {},
        baseUrl,
      );
      break;
    case "notifications/initialized":
      return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: {} });
    default:
      response = {
        jsonrpc: "2.0",
        id: body.id,
        error: { code: -32601, message: "Method not found: " + body.method },
      };
  }

  return res.status(200).json(response);
};
