# michaelcmuniz.com

Single-page resume for Michael Muñiz, rendered from one resume document and filterable by skill.
Fully static Next.js site on Vercel. Vocabulary is in [`CONTEXT.md`](CONTEXT.md); the implementation
spec is [`docs/specs/nextjs-port.md`](docs/specs/nextjs-port.md).

## Stack

- Next.js 16 (App Router, TypeScript, static prerender — plain `next build`, not `output: 'export'`)
- Tailwind v4 (`@theme inline` tokens in `src/app/globals.css`)
- pnpm 11 with a committed `pnpm-lock.yaml`, Node 24
- Vitest for unit tests, ESLint (`eslint-config-next`)
- `@vercel/analytics`; nothing else runs in the browser

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build

```bash
pnpm build        # must print "○ /" — the home route is prerendered as static content
pnpm start        # serve the production build locally
```

`pnpm typecheck` and `pnpm lint` run TypeScript and ESLint on their own. `next build` generates
`next-env.d.ts` and the route types (`LayoutProps`, `PageProps`); run it once after a fresh clone
before `pnpm typecheck`.

## Test

```bash
pnpm test         # vitest run — src/**/*.test.ts
pnpm test:watch
```

`next build` is the integration check (the static route must still be `○ /`). Lighthouse CI is the
behavioural gate (below).

## Editing resume data

The site renders one document, the **resume** (see `CONTEXT.md`): `src/data/resume.json`. It is
validated at import by the zod schema in `src/data/schema.ts`
([`docs/specs/resume-schema.md`](docs/specs/resume-schema.md)):

- dates are `YYYY-MM`; `end: null` means Present; `end` requires `start`
- every experience item lists skills by their registry id (`src/data/skills.ts`)
- notes are plain text; `links` are optional `{ label, url }` pairs
- skill blocks carry a `level` from 1 to 10; set `skill` to reuse a registry name
- items render in document order

A bad date or unknown skill id fails `pnpm test` and `pnpm build`.

## Fonts

`src/app/fonts.ts` loads three Latin-subset Montserrat weights with `next/font/local` from
`src/app/fonts/`. Only weight 200 (the h1/h2 above the fold) is preloaded; 300/400 load on demand.
The upstream faces are Google Fonts Montserrat (the old Angular `src/assets/Montserrat/` copies went
with the Angular tree); the subsets in `src/app/fonts/` were produced from them with fonttools:

```bash
uvx --with brotli --from fonttools pyftsubset Montserrat-ExtraLight.ttf --unicodes="U+0000-00FF,U+2000-206F,U+2C60-2C7F" --layout-features="*" --flavor=woff2 --output-file=src/app/fonts/Montserrat-ExtraLight.subset.woff2
```

## Hero

`src/components/hero-background.tsx` builds a real `<picture>` from `getImageProps`: the desktop
source (`src/assets/hero-desktop.jpg`, 2400×1350) at quality 60 above 600px, the phone `<img>`
(`hero-phone.jpg`, 2400×3000) at quality 55 below it, `sizes="100vw"`, eager with
`fetchPriority="high"` and deliberately no `<link rel=preload>` — the candidate depends on the
viewport. On a local mobile Lighthouse run the LCP element is that `<img>` at ~11 KB AVIF with CLS 0.

## Styling

Tailwind v4. Design tokens live in `@theme inline` in `src/app/globals.css`; element defaults sit in
`@layer base` so utility classes still win over them — unlayered base rules quietly beat every
utility, which is what made the header's `p-0` a no-op. Component-level rules that must override
utilities (the scroll-driven header, the filter's dimming, the mobile section rules) stay unlayered
on purpose.

## Icons

Every icon is defined once as an SVG `<symbol>` in `src/components/icon-sprite.tsx`; everything else
references it with `<use href="#i-<icon id>">`. No icon code runs in the browser.

- `src/components/icons.generated.tsx` — FontAwesome glyphs, written by `pnpm gen:icons`
  (`scripts/gen-icons.mjs`). Do not edit by hand. `@fortawesome/*` are devDependencies and never
  reach the client bundle.
- `src/components/icons.hand.tsx` — the eight glyphs FontAwesome does not carry, hand-extracted from
  the old Angular `svg-renderer`.
- `src/components/icons.ts` — merges both into `ICONS`, keyed by icon id. Skills reach their icon
  through `SKILLS[id].icon` (`src/data/skills.ts`).

Adding a FontAwesome icon: add it to `WANTED` in `scripts/gen-icons.mjs`, run `pnpm gen:icons`,
commit the regenerated file.

## Lighthouse CI

Target for `/`: desktop 100/100/100/100, mobile ≥ 97 performance and 100 elsewhere
([ADR 0001](docs/adr/0001-nextjs-over-astro-accept-97-mobile.md)).

Not wired up yet. The Lighthouse ticket adds `.github/workflows/lighthouse.yml`, which runs
`treosh/lighthouse-ci-action` against each Vercel preview deployment (`on: deployment_status`) with
`lighthouserc.mobile.json` and `lighthouserc.desktop.json`, and can be run by hand with
`workflow_dispatch` and a `url` input. Details in
[`docs/specs/nextjs-port.md`](docs/specs/nextjs-port.md#lighthouse-ci).

## Deploy

Vercel project `resume-website-2` (scope `michaels-projects-067ad399`), GitHub integration on `main`.
Every branch gets a preview at `resume-website-2-git-<branch>-michaels-projects-067ad399.vercel.app`.
Manual deploys: `vercel` (preview) / `vercel --prod`.

## Cutover

Moving `michaelcmuniz.com` from Fly to Vercel, and decommissioning Fly, Turso, Clerk and Sentry, is
described step by step in the **Cutover** section of
[`docs/specs/nextjs-port.md`](docs/specs/nextjs-port.md#cutover-after-the-port-pr-merges).
