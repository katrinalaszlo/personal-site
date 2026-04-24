(function () {
  var topics = [
    { title: "Model Architecture", href: "/notebook/model-architecture.html" },
    { title: "Training Loops", href: "/notebook/training-loop.html" },
    { title: "Data Pipelines", href: "/notebook/data-pipeline.html" },
    { title: "Wiki vs Vector DB", href: "/notebook/wiki-vs-vector.html" },
    {
      title: "LLM Memory & Retrieval",
      href: "/notebook/llm-memory-and-retrieval.html",
    },
    {
      title: "Knowledge Architecture",
      href: "/notebook/knowledge-system-architecture.html",
    },
    { title: "AI System Design", href: "/notebook/ai-system-design.html" },
    { title: "Agent Teams", href: "/notebook/managing-agent-teams.html" },
  ];

  var path = window.location.pathname;
  var currentIndex = topics.findIndex(function (t) {
    return path.endsWith(t.href.split("/").pop());
  });

  var isDark = getComputedStyle(document.body).backgroundColor.match(
    /^rgb\((\d+)/,
  );
  var dark = isDark && parseInt(isDark[1]) < 40;

  var sidebar = document.createElement("nav");
  sidebar.className = "nb-sidebar";

  var homeLink = document.createElement("a");
  homeLink.href = "/notebook/";
  homeLink.textContent = "Notebook";
  homeLink.className = "nb-sidebar-home";
  sidebar.appendChild(homeLink);

  var list = document.createElement("ul");
  topics.forEach(function (t, i) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = t.href;
    a.textContent = t.title;
    if (i === currentIndex) a.className = "nb-active";
    li.appendChild(a);
    list.appendChild(li);
  });
  sidebar.appendChild(list);

  document.body.appendChild(sidebar);

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

  var style = document.createElement("style");
  style.textContent = dark
    ? [
        ".nb-sidebar { position:fixed; top:0; left:0; bottom:0; width:220px; padding:20px 16px; background:rgba(13,17,23,0.95); border-right:1px solid #30363d; z-index:200; overflow-y:auto; font-family:-apple-system,Inter,system-ui,sans-serif; }",
        ".nb-sidebar-home { display:block; font-size:13px; font-weight:600; color:#58a6ff; text-decoration:none; margin-bottom:16px; letter-spacing:-0.3px; }",
        ".nb-sidebar ul { list-style:none; padding:0; margin:0; }",
        ".nb-sidebar li { margin-bottom:2px; }",
        ".nb-sidebar a { display:block; padding:6px 10px; font-size:13px; color:#8b949e; text-decoration:none; border-radius:6px; transition:all 0.15s; }",
        ".nb-sidebar a:hover { color:#e6edf3; background:rgba(255,255,255,0.05); }",
        ".nb-sidebar a.nb-active { color:#e6edf3; background:rgba(88,166,255,0.12); }",
        ".nb-bottom-nav { max-width:900px; margin:60px auto 40px; padding:0 24px; display:flex; justify-content:space-between; gap:16px; }",
        ".nb-bottom-nav a { display:inline-block; padding:10px 20px; font-size:14px; color:#e6edf3; background:#161b22; border:1px solid #30363d; border-radius:8px; text-decoration:none; transition:border-color 0.15s; font-family:-apple-system,Inter,system-ui,sans-serif; }",
        ".nb-bottom-nav a:hover { border-color:#58a6ff; }",
        ".nb-next { margin-left:auto; }",
        "@media (max-width:900px) { .nb-sidebar { display:none; } }",
      ].join("\n")
    : [
        ".nb-sidebar { position:fixed; top:0; left:0; bottom:0; width:220px; padding:20px 16px; background:#fff; border-right:1px solid #e4e4e7; z-index:200; overflow-y:auto; font-family:-apple-system,Inter,system-ui,sans-serif; }",
        ".nb-sidebar-home { display:block; font-size:13px; font-weight:600; color:#4f46e5; text-decoration:none; margin-bottom:16px; letter-spacing:-0.3px; }",
        ".nb-sidebar ul { list-style:none; padding:0; margin:0; }",
        ".nb-sidebar li { margin-bottom:2px; }",
        ".nb-sidebar a { display:block; padding:6px 10px; font-size:13px; color:#71717a; text-decoration:none; border-radius:6px; transition:all 0.15s; }",
        ".nb-sidebar a:hover { color:#0a0a0a; background:#f4f4f5; }",
        ".nb-sidebar a.nb-active { color:#0a0a0a; background:#f0f0ff; }",
        ".nb-bottom-nav { max-width:900px; margin:60px auto 40px; padding:0 24px; display:flex; justify-content:space-between; gap:16px; }",
        ".nb-bottom-nav a { display:inline-block; padding:10px 20px; font-size:14px; color:#0a0a0a; background:#fff; border:1px solid #e4e4e7; border-radius:8px; text-decoration:none; transition:border-color 0.15s; font-family:-apple-system,Inter,system-ui,sans-serif; }",
        ".nb-bottom-nav a:hover { border-color:#4f46e5; }",
        ".nb-next { margin-left:auto; }",
        "@media (max-width:900px) { .nb-sidebar { display:none; } }",
      ].join("\n");

  document.head.appendChild(style);

  if (window.innerWidth > 900) {
    document.body.style.marginLeft = "220px";
  }
  window.addEventListener("resize", function () {
    document.body.style.marginLeft = window.innerWidth > 900 ? "220px" : "";
  });
})();
