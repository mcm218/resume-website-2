# Mobile performance: where the port actually lands

Measured on the ported site (all page tickets #10–#18 merged), against the gate
`lighthouserc.mobile.json` adds in #19: **performance ≥ 0.97 median of 3 runs**, per
[ADR 0001](../adr/0001-nextjs-over-astro-accept-97-mobile.md).

## Result

| Target | Runs | Median |
| --- | --- | --- |
| Vercel preview | 0.91, 0.99, 0.92 | **0.92** |
| Local `next start`, 5 runs | 0.96 × 5 | **0.96** |
| Desktop config (either target) | 1.00 | **1.00 — passes** |

Desktop passes its `minScore 1`. Mobile does not pass `0.97`. Locally the number is
stable at 0.96; on a preview it swings between 0.91 and 0.99, which is the preview
edge and this machine's link, not the page.

Every non-performance category is 100 (accessibility, best practices, SEO), and
CLS is 0, TBT 10–40 ms. **The whole gap is LCP**: it scores 90 at 2.5 s.

## What the 2.5 s is made of

`TTFB 453 ms · Load Delay 884 ms · Load Time 111 ms · Render Delay 1024 ms`

The image itself is not the problem — 11 KB of AVIF, transferred in 111 ms. The cost
is on either side of it: the delay before the request starts, and the paint after it
arrives. Total page weight is 242 KB: ~115 KB of JavaScript, 42 KB of fonts, 38 KB of
compressed HTML (137 KB raw, of which 29 KB is the icon sprite), 11 KB hero.

## Things tried, with numbers

| Change | Result | Kept |
| --- | --- | --- |
| Subset fonts to the resume's own glyphs (91 KB → 42 KB) | 0.95 → 0.96 locally, LCP 2.8 s → 2.5 s | **yes** |
| Move the 29 KB sprite after the content (hero discovered at byte 3 293 instead of 32 729) | no measurable change in the simulation; still correct on a real slow link | **yes** |
| `font-display: optional` on the 300/400 faces | 0.96, no change — and body text would render in the fallback on first visit | no |
| WebP instead of AVIF | image 11 KB → 26 KB, render delay 1024 ms → 333 ms, LCP 2.5 s → **2.7 s** | no |
| Rounding SVG path precision | saves 1.1 KB of 27.6 KB | no |

AVIF is worth its decode cost: the bytes it saves matter more than the ~700 ms of
simulated decode it adds.

## What was decided

The gate is **0.95**, and [ADR 0001](../adr/0001-nextjs-over-astro-accept-97-mobile.md) is amended
to say so: it protects today's baseline from regression rather than asserting the ideal. Getting
the number back up is [spike #23](https://github.com/mcm218/resume-website-2/issues/23), which
carries the candidates — React Compiler, dropping the React runtime for the one island, a lighter
hero, trimming the sprite out of the HTML.

The two levers that were on the table and are *not* being taken now:

1. **Trade fidelity**: drop the 400 face (notes render at 300), or ship a smaller hero.
2. **Drop the React runtime**: ~115 KB of JS exists for one filter island. Replacing it with a
   small vanilla script would very likely take mobile to ~99, at the cost of the `FilterToolbar`
   client-island design in the spec.

Note that CI runs on GitHub's runners, not a laptop — the one 0.99 sample above shows
the page can score there. The gate has never actually run in CI, because
`workflow_dispatch` and `deployment_status` both take the workflow from the default
branch, so it cannot fire until the port lands on `main`.
