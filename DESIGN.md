---
name: Kat Laszlo
description: Personal site and blog. Minimal, typographic, monochrome with one accent.
colors:
  primary: "#0a0a0a"
  secondary: "#666666"
  tertiary: "#4f46e5"
  neutral: "#ffffff"
  neutral-muted: "#f4f4f5"
  border: "#e4e4e7"
  success: "#16a34a"
  warning: "#d97706"
  error: "#dc2626"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    letterSpacing: -0.5px
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 700
    letterSpacing: -0.3px
  h3:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 700
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    lineHeight: 1.7
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    lineHeight: 1.6
  label:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
  code:
    fontFamily: ui-monospace, SF Mono, Menlo, Cascadia Code, monospace
    fontSize: 0.6875rem
rounded:
  sm: 4px
  md: 6px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "#111111"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: 6px 14px
  button-primary-hover:
    backgroundColor: "#333333"
  button-outline:
    backgroundColor: "#ffffff"
    textColor: "#52525b"
    rounded: "{rounded.md}"
    padding: 6px 14px
  button-outline-hover:
    textColor: "{colors.primary}"
  link:
    textColor: "{colors.tertiary}"
  link-hover:
    textColor: "{colors.tertiary}"
  nav-link:
    textColor: "{colors.secondary}"
    fontSize: 0.875rem
  nav-link-hover:
    textColor: "{colors.primary}"
  series-label:
    textColor: "#6b7280"
    fontSize: 0.8125rem
    fontWeight: 500
  share-icon:
    textColor: "#9ca3af"
  share-icon-hover:
    textColor: "{colors.primary}"
---

## Overview

Minimal, typographic, monochrome with one indigo accent. The site should feel like a well-formatted document, not a designed product. Content leads. Decoration is almost entirely absent. The accent color is used sparingly for interactive elements and links only.

## Colors

Black and white with one accent. That's the whole palette.

- **Primary (#0a0a0a):** Near-black for headlines and body text.
- **Secondary (#666666):** Gray for metadata, dates, captions, dimmed text.
- **Tertiary (#4f46e5):** Indigo. The only color. Used for links and interactive states. Nothing else.
- **Neutral (#ffffff):** White background. No off-whites, no warm tones.
- **Neutral-muted (#f4f4f5):** Light gray for code blocks and inset backgrounds.
- **Border (#e4e4e7):** Zinc-200. Separators, card borders, horizontal rules.
- **Success/Warning/Error:** Standard greens, ambers, reds. Used only in data visualizations and status indicators, never decoratively.

The accent should feel earned. If everything is indigo, nothing is. Reserve it for links and CTAs.

## Typography

Inter everywhere. No display font, no serif, no variety. The hierarchy comes from weight and size, not font switching.

- **Headings:** Inter 700. H1 at 2rem with tight letter-spacing (-0.5px). H2 at 1.5rem. H3 at 1rem.
- **Body:** Inter 400 at 15px (0.9375rem). Line height 1.7 for comfortable reading.
- **Labels/Meta:** Inter 500 at 13px (0.8125rem). Used for dates, series labels, nav links, button text.
- **Code:** System monospace stack (ui-monospace, SF Mono, Menlo). 11px in code blocks.

Load Inter from Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

## Layout

Single column, max-width 680px for blog content. No sidebar, no multi-column layouts. Content is centered with generous horizontal padding.

- **Nav:** Name left, links right. Simple flex row.
- **Blog posts:** Title, series label (if applicable), author/date + share icons on one line, separator, then content.
- **Homepage:** Stacked sections with full-width separators between them.
- **Spacing between sections:** 3rem (48px) minimum.

## Shapes

Minimal border-radius. 4px for small elements (code spans, tags). 6px for buttons and inputs. 12px for modals and cards. Never fully rounded (no pill shapes).

## Components

### Buttons
Two styles only:
- **Primary:** Black background (#111), white text, 6px radius. Hover lightens to #333.
- **Outline:** White background, 1px border (#e4e4e7), gray text (#52525b). Hover changes border to accent.

Subscribe button in nav uses primary style.

### Links
In article body: indigo (#4f46e5), no underline. Underline on hover. No bold, no other decoration.

In navigation: gray (#666), no underline. Darken on hover.

### Share icons
Gray (#9ca3af) by default. Darken to near-black on hover. 16px SVG icons. No borders, no backgrounds.

### Code blocks
Light gray background (#f4f4f5). 1px border (#e4e4e7). 4px radius. Copy button in top-right corner.

### Tables
Full-width within content column. Thin borders (#e4e4e7). Left-aligned text. No zebra striping. Header row is bold.

## Data Visualizations

When creating charts, diagrams, or visual data for blog posts:

- **Use the existing palette.** Primary (#0a0a0a) for text and axes. Secondary (#666666) for grid lines and labels. Tertiary (#4f46e5) for the primary data series. Border (#e4e4e7) for chart borders and backgrounds.
- **Additional data series:** Use success (#16a34a), warning (#d97706), error (#dc2626) for second, third, and fourth series. Never introduce colors outside this palette.
- **Style:** Clean, minimal. No gradients, no shadows, no 3D effects. Thin lines (1-2px). Labels in Inter 13px.
- **Format:** SVG preferred for inline charts. PNG for complex visualizations at 2x resolution.
- **White background.** Charts should blend seamlessly with the page.

## Blog Visuals

Blog posts should break up long text with visuals every 3-4 sections. Types of visuals to use:

- **Comparison tables.** Already styled in markdown. Use for before/after, feature comparisons, scoring matrices.
- **Inline SVG charts.** Bar charts, simple line charts, or percentage bars rendered as inline SVGs. Use the data visualization palette above. Keep charts narrow (max 680px) to match content width.
- **Funnel diagrams.** For posts about conversion or buyer journeys. Vertical stack of labeled stages, narrowing width. Primary (#0a0a0a) text, border (#e4e4e7) lines, accent (#4f46e5) for the highlighted stage.
- **Step-by-step flows.** Numbered steps connected by thin vertical lines. Each step has a bold label and one-line description. Like a vertical timeline.
- **Callout boxes.** Light gray background (#f4f4f5), 1px left border in accent (#4f46e5), 12px left padding. For key stats, pull quotes, or "bottom line" summaries. Use sparingly (max 2 per post).
- **Stat highlights.** Large number (2rem, bold) with a one-line label below in secondary (#666666). Inline, not in a colored box. Use when a single number is the point.

Never use: stock images, AI-generated illustrations, decorative icons, colored backgrounds behind sections, or screenshots unless showing an actual product UI.

OG images: 1200x630 SVG. White background, indigo top stripe (6px), title in Inter 700, author and domain in gray at bottom. See `blog/og/` for examples.

## Notebook Visuals

The notebook is for learning-in-progress. Visuals should feel like working notes, not polished publications.

- **Code snippets with annotations.** Code block with a one-line comment above explaining what to notice.
- **Before/after comparisons.** Two code blocks or two outputs side by side (or stacked on mobile). Label each with a bold "Before:" / "After:" above.
- **Diagrams.** Simple box-and-arrow diagrams as inline SVGs. Monochrome (primary + border colors only). No accent color in notebook diagrams unless highlighting a specific element.
- **Terminal output.** Styled as code blocks with the monospace font. Include the command that produced the output.
- **Embedded screenshots.** Only for showing actual tool output or UI. Full-width within content column, 1px border (#e4e4e7), 4px radius.

The notebook should feel rougher than the blog. No callout boxes, no stat highlights, no polished charts. If it looks too designed, it doesn't belong in the notebook.

## Do's and Don'ts

**Do:**
- Let whitespace do the work. When in doubt, add more space.
- Keep the accent rare. A page with one indigo link feels intentional. A page with ten feels noisy.
- Use typography hierarchy (size + weight) instead of color to create visual structure.
- Make tables and code blocks feel like natural parts of the page, not inserted widgets.

**Don't:**
- Add decorative elements (gradients, shadows, background patterns, illustrations).
- Use color for emphasis in body text. Bold is enough.
- Add borders or backgrounds to sections. Use whitespace to separate.
- Use more than one accent color. If a second color is needed, use a gray.
