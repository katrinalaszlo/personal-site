---
title: "Product Discovery with Karpathy's LLM Wiki"
date: 2026-04-27
description: "I repurposed Karpathy's LLM Wiki for product discovery. It worked surprisingly well."
author: Kat Laszlo
---

# Product Discovery with Karpathy's LLM Wiki

I was playing with Karpathy's LLM Wiki and realized it could be re-applied to my manual workflow as a PM.

Normally I identify quotes from transcripts, create user stories, group them into features, and prioritize based on effort, impact, dependencies. It's tedious and error-prone, especially across 10+ interviews.

I tried using a wiki instead of my manual process for customer interviews and it worked surprisingly well.

## How it works

Before running it, you can edit the prompt to decide what's worth tagging and how user stories should be written. When you re-run it, it does not blindly overwrite your edits or duplicate prior work.

One piece I especially like is the ability to view the connections as a graph and drill down from a user story to the actual customer quotes behind it. And if you're using AI to code, you can feed that evidence in as context. It builds better when it understands *why* you're building something.

## Try it out

The repo ships with 3 fictional transcripts and a pre-built wiki (3 customers, 2 stories, 2 features) so you can explore the output immediately. Open the wiki/ folder in Obsidian to see the graph.

When you're ready to use your own data, drop transcripts into raw/ and ingest. Your data lives alongside the examples. Delete the example files whenever you want. They won't affect your wiki.

## Who else this might be useful for

I built this for product discovery, but I imagine it could work for customer success, customer research, or design, anywhere you're trying to surface themes across qualitative data.

If you haven't used Claude Code or Codex before, happy to lend a hand. It's deceptively non-technical.

[github.com/katrinalaszlo/buildnext-oss](https://github.com/katrinalaszlo/buildnext-oss)
