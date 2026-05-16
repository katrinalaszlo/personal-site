const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(process.cwd(), ".well-known", "agent-skills");
const NOTEBOOK_DIR = path.join(process.cwd(), "notebook");

function loadSkills() {
  const index = JSON.parse(
    fs.readFileSync(path.join(SKILLS_DIR, "index.json"), "utf8"),
  );
  const skills = {};
  for (const entry of index.skills) {
    const skillDir = path.join(SKILLS_DIR, entry.name);
    const skillMd = fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
    const refsDir = path.join(skillDir, "references");
    const refs = {};
    if (fs.existsSync(refsDir)) {
      for (const f of fs.readdirSync(refsDir)) {
        if (f.endsWith(".md")) {
          refs[f.replace(".md", "")] = fs.readFileSync(
            path.join(refsDir, f),
            "utf8",
          );
        }
      }
    }
    skills[entry.name] = {
      description: entry.description,
      content: skillMd,
      references: refs,
    };
  }
  return skills;
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

function loadNotebookPages() {
  const pages = {};
  if (!fs.existsSync(NOTEBOOK_DIR)) return pages;
  for (const f of fs.readdirSync(NOTEBOOK_DIR)) {
    if (f.endsWith(".html") && f !== "index.html") {
      const html = fs.readFileSync(path.join(NOTEBOOK_DIR, f), "utf8");
      const titleMatch = html.match(/<title>([^<]+)/);
      const title = titleMatch
        ? titleMatch[1].replace(/ — Notebook.*/, "")
        : f.replace(".html", "");
      pages[f.replace(".html", "")] = { title, content: stripHtml(html) };
    }
  }
  return pages;
}

let skillsCache = null;
let pagesCache = null;

function getSkills() {
  if (!skillsCache) skillsCache = loadSkills();
  return skillsCache;
}

function getPages() {
  if (!pagesCache) pagesCache = loadNotebookPages();
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
                description:
                  "Optional: specific topic to search within. One of: agent-experience-design, ai-foundations, knowledge-systems, ai-system-design, agent-tools",
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
                  "Include full reference files (more tokens, more detail). Default false for concise response.",
              },
            },
            required: ["skill_name"],
          },
        },
      ],
    },
  };
}

function searchContent(query, topic) {
  const terms = query.toLowerCase().split(/\s+/);
  const results = [];

  const skills = getSkills();
  const pages = getPages();

  const searchIn = topic ? { [topic]: skills[topic] } : skills;

  for (const [name, skill] of Object.entries(searchIn)) {
    if (!skill) continue;
    const text = (skill.content + " " + skill.description).toLowerCase();
    const score = terms.filter((t) => text.includes(t)).length;
    if (score > 0) {
      results.push({
        type: "skill",
        name,
        description: skill.description,
        score,
      });
    }
    for (const [refName, refContent] of Object.entries(skill.references)) {
      const refText = refContent.toLowerCase();
      const refScore = terms.filter((t) => refText.includes(t)).length;
      if (refScore > 0) {
        results.push({
          type: "reference",
          skill: name,
          name: refName,
          content: refContent.slice(0, 2000),
          score: refScore,
        });
      }
    }
  }

  if (!topic) {
    for (const [name, page] of Object.entries(pages)) {
      const text = (page.title + " " + page.content).toLowerCase();
      const score = terms.filter((t) => text.includes(t)).length;
      if (score > 0) {
        results.push({
          type: "page",
          name,
          title: page.title,
          content: page.content.slice(0, 2000),
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
}

function handleToolCall(id, name, args) {
  if (name === "list_topics") {
    const skills = getSkills();
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
    const skills = getSkills();
    const skill = skills[args.skill_name];
    if (!skill) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: "Skill not found: " + args.skill_name },
          ],
        },
      };
    }
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
    const results = searchContent(args.query, args.topic);
    if (results.length === 0) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: "No results found for: " + args.query },
          ],
        },
      };
    }
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

  if (req.method === "DELETE") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.status(200);
    res.write(":ok\n\n");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;
  if (!body || !body.method) {
    return res.status(400).json({ error: "Invalid JSON-RPC request" });
  }

  const sessionId = "katrinalaszlo-notebook-static";
  res.setHeader("Mcp-Session-Id", sessionId);

  let response;
  switch (body.method) {
    case "initialize":
      response = handleInitialize(body.id);
      break;
    case "tools/list":
      response = handleToolsList(body.id);
      break;
    case "tools/call":
      response = handleToolCall(
        body.id,
        body.params?.name,
        body.params?.arguments || {},
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
