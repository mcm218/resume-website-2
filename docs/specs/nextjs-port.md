# Spec: Next.js port of the resume site

Map: [Wayfinder map](https://github.com/mcm218/resume-website-2/issues/3). Glossary: `CONTEXT.md`.
Decisions live in the closed tickets; this document consolidates them for implementation.

## Goal

Replace the Angular 17 + Express app with a faithful, fully static Next.js site on Vercel.
Lighthouse (lab, `/`): **desktop 100/100/100/100; mobile ≥97 perf, 100/100/100**
(see [ADR 0001](../adr/0001-nextjs-over-astro-accept-97-mobile.md)). Guarded by Lighthouse CI.

## Stack

- Next.js 16 App Router, TypeScript, static prerender (plain `next build`; **not** `output: 'export'`, which disables the image optimizer).
- Tailwind v4 (`@theme inline` tokens), pnpm with committed lockfile, Node 24.
- `next/font/local` Montserrat, Latin-subset woff2, weights 200/300/400 only; preload **only** 200.
- `@vercel/analytics` (`<Analytics />` in the root layout). No Sentry, Mixpanel, GA, Clerk, Express, Turso, prerender.io.
- Validated reference implementation: branch `prototype/app-shell`, directory `proto/` (throwaway; lift pieces, do not merge).

## Repository layout (after the port)

```
/
├── src/app/            layout.tsx, page.tsx, globals.css, fonts.ts, fonts/*.subset.woff2,
│                       opengraph-image.tsx, sitemap.ts, robots.ts, favicon.ico
├── src/components/     hero-background.tsx, site-header.tsx, filter-toolbar.tsx ('use client'),
│                       experience.tsx, skills.tsx, icon-sprite.tsx, icons.ts,
│                       icons.generated.tsx, icons.hand.tsx
├── src/data/           skills.ts, schema.ts, resume.json, resume.ts, filter.ts
├── src/assets/         hero-desktop.jpg (2400×1350), hero-phone.jpg (2400×3000)
├── scripts/gen-icons.mjs
├── lighthouserc.mobile.json, lighthouserc.desktop.json
├── .github/workflows/lighthouse.yml
├── next.config.ts, postcss.config.mjs, tsconfig.json, vitest.config.ts, package.json, pnpm-lock.yaml
├── CONTEXT.md, README.md, docs/
```

Deleted: `src/` (Angular), `api/`, `angular.json`, `karma.conf.js`, all `tsconfig*.json`, `*.tsbuildinfo`,
`Dockerfile`, `fly.toml`, `nodemon.json`, `drizzle.config.ts`, `envLoader.ts`, `bun.lockb`,
`.github/workflows/main.yml`, `.github/workflows/staging.yml`, `.eslintrc.json`, `.vscode/` (keep only if useful).

## Data

Schema per [docs/specs/resume-schema.md](./resume-schema.md): 16-skill string-id registry,
zod-validated `resume.json` parsed at import (`resume.ts`), `YYYY-MM` dates with `end: null` = Present,
document-order items, plain-text notes, optional `links`, skill blocks with `level` 1–10.
`src/assets/me.json` is hand-converted once (the prototype's `proto/src/data/resume.json` is that
conversion) and deleted.

`src/data/filter.ts` exports the pure predicate used by the toolbar:
`matches(itemSkills: SkillId[], selected: ReadonlySet<SkillId>): boolean` — true when `selected` is
empty or any item skill is selected.

## Page composition (`/`)

Server components except the toolbar. Order inside `<main class="relative isolate min-h-svh overflow-x-clip">`:

1. `IconSprite` — every icon once as `<symbol>`; all icons render as `<svg><use href="#i-…"/></svg>`.
   `scripts/gen-icons.mjs` extracts FontAwesome path data at build time (FA packages are devDependencies only).
   `icons.generated.tsx` (FontAwesome, written by `pnpm gen:icons`) and `icons.hand.tsx` each export a
   record of `{ viewBox, children }` keyed by icon id; `icons.ts` merges them into `ICONS` and derives
   `IconId`, so a skill whose `icon` is not in the sprite is a type error.
2. `HeroBackground` — `<picture>` built from `getImageProps`: desktop source `(min-width: 601px)` q60,
   phone `<img>` q55, `sizes="100vw"`, `fetchPriority="high"`, `loading="eager"`, **no** `preload`.
   `next.config.ts`: `images.formats ['image/avif','image/webp']`, `images.qualities [55,60,75]`.
3. Mobile gradient underlay: pure CSS `h-svh` div, `sm:hidden` (replaces the `screen.availHeight` JS).
4. `FilterToolbar` (client island): `useState<Set<SkillId>>`, 16 `<button aria-pressed>` chips using sprite
   icons, collapse handle with `aria-expanded`; collapsed by default when `innerWidth < 600`. Effect sets
   `data-dim` on `.xp-card` elements that fail `matches()`, and `data-expanded` on `.primary-column`.
5. `.primary-column` (flex column, gap 12.5rem, max 1920px, `pl-[102px]` when expanded):
   `SiteHeader`, one `ExperienceGroupSection` per group (alternating `self-start`/`self-end`, `bg-black/70`,
   radius token), `SkillsSection`.

### Header

Fixed header + spacer (`h-[300px] sm:h-[145px]`). Scroll-driven CSS animations, zero JS, all with
`animation-timeline: scroll(root)` and `animation-duration: auto` declared as **longhands**
(Lightning CSS rewrites the shorthand and turns `auto` into `0s`):
- `.hdr`: background transparent→black, color black→white over `0 75svh`.
- `.hdr-title`: `font-size` 4rem→2rem over `0 75svh`.
- `.hdr-fade` (subtitle, contact nav): opacity→0, visibility hidden, `max-height`→0 over `0 37svh`.
Wrapped in `@supports (animation-timeline: scroll())`; unsupported browsers keep the initial state.

### Cards and skills

`ExperienceCard` = `<article class="xp-card" data-skills="…">` with role/company, date line
(only when `start` exists), skill chips (`<li>` with sprite icon + `sr-only` name), square-bulleted notes,
optional links list. Dimmed state via `[data-dim]` CSS (white 70 %, blue 70 %, grayblue 70 %).
`SkillsSection`: `<label for>` + `<progress max=10 value=level>` per entry; registry name wins when `skill` is set.

### Tokens (`globals.css`)

`--font-sans: var(--font-montserrat-body), var(--font-montserrat), "Helvetica Neue", sans-serif`
for body text and `--font-display` with the two swapped for headings — CSS matches a weight *within*
the first family that exists, so a single stack led by the 200-only family made the 300/400 faces
unreachable (found in #13);
`--color-blue hsl(195 100% 49%)`, `--color-grayblue hsl(195 85% 80%)`, `--color-gray hsl(0 0% 50%)`,
`--radius-card 0.3rem`; body black/white; h1 4rem, h2 2rem, h3 1.5rem blue, headings weight 200
letter-spacing 0.3rem, p weight 300; mobile (`max-width: 600px`) sections lose radius and background.
Webkit scrollbar styling carried over.

## SEO / metadata

`metadataBase https://michaelcmuniz.com`, title `"<name> | Resume"`, description from contact,
`alternates.canonical '/'`, Open Graph (website, title `"<name> - <title>"`). `opengraph-image.tsx`
generated at build (name + title over the hero, 1200×630). `sitemap.ts` (single URL), `robots.ts`
(allow all, sitemap link). JSON-LD `Person` (`name`, `jobTitle`, `email`, `sameAs` [linkedin, github],
`address.addressLocality`) rendered in `page.tsx`.

## Tests

Vitest: `schema.test.ts` (parses `resume.json`; rejects a bad date and an unknown skill id),
`resume.test.ts` (`formatYearMonth`), `filter.test.ts` (`matches`: empty set, hit, miss).
`next build` is the integration check (static route `○ /`). Lighthouse CI is the behavioural gate.

## Lighthouse CI

From [research #4](https://github.com/mcm218/resume-website-2/issues/4):
- `.github/workflows/lighthouse.yml`: `on: deployment_status` (+ `workflow_dispatch` with a `url` input),
  guard `state == 'success' && startsWith(environment, 'Preview')`, URL from `environment_url`,
  matrix `[mobile, desktop]`, `treosh/lighthouse-ci-action@v12`, `uploadArtifacts: true`,
  concurrency keyed on the deployment SHA.
- `lighthouserc.mobile.json`: `numberOfRuns 3`, `skipAudits ["is-crawlable"]` (previews are `noindex`),
  `categories:performance minScore 0.97 median`, others `minScore 1 pessimistic`.
- `lighthouserc.desktop.json`: same with `settings.preset: "desktop"` and performance `minScore 1`.
- Deployment Protection is **off** on the Vercel project (no bypass header needed).
- Once on `main`, make `lighthouse (mobile)` and `lighthouse (desktop)` required checks. The port PR
  itself is verified via `workflow_dispatch` against its preview URL.

## Vercel

Project `resume-website-2`, scope `michaels-projects-067ad399`, Next.js preset, `pnpm install`,
Analytics enabled, GitHub integration on `main`. Preview pattern
`resume-website-2-git-<branch>-michaels-projects-067ad399.vercel.app`.

## Cutover (after the port PR merges)

1. Production deploys to `resume-website-2-seven.vercel.app`. Run PageSpeed Insights (mobile + desktop); require desktop 100s, mobile ≥97/100/100/100.
2. Vercel → Domains: add `michaelcmuniz.com` (primary), `www.michaelcmuniz.com` and `resume.michaelcmuniz.com` as 308 redirects to the apex.
3. Cloudflare DNS: replace the Fly records with Vercel's A (apex) / CNAME (`www`, `resume`) records, **DNS-only (grey cloud)**, SSL stays managed by Vercel.
4. Wait for propagation; PSI on `https://michaelcmuniz.com` must pass; confirm `robots`/canonical/`sitemap.xml` resolve and `X-Robots-Tag` is absent.
5. Decommission: `fly apps destroy wild-sun-3772`; delete GitHub secrets/vars `FLY_API_TOKEN`, `TURSO_TOKEN`, `TURSO_URL`, `PRERENDER_TOKEN`, `CLERK_*`, `API_URL`, `PRODUCTION`, `ENVIRONMENT_DETAILS`; delete the Turso database and Clerk application; remove the Sentry project if unused.

## Out of scope

Redesign; admin/editing UI or auth; rich-text notes; Mixpanel/Sentry Replay/GA4.
