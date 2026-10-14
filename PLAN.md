# Plan — What the Folder

> Step-by-step build order. At the end of each phase: stop, review for bugs,
> cross-check against the brief, and wait for explicit approval before continuing.
> Do not proceed until a commit has been made.

## How This Plan Works
- Each phase is broken into small, focused tasks.
- After every phase: (1) review all code for bugs, (2) cross-check against the brief,
  (3) surface issues or decisions, (4) **wait for approval before the next phase**.
- Never commit `.env` files. Document every variable in `.env.example`.

---

## Phase 0 — Decisions & Keys
**Goal:** Resolve the open decisions so the build never stalls on them.

- [x] Pick the project name — **"What the Folder"** (decided 2026-10-12); repo/folder rename still pending
- [ ] Collect the team-real folder names for the seed list (aim: 10–12 real + 12–14 fun generics)
- [ ] Decide distribution: public link vs internal-only
- [ ] Create the Google AI Studio API key; confirm it generates images
- [ ] Decide key ownership: shared team key in Vercel env (recommended) vs bring-your-own

### Phase 0 Review Checklist
- [ ] Name decided and reflected in the brief
- [ ] Seed name list written down (even if rough)
- [ ] `GEMINI_API_KEY` obtained and tested once (a single manual generation)

### Phase 0 Commit
- [ ] Commit: `git commit -m "chore: phase 0 — decisions and keys"`

> ⏸️ **STOP — Confirm before starting Phase 1.**

---

## Phase 1 — Scaffold
**Goal:** Clean, working base: Vue 3 + Vite frontend with Vercel serverless functions.

- [ ] `git init`; write `.gitignore` first (must include `.env`, `.env*.local`, `node_modules/`, `dist/`, `.DS_Store`, `.vscode/`)
- [ ] Initialise Vite + Vue 3 (TypeScript optional — keep it simple if preferred)
- [ ] Create `/api/` directory for Vercel serverless functions; add `/api/health.js` returning `{ ok: true }`
- [ ] Add `.env.example` documenting `GEMINI_API_KEY`, `OPENAI_API_KEY` (optional), `FIREFLY_CLIENT_ID`, `FIREFLY_CLIENT_SECRET` (later)
- [ ] Folder structure:
  ```
  /api/            # serverless functions (generate.js, ...)
  /public/seeds/   # seed folder PNGs
  src/
  ├── assets/
  ├── components/
  ├── composables/
  ├── data/         # seeds.json manifest
  ├── pages/        # Gallery, Create, ApplyGuide
  ├── styles/
  └── utils/        # provider abstraction, prompt template
  ```
- [x] Confirm dev server runs; confirm `/api/health` responds (via `vercel dev`) — returns `{"ok":true}`

### Phase 1 Review Checklist
- [ ] Dev server clean, no console errors
- [ ] `/api/health` returns ok through `vercel dev`
- [ ] `.env.example` present; no real keys in the repo

### Phase 1 Commit
- [ ] `git commit -m "feat: phase 1 — project scaffold"`

> ⏸️ **STOP — Confirm before starting Phase 2.**

---

## Phase 2 — Design Tokens & Global Styles
**Goal:** The dark-gallery aesthetic before any feature UI.

- [x] Color tokens: near-black background scale, surface, text, accent (one playful accent color)
- [x] Typography: one distinctive display face for headings/microcopy + clean body face
- [x] Spacing scale (8px base), radius tokens, transition tokens (250–350ms ease-in-out)
- [x] Global styles: background, selection color, focus-visible rings, scrollbar styling
- [x] Empty-state and button primitives (primary / ghost)

### Phase 2 Review Checklist
- [x] Tokens match the brief's dark-gallery direction
- [x] No hardcoded colors/spacing outside tokens — audited by grep; only 1px hairlines
      and scrollbar internals remain as literals
- [x] Focus states visible — ring verified visible on near-black; see the caveat in the log

### Phase 2 Commit
- [ ] `git commit -m "feat: phase 2 — design tokens and global styles"`

> ⏸️ **STOP — Confirm before starting Phase 3.**

---

## Phase 3 — Seed Library
**Goal:** The gallery has something to show on day one.

- [ ] Generate the ~24 starter folder PNGs in the reference style — **BLOCKED on `GEMINI_API_KEY`.**
      Generator written and tested against a stubbed provider: `npm run seeds:generate`
- [x] Save to `public/seeds/` with clean filenames (`bar-of-gold.png`, …) — 24 placeholder PNGs
- [x] Write `src/data/seeds.json` manifest: `{ name, file, tags[], group, placeholder }` per seed
- [x] Composable `useSeeds()` exposing the list + search filter

### Phase 3 Review Checklist
- [x] Every seed keeps the folder tab readable at small sizes — checked on a 64px contact sheet
- [ ] Style feels like one family, not random images — **cannot be judged until real art exists**
- [x] Manifest loads with no missing files — all 24 verified present

### Phase 3 Commit
- [ ] `git commit -m "feat: phase 3 — seed library"`

> ⏸️ **STOP — Confirm before starting Phase 4.**

---

## Phase 4 — Gallery UI
**Goal:** Browse, search, preview, download.

- [ ] Gallery page: search field + responsive folder grid + prominent "create your own" tile
- [ ] Lightbox: large preview, folder name, Download PNG button, "remix this" (routes to Create with the name prefilled)
- [ ] Download works cross-browser (anchor download attribute + blob fallback)
- [ ] Empty search state ("no folders match — create your own")

### Phase 4 Review Checklist
- [ ] Grid looks intentional at mobile and desktop widths
- [ ] Downloads are full-resolution PNGs
- [ ] Keyboard navigable; images have alt text

### Phase 4 Commit
- [ ] `git commit -m "feat: phase 4 — gallery UI"`

> ⏸️ **STOP — Confirm before starting Phase 5.**

---

## Phase 5 — Generation API
**Goal:** `/api/generate` turns a name into a folder PNG, provider-abstracted.

- [ ] Provider abstraction in `/api/providers/`: `generateWithGemini(name)`, `generateWithOpenAI(name)` behind one `generate(name, provider)` interface; provider chosen by env / request param
- [ ] The house prompt template lives in one place (`src/utils/promptTemplate.js`, shared conceptually with the API) — tab + silhouette + lighting language non-negotiable
- [ ] `/api/generate` accepts `{ name, provider? }`, returns the image (or URL); keys read from env vars only
- [x] **Spike (decided 2026-10-12):** transparency via background removal. Because the prompt template mandates a pure-black background, a flood-fill keying pass on near-black pixels reliably produces clean transparent PNGs — verified on the waffle sample: crisp edges, bite crumbs preserved, tab intact. Seeds get this treatment at build time; runtime generations get it inside `/api/generate` before the PNG is returned. No ML segmentation needed.
- [ ] Error mapping: quota / invalid key / provider outage → clean JSON errors the UI can show

### Phase 5 Review Checklist
- [ ] Manual test: "bar of gold" returns a folder-with-tab image
- [ ] Manual test: an abstract name ("strategy") returns something intentional, not broken
- [ ] Transparency approach decided and documented
- [ ] No keys leak to the browser (check network tab)

### Phase 5 Commit
- [ ] `git commit -m "feat: phase 5 — generation API"`

> ⏸️ **STOP — Confirm before starting Phase 6.**

---

## Phase 6 — Create-Your-Own Flow
**Goal:** The magic moment, end to end.

- [ ] Create view: big type field (autofocused), folder preview area
- [ ] Generation theater: staged playful status lines ("asking the folder what it wants to be…"), never a bare spinner; cancel option
- [ ] Result actions: Download PNG, Copy to clipboard (with fallback), Regenerate
- [ ] Clean filenames: a `slugify` util turning the folder name into a safe `.png` filename (lowercase, spaces to hyphens, strip specials, collapse repeats; fallback `custom-folder.png`); edge cases tested (empty string, unicode, very long names)
- [ ] Inline apply instructions beneath the result actions: compact 3 steps with a "show me" expander; auto-expands on first download via a localStorage flag, stays collapsed after
- [ ] Loading / error / empty states for each step; rate-limit the button while generating
- [ ] Wire provider default (Nano Banana) with OpenAI selectable if its key is present

### Phase 6 Review Checklist
- [ ] Full loop works: type → theater → result → download/copy/regenerate
- [ ] Clipboard copy verified in Chrome and Safari
- [ ] Errors show human messages, not stack traces

### Phase 6 Commit
- [ ] `git commit -m "feat: phase 6 — create-your-own flow"`

> ⏸️ **STOP — Confirm before starting Phase 7.**

---

## Phase 7 — Apply Guide, Settings, Polish
**Goal:** Close the last mile to the desktop and tidy up.

- [ ] Apply guide page: 3 illustrated steps — download the PNG → Get Info on the folder (⌘I) → drag the PNG onto the little icon at the top of the window. Document the copy/paste fallback too (open in Preview → ⌘A → ⌘C → click the icon well → ⌘V), plus "remove it" (click icon → Delete).
- [ ] Settings (minimal): provider indicator, key status (set / missing), link to brief for key setup
- [ ] Microcopy pass: playful, plain language, no jargon
- [ ] Favicon, page title, meta description, OG image (a grid of folders)

### Phase 7 Review Checklist
- [ ] A non-technical teammate could follow the apply guide
- [ ] No dead ends: every view links somewhere sensible

### Phase 7 Commit
- [ ] `git commit -m "feat: phase 7 — apply guide, settings, polish"`

> ⏸️ **STOP — Confirm before starting Phase 8.**

---

## Phase 8 — Accessibility & Final Review
**Goal:** Production-ready, no loose ends.

- [ ] Keyboard walkthrough of every view; visible focus everywhere
- [ ] Alt text / aria-labels on all imagery; form inputs labeled
- [ ] Contrast check on the dark theme (text over near-black)
- [ ] Remove debug code; `npm run build` clean
- [ ] `.env.example` accurate; no secrets in git history (`git log -p -- .env*` to verify)

### Phase 8 Review Checklist
- [ ] Build passes with no errors or warnings
- [ ] No secrets committed, verified in history

### Phase 8 Commit
- [ ] `git commit -m "fix: phase 8 — accessibility and final review"`

> ⏸️ **STOP — Confirm before starting Phase 9.**

---

## Phase 9 — Deploy on Vercel
**Goal:** Live link the team can open.

- [ ] Push repo to GitHub
- [ ] Import into Vercel; set env vars (`GEMINI_API_KEY`, plus `OPENAI_API_KEY` if used)
- [ ] Set the serverless function region/timeout sensibly (generation can take 10–30s)
- [ ] Smoke test production: gallery loads, generation works end to end, downloads work
- [ ] Share the link in Slack with the apply guide

### Phase 9 Review Checklist
- [ ] Production generation succeeds with the team key
- [ ] Cold-start latency is acceptable

### Phase 9 Commit
- [ ] `git commit -m "chore: phase 9 — production deploy"`

> ✅ **Build complete. Share the link and watch the screenshots roll in.**

---

## Later / Out of Scope for v0
- Firefly provider via `/api/firefly` proxy (needs `FIREFLY_CLIENT_ID` + `FIREFLY_CLIENT_SECRET` in env)
- Teammate seed submissions ("make me a ___ folder" inbox)
- Internal-only gating if the public link proves too open
- Bring-your-own-key mode (if shared-key spend becomes an issue)

## Deviations and Decisions Log
- **2026-10-14 — Phase 3 blocked, then worked around:** `GEMINI_API_KEY` is absent from the
  shell, from every `.env`, and from the Vercel project, so no real seed art could be generated.
  Rather than stall, the phase shipped everything around the images: a 24-name seed list,
  `npm run seeds:placeholder` (folder-silhouette stand-ins so Phase 4 can proceed), the manifest,
  and `useSeeds()`. Run `npm run seeds:generate` once the key exists — it overwrites the PNGs and
  flips every `placeholder` flag to `false`.
- **2026-10-14 — Phase 3 seed names:** 14 fun generics are final. The other 10 are *proposed*
  everyday work names standing in for the team-real list (Phase 0, still open). Edit
  `scripts/seed-names.mjs` and re-run the generator; nothing else needs touching.
- **2026-10-14 — Phase 5 work landed early:** the keying pass (`lib/keyOutBackground.js`) and the
  house prompt template (`src/utils/promptTemplate.js`) were needed by the seed generator, so they
  exist now. `/api/generate` imports the same two modules in Phase 5 — one pipeline, not two.
  Keying is flood-fill-from-the-border rather than a plain luminance threshold, which is what
  preserves dark detail *inside* a subject; verified on a synthetic case with a pure-black slot.
- **2026-10-14 — Phase 6 work landed early:** `src/utils/slugify.js` was needed for seed
  filenames. All brief-specified cases pass, plus unicode, emoji and 100-char input. Known
  limitation: an all-CJK name slugifies to `custom-folder`, acceptable for an English-language
  internal tool.
- **2026-10-14 — Search behaviour:** `useSeeds()` matches substrings across name and tags, so
  "camer" finds the camera. Side effect: "gold" also returns the waffle and the toast, both
  tagged `golden`. Forgiving beats strict at this gallery size — revisit if the library grows.
- **2026-10-12 — Phase 2 type:** Instrument Serif (display/microcopy) + Inter (body),
  self-hosted via `@fontsource` rather than a Google Fonts CDN link — no runtime third-party
  request, and the woff2 files get fingerprinted by Vite.
- **2026-10-12 — Phase 2 accent:** warm gold `#ffc24b`, picked to echo the "bar of gold" seed.
  12.4:1 on the near-black background. One gold moment per view (primary button, active nav).
- **2026-10-12 — Phase 2 contrast:** `--c-text-faint` was going to be `#6b7177` but it measured
  4.04:1, under AA. Lifted to `#7d838a` (5.21:1 on `--c-bg`, 4.61:1 on `--c-surface-2`).
- **2026-10-12 — Phase 2 addition (not in the plan):** a `/styleguide` route rendering every
  token, button variant and the empty state. Added to make this phase reviewable; it is also a
  working reference for later phases. Drop it before launch if it is not wanted.
- **2026-10-12 — Phase 2 verification gap:** the focus ring was confirmed by forcing
  `--focus-ring` and screenshotting it, plus asserting the `:focus-visible` rule resolves.
  A real Tab-key pass was not possible — CDP-driven `.focus()` is not a trusted interaction, so
  `:focus-visible` never matches under automation. Phase 8's keyboard walkthrough covers this.
- **2026-10-12 — Name:** "What the Folder" (from the brief's candidate list). Applied to
  `package.json` (`what-the-folder`), the page `<title>`, and the brief/plan headings.
  Local directory renamed to `~/what-the-folder`. **The GitHub repo is still
  `dvekaria-ai/Folder-studio`** — renaming it needs the GitHub UI (Settings → Repository name);
  GitHub redirects the old URL, so the existing `origin` keeps working either way.
- **2026-10-12 — Phase order:** Phase 1 (scaffold) was built before Phase 0 was fully closed,
  at the user's request. Phase 0 items still open: seed name list, distribution, `GEMINI_API_KEY`,
  key ownership.
- **2026-10-12 — Vercel project linked:** `vercel dev` created and linked a Vercel project named
  `what-the-folder` (ids in `.vercel/project.json`, gitignored). Phase 9 can import into this
  project rather than making a new one; env vars still need setting there.
