# Project Brief — Folder Studio (working title)

## Overview
An internal website for the design team that turns Mac folder names into folder icons that look like what they're named. A folder called "bar of gold" becomes a gold bar that still reads as a folder. Part gallery of ready-made designs, part AI generator: type any name, watch the folder become it, download the PNG, paste it onto a real folder through Finder's Get Info.

## Inspiration
Gabi Duncombe (Senior Design Manager, Adobe Premiere) built an internal version for her design team and posted it on LinkedIn: a gallery of object-folders plus a "create your own" flow where you type a name ("bar of gold"), the site shows "asking the folder what it wants to be..." while generating, then offers download / copy / regenerate.

## Users
- **Primary:** the design team. Visually sophisticated, high craft bar. They will notice a wrong tab or an inconsistent style.
- **Secondary:** anyone who sees the screenshots. The product should be photogenic; showing off is the distribution channel.

## Core concept
Two parts:
1. **Gallery** — a grid of ready-made folder designs. Browse, search, click to download the PNG.
2. **Create your own** — type any folder name → generation theater → AI-drawn folder → download, copy to clipboard, or regenerate. True open generation: whatever is typed gets interpreted, including abstract names. The surprise of what "strategy" becomes is part of the fun.

## Design principles
1. **The tab is sacred.** The folder tab silhouette must survive every transformation. Lose the tab, lose the folder.
2. **Theater over spinners.** Generation latency becomes a moment ("asking the folder what it wants to be..."), not a loading bar.
3. **One-click to desktop.** The distance from "I love it" to "it's on my folder" must be tiny: download PNG, copy to clipboard, dead-simple apply guide.
4. **One family.** Every design, seeded or generated, shares one rendering language (studio lighting, folder-with-tab silhouette, dark presentation). The prompt template is the design system for AI output.
5. **Built for showing off.** Screenshots are the distribution strategy. The gallery and results should look great captured.

## Design style
Dark, gallery-like presentation: near-black background, folders floating in a generous grid, echoing the reference screenshots. Playful microcopy throughout. The generation moment gets the most theatrical treatment on the page. Custom CSS, no UI library — the aesthetic is bespoke.

## Layout
- **Gallery (home):** search field + folder grid + prominent "create your own" tile.
- **Create view:** big type field, folder preview area, generation theater state, result actions (download / copy / regenerate).
- **Detail / lightbox:** click a gallery folder → large preview + download + "remix this" (sends its name into the create view).
- **Apply guide:** short illustrated steps for putting the PNG on a real folder: download → Get Info (⌘I) → drag the PNG onto the little icon at the top of the window. (Drag-and-drop skips the clipboard entirely; copy/paste via Preview is the documented fallback.)
- **Settings (minimal):** provider indicator. Keys live in server env vars, so most teammates never see this screen.

## Key flows
1. Browse → search "gold" → click bar-of-gold → download PNG → follow apply guide → folder transformed.
2. Create → type "strategy meeting" → theater → result → regenerate twice → copy to clipboard → paste into Get Info.
3. Share → screenshot → Slack → teammates visit the link.

## Interactions
- Smooth, subtle transitions, 250–350ms, `ease-in-out`.
- The generation theater: staged playful status lines, never a bare spinner.
- Download and copy give immediate tactile feedback (toast / state change).
- Keyboard accessible throughout; the type field is autofocused in create view.

## Download & Apply UX
**Clean filenames.** Every download is named from the folder name, slugified: lowercase, spaces become hyphens, special characters stripped, repeats collapsed. "Bar of Gold!" → `bar-of-gold.png`. "Q3 Planning (final)" → `q3-planning-final.png`. If nothing survives sanitizing, fall back to `custom-folder.png`. The browser chooses the destination (usually ~/Downloads) — we own the name, not the location.

**Apply instructions ship with the product, not as a separate doc.** Two surfaces:
1. **Inline:** beneath every download/copy button, a compact 3-step ("Download → ⌘I on your folder → drag the PNG onto the icon") with a "show me" expander. Auto-expands once on the user's first download (localStorage flag), then stays collapsed.
2. **Guide page:** the illustrated version — same 3 steps with screenshots, the copy/paste fallback (Preview → ⌘A → ⌘C → click icon well → ⌘V), and how to remove an icon (click it → Delete).

## The prompt template (house style)
Every generation wraps the user's words in a fixed template. This is the design system for AI output:

> "A macOS folder icon redesigned to look like {name}: keep the classic folder silhouette with the small tab at the top edge, render the folder body as {name}, soft studio lighting, centered on a solid pure black (#000000) background, square icon, high detail."

The pure-black background is functional, not just aesthetic: it makes background removal reliable (see transparency pipeline below).

Per-provider tuning is allowed, but the tab + silhouette + lighting language is non-negotiable.

## Seed library
- Lives in `public/seeds/` as PNG files plus a `src/data/seeds.json` manifest (name, file, tags).
- Starter set (~24): a mix of fun generics (bar of gold, waffle, floppy disk, toast, camera…) and team-real names (to be supplied by the team).
- Mini generates the starter set in the reference style.

## Tech stack
| Layer | Technology |
|---|---|
| Framework | Vue 3 + Vite (the team's proven stack; no UI library, custom CSS) |
| Hosting | Vercel (static frontend + serverless functions) |
| API layer | Vercel serverless functions in `/api/` — the browser calls `/api/generate`, the function attaches the key from env vars. Teammates never handle keys. |
| Default provider | Nano Banana (`gemini-2.5-flash-image`) via Google AI Studio key — fast, cheap, strong at stylistic consistency |
| Alt provider | OpenAI `gpt-image-1` |
| Future provider | Adobe Firefly Services via `/api/firefly` proxy (OAuth server-to-server needs the secret server-side) |

## APIs and keys needed
| # | What | Where to get it | Env var | Needed when |
|---|---|---|---|---|
| 1 | Google AI Studio API key (Gemini) | aistudio.google.com → Get API key | `GEMINI_API_KEY` | v0 — default provider |
| 2 | OpenAI API key | platform.openai.com/api-keys | `OPENAI_API_KEY` | v1 — alt provider (optional) |
| 3 | Adobe Firefly Services OAuth server-to-server credentials (client ID + secret) | Adobe Developer Console → project → Firefly API → OAuth Server-to-Server | `FIREFLY_CLIENT_ID`, `FIREFLY_CLIENT_SECRET` | Later — only if Firefly is wanted |

## Non-goals
- No macOS app, no Finder integration, no watching renames.
- No accounts, no login, no database. The gallery is a static manifest.
- No true access control in v0 (link = access). Internal-only gating is a later decision.

## Open decisions
- **Name.** Working title "Folder Studio". Candidates: Folderplay, The Folder Foundry, Unfolder, What the Folder.
- **Seed mix.** Exact list of team-real folder names (needed from the team).
- **Distribution.** Public link vs internal-only.
- **Key ownership.** Shared team key in Vercel env (recommended) vs bring-your-own.

## Success criteria
- Teammates actually change their folder icons (adoption, not visits).
- Screenshots appear in Slack unprompted.
- Teammates request new seeds ("make me a ___ folder"). Demand for more is the signal.
