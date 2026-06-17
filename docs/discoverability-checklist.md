# AI / Search Discoverability Checklist

Goal: when someone asks an AI assistant about **Kat Laszlo, Katrina Laszlo, Kat Vassell, or
Katrina Vassell**, it resolves all four names to one person and surfaces accurate info.

AI answers name queries by searching the live web, so the game is consistent, corroborating,
authoritative sources that all point back to katrinalaszlo.com. Keep the name treatment
identical everywhere (that consistency is what merges the records into one entity).

## Done
- [x] Site: all four name variants in `public/index.html` (hero text + JSON-LD `alternateName`), `index.md`, `llms.txt`, `llms-full.txt`, `agents.json`
- [x] LinkedIn: additional name set to Vassell (visibility = all members)
- [x] GitHub `katrinalaszlo` profile name = "Katrina (Vassell) Laszlo"

## To do (priority order)

### 1. Backlinks from sources you control (highest ROI)
- [ ] **tansohq.com team/about page** — add bio + link to katrinalaszlo.com (strongest signal)
- [ ] LinkedIn → Contact info → Website → katrinalaszlo.com
- [ ] X bio → add katrinalaszlo.com
- [ ] Substack about → add katrinalaszlo.com
- [ ] dev.to → add katrinalaszlo.com
- [ ] GitHub profile → Website field → katrinalaszlo.com

### 2. Wikidata item (feeds Google Knowledge Graph + LLM retrieval; disambiguates from tanso.de)
- [ ] Create item at wikidata.org
  - Label: Katrina Laszlo
  - Description: Product and growth leader, co-founder and CEO of Tanso
  - Aliases: Kat Laszlo · Katrina Vassell · Kat Vassell
  - Statements: instance of (P31) = human; occupation (P106) = entrepreneur / product manager;
    educated at (P69) = Georgetown University; official website (P856) = https://katrinalaszlo.com;
    employer (P108) = Tanso (only if a Tanso item exists)
  - Add 2+ references (LinkedIn, Crunchbase, tansohq.com) or it risks deletion as non-notable

### 3. Crunchbase person profile
- [ ] Add person profile as Tanso founder; link website, LinkedIn, X

### 4. Confirm indexing
- [ ] Google Search Console: verify katrinalaszlo.com is indexed, submit sitemap if not
  (verification file already in repo: `public/google40e9f2898071a27f.html`)

### 5. Corroborating content (ongoing, slow)
- [ ] Podcast appearances, guest posts, quotes that mention the name and link the site

## Paste-ready copy

### Tanso team/about bio
> Katrina Laszlo is Co-Founder and CEO of Tanso, where she builds pricing, packaging, and
> consumption-based billing infrastructure for AI and B2B SaaS companies. She has spent 10 years
> in product and growth, most recently as AI product manager at Artisan and Head of Product at
> Chipper. Earlier she built the self-serve business at People Data Labs, ran corporate innovation
> engagements at 500 Global, and built fintech products at EY's innovation lab. She writes about
> agent experience and SaaS pricing at katrinalaszlo.com.

### Crunchbase bio
> Katrina Laszlo is Co-Founder and CEO of Tanso, building pricing and billing infrastructure for
> AI and B2B SaaS. Previously AI product manager at Artisan, Head of Product at Chipper, and Senior
> PM at People Data Labs, with earlier roles at 500 Global and EY. Georgetown University. Also known
> as Katrina Vassell.

### One-liners per channel (keep name treatment identical)
- LinkedIn headline: Co-Founder & CEO at Tanso · Pricing & monetization infrastructure for AI and B2B SaaS
- LinkedIn About:
  > Katrina Laszlo (Kat Laszlo), Co-Founder and CEO of Tanso.
  >
  > I build pricing, packaging, and consumption-based billing infrastructure for AI and B2B SaaS.
  >
  > Ten years in product and growth, most recently as AI PM at Artisan. Before that, Head of Product at Chipper and Senior PM at People Data Labs. Earlier roles at 500 Global and EY. Georgetown University.
  >
  > I write about agent experience and SaaS pricing at katrinalaszlo.com.
  >
  > Previously published as Katrina Vassell.
- X bio: Co-Founder/CEO @tansohq. Pricing + monetization for AI & SaaS. 10 yrs product/growth. Writing on agent UX. katrinalaszlo.com
- GitHub bio: Co-founder/CEO @tansohq · Pricing & monetization infra for AI and SaaS · katrinalaszlo.com
- Substack about: Katrina Laszlo (Kat Laszlo). Co-founder and CEO of Tanso. 10 years in product and growth, writing about pricing and building for AI agents. Formerly Katrina Vassell.
- dev.to bio: Co-founder/CEO at Tanso. Pricing and monetization for AI and SaaS. katrinalaszlo.com
- Instagram bio: Co-founder & CEO @tansohq · product + pricing · katrinalaszlo.com
