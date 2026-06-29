---
title: "Building a Pricing Database"
date: 2026-05-05
description: "Human-directed, AI-driven research and insights. An LLM does all the writing, cross-referencing, and maintenance while I curate what goes in."
author: Kat Laszlo
---

# Building a Pricing Database

Several months ago I shared a pricing database on Tanso and got positive feedback from founders and pricing people.

Since then I've been using a wiki-as-living-system approach to knowledge management: an LLM does all the writing, cross-referencing, and maintenance while I curate what goes in. I applied that pattern to my pricing research and decided to make it free: [data.tansohq.com](https://data.tansohq.com)

Here's how it works.

## Input

Company pricing pages are ingested into structured markdown with YAML frontmatter. Every field cites its source, whether that's a pricing page, a blog post, or a press release, and nothing goes in without attribution.

## Output

Each company gets a structured profile of plans, pricing models, AI packaging, credit mechanics, value metrics, overage handling, and more, all of it queryable and filterable.

The dataset currently covers companies across 14 categories (dev tools, AI infrastructure, fintech, collaboration, security, HR, marketing, and others), with full breakdowns of six canonical pricing models: per-seat, usage-based, hybrid, flat-rate, per-transaction, and credit-based.

## Synthesis

The system generates cross-company analysis automatically: AI bundling patterns, free tier economics, credit-based pricing shifts. Each synthesis page traces back to the company data it's built from.

## Changelog

Every pricing change is tracked over time, including who raised prices, who bundled AI into their core product, and who killed their free tier. The changelog is append-only and timestamped, so you can see exactly when things shifted.

## Relationship Map

Wikilinks connect companies, pricing models, and trends into a browsable graph. You can see which companies share pricing patterns, which trends connect to which categories, and how the landscape fits together.

## Data Quality

Every data point carries a confidence score (high, medium, or low) based on source quality and recency. A company profile verified yesterday from their pricing page scores differently than one pieced together from a year-old blog post.

## MCP Server

The dataset is also available as an MCP server. Plug it into Claude or any AI assistant, query it conversationally ("which usage-based companies in dev tools offer rollover credits?"), and get structured answers backed by real data.

I built this because I needed it for my own work on Tanso, and had been maintaining similar systems manually for years. It turned out to be useful enough that keeping it private didn't make sense. I use Obsidian when running this locally and added a UI layer so it's easier for anyone to access.

If you work in pricing, product, or investing and want synthesis reports as we publish them, there's a newsletter signup on the site. We'll send updates when new companies are added or when we spot interesting pricing changes.

Check it out: [data.tansohq.com](https://data.tansohq.com)

Let me know what you think, or if there are companies or dimensions you'd like to see. The dataset grows based on what people actually find useful.
