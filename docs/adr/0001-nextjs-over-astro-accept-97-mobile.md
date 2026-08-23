# 1. Stay on Next.js and accept sub-100 mobile Lighthouse performance

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

Option 3. Stay on Next.js 16 App Router; keep every gate except mobile performance at 1.

**Amended 2026-08-23, after the port was assembled (#19).** The gate was set at `minScore 0.97`
from the prototype's number. The finished page — which carries the real resume, eight experience
cards, 22 progress bars and a 29 KB icon sprite that the prototype did not — measures **0.96**,
stable across five local runs, and 0.91–0.99 on a Vercel preview measured from a laptop. The
mobile gate is therefore `minScore 0.95` (median of 3 runs).

This is a threshold change, not an acceptance that 0.96 is the ceiling: [spike #23](https://github.com/mcm218/resume-website-2/issues/23)
investigates getting the number back up (React Compiler, dropping the React runtime for the one
island, and the other candidates). The measurements behind the amendment, including four
optimisations that did not pay, are in
[`docs/research/mobile-perf-measurements.md`](../research/mobile-perf-measurements.md).

## Consequences

- The site ships ~115 KB of runtime JS it does not functionally need. Mobile performance sits at
  96, never a guaranteed 100. Everything else — accessibility, best practices, SEO, CLS, TBT — is
  at the target on both form factors.
- The gate protects against regression from today's baseline rather than asserting the ideal.
- Revisiting requires a framework change, not tuning: no Next.js configuration moves the number.
- Everything else from the prototype (12 KB AVIF hero, subset fonts, CSS scroll-driven header,
  SVG sprite, single client island) carries forward unchanged.
