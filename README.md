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

The site renders one document, the **resume** (see `CONTEXT.md`). At this stage of the port the
legacy document still lives at `src/assets/me.json` and nothing renders it yet.

The data ticket replaces it with `src/data/resume.json`, validated at import by a zod schema
(`src/data/schema.ts`) per [`docs/specs/resume-schema.md`](docs/specs/resume-schema.md):

- dates are `YYYY-MM`; `end: null` means Present
- every experience item lists skills by their registry id (`src/data/skills.ts`)
- notes are plain text; `links` are optional `{ label, url }` pairs
- skill blocks carry a `level` from 1 to 10

Once that lands, a bad date or unknown skill id fails `pnpm test` and `pnpm build`.

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
