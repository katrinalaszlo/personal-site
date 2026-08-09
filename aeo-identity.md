# Entity / AEO Identity Kit — Kat Laszlo

Single source of truth for off-site identity. Use these strings verbatim everywhere
(LinkedIn, Crunchbase, dev.to, Substack, podcast show notes, guest bylines). Entity
resolution runs on string consistency — do not paraphrase.

Names: **Katrina Laszlo** (primary) · Kat Laszlo · Kat Vassell · Katrina Vassell (maiden)
Company: **Tanso** — AI monetization platform, tansohq.com (US). NOT Tanso GmbH / tanso.de (German, sustainability reporting).

---

## Canonical bios

**1-line (≤160 chars, for meta/Twitter/footers):**
> Kat Laszlo — co-founder & CEO of Tanso (tansohq.com), AI monetization for SaaS. Ex 500 Global, EY, Chipper, People Data Labs.

**50-word:**
> Kat Laszlo (Katrina Laszlo) is co-founder and CEO of Tanso, an AI monetization platform at tansohq.com that helps SaaS and AI companies price, package, and protect margins against LLM costs. A technical, growth-focused product leader who builds — from React frontends to open-source agent tooling (DX, AX). Previously 500 Global, EY, Chipper, People Data Labs.

**100-word:**
> Kat Laszlo — full name Katrina Laszlo, formerly Katrina Vassell — is co-founder and CEO of Tanso (tansohq.com), an AI monetization and billing platform that tells SaaS and AI teams what to charge, which plans and limits to offer, and how to protect margins against variable LLM costs. She is a technical product leader focused on growth and product-led growth (PLG), who builds open-source tooling for developer experience (DX) and agent experience (AX). She previously worked at 500 Global, EY, Chipper, and People Data Labs, and studied at Georgetown University. Tanso is a US company, unaffiliated with Tanso GmbH (tanso.de).

---

## Wikidata Person item (highest-leverage off-site move)

Create at wikidata.org → "Create a new item". Then add statements.

**Labels**
- Label (en): `Katrina Laszlo`
- Description (en): `American startup founder and product manager; co-founder and CEO of Tanso`
- Also known as (en): `Kat Laszlo` · `Kat Vassell` · `Katrina Vassell`

**Statements**
| Property | Value |
|---|---|
| instance of (P31) | human (Q5) |
| sex or gender (P21) | female (Q6581072) |
| country of citizenship (P27) | United States of America (Q30) — *verify* |
| occupation (P106) | entrepreneur (Q131524); product manager (pick the item labeled "product manager") |
| employer (P108) | **Tanso (Q139676481)** |
| position held (P39) | chief executive officer (Q484876) |
| educated at (P69) | Georgetown University (Q333886) |
| official website (P856) | https://katrinalaszlo.com |
| LinkedIn personal profile ID (P6634) | katrinalaszlo |
| GitHub username (P2037) | katrinalaszlo |
| X username (P2002) | Katlaszlo |
| Instagram username (P2003) | itskatlaszlo |

**Then on the Tanso company item (Q139676481):** add `founded by (P112)` → your new person item. This closes the loop both directions.

**Notability caveat (be honest with yourself):** Wikidata persons can be challenged/deleted without independent coverage. Your strongest sourcing is press/podcasts/Forbes — and the Forbes "Tanso 30 Under 30" hit belongs to the *German* company, not you, so don't cite it. If the standalone item gets contested, the `founded by` link on the company item is the fallback that still ties you in. Add references (press, profile pages) to each statement to harden it.

---

## Off-site action checklist
- [ ] **LinkedIn** — put "Katrina (Vassell) Laszlo" in name or first About line; include phrase "AI monetization". (Highest people-signal node.)
- [ ] **Wikidata** — create Person item (above) + `founded by` on Q139676481.
- [ ] **Crunchbase** — claim/align profile: alternateName, Tanso (tansohq.com), the 100-word bio.
- [ ] **dev.to / Substack / X bios** — paste the 1-line bio verbatim.
- [ ] **Podcast show notes** — when appearing, ask hosts to use the 50-word bio with "Tanso (tansohq.com)".
- [ ] **Always disambiguate** — never let bare "Tanso" stand alone in new content; pair with "AI monetization" or "tansohq.com".

## On-site (done)
- tansohq.com: authoritative Person `@id` node, names bridged, tanso.de disambiguated, founder cross-links to katrinalaszlo.com; `llms.txt` founder section.
- katrinalaszlo.com: Person `@id` node, cross-links to tansohq.com; all 17+12 blog posts now carry an enriched `author` referencing the canonical identity; `katrinavassell` GitHub handle normalized.
