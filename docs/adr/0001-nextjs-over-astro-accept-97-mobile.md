# 1. Stay on Next.js and accept ~97 mobile Lighthouse performance

Date: 2026-08-23

## Status

Accepted

## Context

The port targets Lighthouse 100/100/100/100. The app-shell prototype
([wayfinder #7](https://github.com/mcm218/resume-website-2/issues/7)) reached 100 on desktop
and 97 performance on mobile, with the other three categories at 100 on both. The identical HTML
with every `<script>` removed scores 100 on mobile. The gap is entirely the React/Next.js
hydration runtime (~140 KB gzipped), which the App Router ships even for a page with a single
tiny client island; Lighthouse's simulated LCP charges roughly one second for it.

Options considered:

1. Next.js plus a post-build step that strips `<script>` tags from the prerendered HTML and ships
   a vanilla toolbar script. Measured 100, but unsupported on Vercel's build pipeline and fragile
   across Next upgrades.
2. Astro (islands architecture, zero JS by default). Clean path to 100; redraws the stack decision
   made when the map was charted.
3. Next.js as-is; accept ~97 mobile.

## Decision

Option 3. Stay on Next.js 16 App Router; set the mobile Lighthouse CI performance gate to
`minScore 0.97` (median of 3 runs) and keep every other gate at 1.

## Consequences

- The site ships ~140 KB of runtime JS it does not functionally need. Mobile performance will sit
  at 97–99, never a guaranteed 100.
- Revisiting requires a framework change, not tuning: no Next.js configuration moves the number.
- Everything else from the prototype (12 KB AVIF hero, subset fonts, CSS scroll-driven header,
  SVG sprite, single client island) carries forward unchanged.
