(function () {
  var sections = [
    {
      label: "About AI",
      items: [
        {
          title: "Model Architecture",
          href: "/notebook/model-architecture.html",
        },
        { title: "Training Loops", href: "/notebook/training-loop.html" },
        { title: "Data Pipelines", href: "/notebook/data-pipeline.html" },
      ],
    },
    {
      label: "Knowledge Systems",
      items: [
        { title: "Wiki vs Vector DB", href: "/notebook/wiki-vs-vector.html" },
        {
          title: "LLM Memory & Retrieval",
          href: "/notebook/llm-memory-and-retrieval.html",
        },
        {
          title: "Knowledge Architecture",
          href: "/notebook/knowledge-system-architecture.html",
        },
      ],
    },
    {
      label: "Building AI Systems",
      items: [
        { title: "AI System Design", href: "/notebook/ai-system-design.html" },
        { title: "Agent Teams", href: "/notebook/managing-agent-teams.html" },
        { title: "Agent Evaluation", href: "/notebook/agent-evaluation.html" },
      ],
    },
    {
      label: "Agent Tools",
      items: [
        { title: "Claude API", href: "/notebook/claude-api.html" },
        { title: "n8n Automation", href: "/notebook/n8n-automation.html" },
        {
          title: "OpenClaw Personal Agents",
          href: "/notebook/openclaw-personal-agents.html",
        },
        {
          title: "Hermes Orchestration",
          href: "/notebook/hermes-orchestration.html",
        },
      ],
    },
    {
      label: "Agent Experience",
      items: [
        {
          title: "Agent Experience (AX)",
          href: "/notebook/agent-experience.html",
        },
        {
          title: "Agent-Readable Sites",
          href: "/notebook/agent-readable-sites.html",
        },
        {
          title: "Mutual Legibility",
          href: "/notebook/mutual-legibility.html",
        },
        { title: "The Bifurcated Web", href: "/notebook/bifurcated-web.html" },
        { title: "Agent Self-Serve", href: "/notebook/agent-self-serve.html" },
        {
          title: "The AX Pattern Library",
          href: "/notebook/ax-pattern-library.html",
        },
      ],
    },
  ];

  var topics = [];
  sections.forEach(function (s) {
    s.items.forEach(function (t) {
      topics.push(t);
    });
  });

  var path = window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  var currentIndex = topics.findIndex(function (t) {
    return path === t.href.replace(/\.html$/, "");
  });

  var sidebar = document.createElement("nav");
  sidebar.className = "nb-sidebar";
  sidebar.setAttribute("aria-label", "Notebook topics");

  var homeLink = document.createElement("a");
  homeLink.href = "/notebook/";
  homeLink.textContent = "Notebook";
  homeLink.className = "nb-sidebar-home";
  sidebar.appendChild(homeLink);

  var list = document.createElement("ul");
  sections.forEach(function (s) {
    var header = document.createElement("li");
    header.className = "nb-section-label";
    header.textContent = s.label;
    list.appendChild(header);

    s.items.forEach(function (t) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = t.href;
      a.textContent = t.title;
      var idx = topics.indexOf(t);
      if (idx === currentIndex) {
        a.className = "nb-active";
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      list.appendChild(li);
    });
  });
  sidebar.appendChild(list);

  document.body.appendChild(sidebar);

  // Keep the topic list in place while the article changes.
  try {
    sidebar.scrollTop = Number(sessionStorage.getItem("notebook-sidebar-scroll")) || 0;
  } catch (_) {
    // Navigation still works when browser storage is unavailable.
  }
  sidebar.addEventListener("scroll", function () {
    try {
      sessionStorage.setItem("notebook-sidebar-scroll", String(sidebar.scrollTop));
    } catch (_) {}
  });

  if (currentIndex > -1) {
    var bottomNav = document.createElement("div");
    bottomNav.className = "nb-bottom-nav";

    if (currentIndex > 0) {
      var prev = document.createElement("a");
      prev.href = topics[currentIndex - 1].href;
      prev.className = "nb-prev";
      prev.innerHTML = "&larr; " + topics[currentIndex - 1].title;
      bottomNav.appendChild(prev);
    } else {
      bottomNav.appendChild(document.createElement("span"));
    }

    if (currentIndex < topics.length - 1) {
      var next = document.createElement("a");
      next.href = topics[currentIndex + 1].href;
      next.className = "nb-next";
      next.innerHTML = topics[currentIndex + 1].title + " &rarr;";
      bottomNav.appendChild(next);
    }

    document.body.appendChild(bottomNav);
  }

})();
