---
title: "Being Worth Retrieving From"
date: 2026-08-07
description: "Garry Tan says retrieval is easy and being worth retrieving from is the product. He named the four hard parts and moved on. Here's how my system answers each one."
author: Kat Laszlo
---

# Being Worth Retrieving From

Garry Tan closed Startup School with a talk called [Own Your Intelligence](https://www.ycombinator.com/library/WX-garry-tan-own-your-intelligence), describing a library of markdown, a librarian agent, skill files that work like employees, and jobs that finish while you sleep. Near the end he raises the objection everyone was thinking. Is this just RAG?

His answer was the best line of the talk. "Retrieval is easy. Being worth retrieving from is the product." Then he named the four hard parts and moved on. What gets written down in the first place, how it gets enriched and linked, what gets promoted to hot memory versus filed as cold reference, and who arbitrates when two facts disagree.

I've been running this architecture since spring, in the same repo-of-markdown shape he describes. Mine is one git repo built on Claude Code, holding around 1,300 source files, a wiki the agent maintains, memory the agent writes about how I work, skills that grew into shipped tools, and briefs that run on a schedule. I wrote about an early version of it in [Product Discovery with Karpathy's LLM Wiki](/blog/product-discovery-with-llm-wiki), and it has compounded ever since.

![My personal AGI stack: a rented frontier model plus owned context plus a harness, compiling down to five layers in one git repo](/blog/images/vault-stack.png)

So instead of nodding along, here is my working answer to each of his four questions.

## What gets written down in the first place

The human curates, the agent maintains. I decide what enters, then the agent files it. A new source lands in a raw layer the agent may never edit, which now holds transcripts, research, screenshots, and a twelve-year career archive. From there the agent writes a summary page holding the claims worth keeping, each with a citation back to the original, so nothing survives without a pointer to where it came from. People, companies, and recurring ideas get their own pages, updated when one exists and created only when one doesn't, and every page links out to the pages it touches. What gets thrown away is the repetition, the boilerplate, and anything an existing page already covers, because the standing rule is update before create.

Every source type also has its own written ingest recipe, because a sales call, a Reddit complaint thread, and an open source repo shouldn't be summarized the same way. A recipe is a page of English, which means the intake standard is versioned and reviewable, not vibes.

## How it gets enriched and linked

Synthesis lives in a separate layer with typed pages for entities, concepts, cross-source analysis, and answers worth preserving. Every page carries frontmatter naming its sources, and every operation appends to a log, so I can trace any claim back to the document it came from. Links are cheap to create and expensive to be wrong about, so there's a threshold rule. A broken link only earns a stub page once two or more pages reference it. That one rule keeps the graph from filling with ghost nodes.

## Hot memory versus cold reference

Memory has three tiers. One small index file loads into every session, and a memory line has to earn its place there. The wiki sits in the middle, searched when a question touches it, and raw sources stay cold until a claim needs verifying against the original. Promotion between tiers is an editorial decision rather than an algorithmic one, because nothing deserves the hot tier for being recent. It earns the spot by changing how I work.

## Who arbitrates when two facts disagree

The agent never does. Contradictions get flagged, side by side, and stay flagged until a source or a human settles them. Two more laws back that up. Synthesis can never become evidence, so the agent may not cite its own earlier conclusion as a fact. And sparse evidence keeps its original shape, so three data points stay three data points instead of becoming a framework.

![The four hard parts of the RAG objection, each answered with a working rule: immutable raw layer, cited synthesis, editorial promotion, flag never resolve](/blog/images/is-this-just-rag.png)

## The fifth question

There's a question the talk didn't ask. Who is allowed to write to the library at all?

I keep an eval harness with frozen reference outputs for each workflow, and every model has to pass it before it touches the wiki. Extraction work like ingesting an article delegates safely to a cheap model, while synthesis does not. In my harness the cheap model invented competitor metrics, silently resolved contradictions, and turned a two-page analysis into fourteen thin ones. Those routing decisions are written down next to the results, and I re-run the harness when a new model lands.

![Eval results by workflow. Article ingest, call notes, and OSS deep-reads delegate to cheap models. Complaint mining and multi-thread queries need a strong model. UX exploration needs human review regardless.](/blog/images/model-write-access.png)

## The warning I'd add

Your archive is always partial, and a confident agent reads a partial archive and concludes the missing work never happened. For a while my own system kept telling me my record was smaller than it is, and the fix turned out to be a law rather than a feature. Absence of a document is never absence of the work. When a fact about me is missing, the instruction is search every name I've used, then ask me, and my answer is final.

Nobody warns you that your memory system can argue with you about your own life, so that law is worth writing before you need it.

## Then write the constitution

He's right that the weights are everyone's and the library is yours. What I'd add is that the database is the easy part, and a library becomes worth retrieving from through its laws. Build the shelf this weekend, like he says, and then write its constitution.

If you want a starting point, [buildnext-oss](https://github.com/katrinalaszlo/buildnext-oss) applies this same pattern to product management, turning customer interviews into a cited wiki of user stories and features, with example data included so you can see the output before adding your own. The personal version is the same architecture pointed at your own history. And if you haven't used Claude Code or Codex before, happy to lend a hand. It's deceptively non-technical.
