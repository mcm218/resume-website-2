# Next.js 16 mobile-perf-100 checklist for this site's payload

Research ticket: https://github.com/mcm218/resume-website-2/issues/5 (part of #3).
Date: 2026-08-23. Next.js docs consulted at version 16.3.2.

## Question

What does a fully static Next.js 16 App Router page on Vercel need to do to reliably hit
Lighthouse 100 on **mobile** performance, given this site's actual payload?

## The payload today (Angular 17, `src/`)

Measured from the repo, not assumed:

| Asset | Size | Pixels | How it is used |
| --- | --- | --- | --- |
| `src/assets/headerBackground.jpg` | 284 KB | 1920x1080 | `#app-container` CSS `background-image`, desktop, DPR < 2 |
| `src/assets/headerBackground@2x.jpg` | 414 KB | 2400x1350 | same, DPR >= 2 |
| `src/assets/phoneBackground.jpg` | 711 KB | 1920x2400 | same, `max-width: 600px`, DPR < 2 |
| `src/assets/phoneBackground@2x.jpg` | **1.18 MB** | 2400x3000 | same, `max-width: 600px`, DPR >= 2 (every modern phone) |
| `src/assets/Montserrat/*` | 36 files, ~3.6 MB woff2 | 9 weights x 2 styles x 2 formats | all 18 faces declared in `Montserrat.css` |
| 9 SVG icons | 0.3 - 8.6 KB each | - | plus FontAwesome brand icons from `@fortawesome/*` |

Weights actually referenced in SCSS (`grep font-weight src`): **200** (`h1-h4`), **300** (`p`),
**400** (experience card). No italic anywhere. So 15 of the 18 declared faces are dead weight
(the browser only fetches faces it matches, but the CSS still declares them and any
`font-style: italic` would trigger a 90 KB download).

The hero is the `#app-container` background, sized with `background-size: 100% auto` on
desktop. On phones (`src/app/home/home.component.ts` `ngAfterViewInit`) JS rewrites
`backgroundSize` to `auto ${screen.availHeight}px` and sets `#mobile-underlay` height to
`screen.availHeight` after first render. That is a post-paint resize of the largest element
on the page, i.e. a guaranteed layout shift plus a late LCP candidate, which is the core CLS/LCP
problem the port has to remove.

## How Lighthouse scores mobile (what "100" actually requires)

- Lighthouse 10+ weights: **TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10%**. Score 90 is roughly the
  8th percentile of HTTP Archive; the LCP curve maps ~1,220 ms to a score of 99.
  Source: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
- Mobile runs use simulated slow 4G and a 4x CPU slowdown, so a 1.18 MB JPEG alone blows LCP.
- web.dev targets: LCP <= 2.5 s, CLS <= 0.1 at p75.
  Sources: https://web.dev/articles/optimize-lcp, https://web.dev/articles/optimize-cls
- Practical reading: to land at 100 rather than 95-99 the LCP image must be discoverable from
  the HTML, small (tens of KB, not hundreds), there must be zero shift, and client JS must be
  small enough that hydration never produces a >50 ms long task on a throttled CPU.

## 1. LCP hero strategy

### Findings (Next.js `next/image` docs, https://nextjs.org/docs/app/api-reference/components/image)

- **`priority` is deprecated in Next.js 16** "in favor of the `preload` property in order to make
  the behavior clear." `preload` inserts a `<link rel="preload">` in `<head>`; default is `false`.
- Docs say: "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of
  `preload`", and specifically NOT to use `preload` "when you have multiple images that could be
  considered the LCP element depending on the viewport" (exactly our desktop/phone hero case).
- `loading` defaults to `lazy`. web.dev: "Never lazy-load your LCP image."
- `sizes`: "If `sizes` is missing, the browser assumes the image will be as wide as the viewport
  (100vw)". With `sizes`, Next generates a full `w`-descriptor srcset from `deviceSizes`
  (default `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`); without it only 1x/2x.
- `fill` makes the image expand to the parent; use with `sizes` and a positioned parent.
- `quality` default 75. In Next 16 `images.qualities` defaults to `[75]` and "is required";
  any other `quality` value is coerced to the nearest allowed entry, so add hero values to the
  list. `formats` default is `['image/webp']`; AVIF "compresses 20% smaller" but "takes 50%
  longer to encode"; set
  `['image/avif', 'image/webp']` to prefer AVIF with WebP fallback (order matters; each format is
  cached separately).
- **Art direction** (different image for phone vs desktop) is documented via `getImageProps()`
  feeding a `<picture>` with `<source media=...>` elements. The theme-image note applies equally:
  with two candidates you "cannot use `preload` or `loading="eager"` because that would cause both
  images to load. Instead, you can use `fetchPriority="high"`."
- A static `import` of a jpg/png gives automatic `width`/`height` (no CLS) and an automatic
  `blurDataURL` for `placeholder="blur"`.
- Static export caveat (https://nextjs.org/docs/app/guides/static-exports): `output: 'export'`
  does **not** support "Image Optimization with the default loader"; you need a custom
  `loaderFile` or `images.unoptimized`. Deploying the normal `next build` output to Vercel
  (pages prerendered at build, no `output: 'export'`) keeps the `/_next/image` optimizer, which is
  the path that gives us AVIF/WebP resizing for free. Recommendation: do **not** set
  `output: 'export'`; a prerendered App Router page on Vercel is already fully static HTML.

### web.dev on background images (https://web.dev/articles/optimize-lcp)

- A CSS background LCP image "cannot be discovered from scanning the HTML document response";
  the browser must first download and apply the stylesheet. Fix is either make it an `<img>` or
  "Preload the LCP image with a high fetchpriority so it starts loading with the stylesheet."
- Only one or two images should get `fetchpriority="high"`.
- Recommended LCP budget split: resource load delay < 10%, element render delay < 10%.

### Decision for this site

Render the hero as a real `<picture>`/`<img>` (absolutely positioned behind the content, `object-fit: cover`) rather than a CSS background:

```tsx
// app/(home)/hero-background.tsx  (Server Component)
import { getImageProps } from 'next/image'
import desktop from '@/public/hero/headerBackground.jpg'   // 2400x1350 source
import phone from '@/public/hero/phoneBackground.jpg'      // 2400x3000 source

export function HeroBackground() {
  const common = { alt: '', sizes: '100vw', fetchPriority: 'high' as const, loading: 'eager' as const }
  const { props: { srcSet: desktopSet } } = getImageProps({ ...common, src: desktop, quality: 60 })
  const { props: { srcSet: phoneSet, ...rest } } = getImageProps({ ...common, src: phone, quality: 55 })
  return (
    <picture className="absolute inset-0 -z-10">
      <source media="(min-width: 601px)" srcSet={desktopSet} />
      <img {...rest} srcSet={phoneSet} className="h-full w-full object-cover object-top" />
    </picture>
  )
}
```

- `fetchPriority="high"` + `loading="eager"` on the `<img>`, no `preload` (two viewport-dependent
  candidates, per the docs). `decoding="async"` is fine.
- `images.formats: ['image/avif', 'image/webp']` in `next.config.ts`. Expect the 390 px-wide
  AVIF slice of the phone hero to be roughly 20-40 KB versus 1.18 MB today. Verify in the
  Lighthouse "Properly size images"/"Serve images in next-gen formats" audits.
- Consider lowering `quality` on the hero only (it sits behind a dark gradient); add the chosen
  values to `images.qualities` so they are not coerced.
- The `#mobile-underlay` gradient becomes a pure CSS overlay div with no JS sizing.
- If you instead keep a CSS background (not recommended), the Metadata API does not support
  `<link rel="preload">` ("Use ReactDOM preload method", only supported in Client Components that
  are still SSR'd on first load: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#resource-hints).
  `ReactDOM.preload(url, { as: 'image', imageSrcSet, imageSizes, fetchPriority: 'high' })`
  (https://react.dev/reference/react-dom/preload) has no `media` option, so you cannot preload
  only the phone or only the desktop image. That is the reason to go `<picture>`.
- `fetchpriority` support: Chrome 102+, Safari 17.2+, Firefox 132+ (https://web.dev/articles/fetch-priority);
  older browsers simply ignore it, and the eager in-viewport `<img>` is still boosted at layout.
- On Vercel, `next/image` output is cached on the CDN for up to 31 days keyed on width, quality and
  `Accept` (https://vercel.com/docs/image-optimization); the first AVIF encode is slow, so hit the
  preview URL once before running Lighthouse.

## 2. Fonts: `next/font/local`, weights, display

### Findings (https://nextjs.org/docs/app/api-reference/components/font)

- `next/font` self-hosts and "removes external network requests"; claims zero layout shift via
  generated fallback metrics.
- `src` accepts an array of `{ path, weight, style }`.
- `display` default is `'swap'`; accepts `'optional'`.
- `preload` default `true` (a `<link rel=preload>` per font file used in the root layout, on
  every route).
- `adjustFontFallback` for local fonts: `'Arial'` (default), `'Times New Roman'` or `false`;
  generates a size-adjusted fallback `@font-face` to cut CLS.
- `declarations` lets you add extra `@font-face` descriptors (e.g. `unicode-range`).
- **No subsetting for local fonts**: `subsets` is a `next/font/google`-only option. For local
  files you must subset offline (e.g. `pyftsubset --flavor=woff2 --unicodes=U+0000-00FF,...`)
  and ship the subset woff2.
- "Use multiple fonts conservatively since each new font is an additional resource."

### web.dev (https://web.dev/articles/font-best-practices, https://web.dev/articles/optimize-cls)

- "Use only WOFF2 and forget about everything else" (30% better than WOFF).
- Subsetting/`unicode-range` materially cuts size; variable fonts replace many files with one.
- `swap` renders fastest but can shift; `optional` caps the render delay at ~100 ms and never
  swaps late, so it is the lowest-CLS option. Preload only the critical faces.

### Decision for this site

- Ship **exactly three faces, woff2 only**: Montserrat 200, 300, 400 normal. Drop all italics
  and 100/500-900 (3 x ~86 KB before subsetting). Better: one Montserrat **variable** woff2
  (`weight: '200 400'`-style range via `src` + `weight: '200 400'`) subset to Latin, typically
  ~60-80 KB for the whole range.
- Subset to Latin (+ Latin-1 if any accented names appear in `me.json`) with `pyftsubset` before
  committing; commit the subset files under `app/fonts/`.
- Config:

```ts
// app/fonts.ts
import localFont from 'next/font/local'
export const montserrat = localFont({
  src: [
    { path: './fonts/Montserrat-ExtraLight.subset.woff2', weight: '200', style: 'normal' },
    { path: './fonts/Montserrat-Light.subset.woff2',      weight: '300', style: 'normal' },
    { path: './fonts/Montserrat-Regular.subset.woff2',    weight: '400', style: 'normal' },
  ],
  display: 'swap',          // switch to 'optional' if the font audit still shows CLS > 0
  preload: true,
  adjustFontFallback: 'Arial',
  variable: '--font-montserrat',
})
```

  Expose `--font-montserrat` to Tailwind v4 via `@theme inline { --font-sans: var(--font-montserrat); }`.
- The `h1` at 4 rem/weight 200 is the text LCP candidate on desktop; keep it server-rendered
  plain text so it paints from HTML.

## 3. CLS without the `screen.availHeight` hack

### Findings

- MDN `<length>` (https://developer.mozilla.org/en-US/docs/Web/CSS/length): `vh` == `lvh`
  (largest viewport, URL bar hidden); `svh` is the smallest (bars shown) and "fixed and stable";
  `dvh` resizes as bars show/hide and MDN warns dynamic units "can cause content to resize while
  the user is scrolling", i.e. they *cause* shifts after load. The `*vh` family is Baseline
  (Chrome 108, Safari 15.4, Firefox 101 per MDN compat data).
- web.dev CLS: reserve space with `width`/`height` or `aspect-ratio`; never inject/resize content
  above the fold after load; CLS good <= 0.1.

### Decision for this site

- Hero container: `min-h-svh` (Tailwind v4 ships `svh`/`dvh`/`lvh` utilities). `svh` is the
  right pick: it matches the first-paint viewport (bars visible) and never re-lays out as the
  user scrolls, which is what `screen.availHeight` was approximating. Do **not** use `dvh` for the
  hero. Support: Chrome 108, Safari 15.4, Firefox 101, ~94% global
  (https://caniuse.com/viewport-unit-variants); declare `min-height: 100vh` first as the fallback.
- Hero image is `absolute inset-0 h-full w-full object-cover`; intrinsic `width`/`height` come
  from the static import, so no reflow when it decodes.
- Delete the `ngAfterViewInit` sizing entirely; there is no client JS touching layout.
- Skip `placeholder="blur"` on the hero unless the audit shows a visible empty region; the dark
  `background-color: black` container already gives a stable paint.

## 4. Client-component island for the filter toolbar

### Findings (https://nextjs.org/docs/app/getting-started/server-and-client-components)

- Pages/layouts are Server Components by default; Server Components "reduce the amount of
  JavaScript sent to the browser."
- `'use client'` is a boundary: "all of its imports and the components it directly renders are
  included in the client bundle." Components passed as `children`/props are not.
- "add `'use client'` to specific interactive components instead of marking large parts of your
  UI as Client Components."
- Static export guide: Client Components are still prerendered to HTML at build; `window` only
  inside `useEffect`.

### Decision for this site

- Resume data (`me.json`/API) is read at build time in the Server Component page; experience
  cards, skills and header render as server HTML with zero client JS.
- Filtering: the only interactive state is the bitmask `FilterService.CurrentFilters`. Keep it
  in one `'use client'` `<FilterToolbar>` that owns the toggle state and applies a
  `data-filter` attribute on a wrapper (or sets a CSS class), and let **CSS** hide non-matching
  server-rendered cards (`[data-filter~="react"] .card:not([data-tags~="react"]) { display:none }`
  or equivalent Tailwind `group-data-*` variants). Cards never enter the client bundle.
- Do not import `@fortawesome/*` into the client island; inline the ~13 brand SVGs as React
  elements in a Server Component and pass them as `children` to the toolbar, or use CSS sprites.
  The FontAwesome svg-core runtime is the single biggest avoidable TBT contributor in the current
  app.
- Budget: client JS for the page (excluding the React/Next runtime) should be under ~10 KB
  gzipped; verify with `next build` route summary ("First Load JS").
- Keep the page static: no `cookies()`/`headers()`/`searchParams`, so `next build` prerenders it
  (the build output should list the route as static/prerendered). Cache Components/PPR are not
  needed for a single static page.

## 5. Cost of `@vercel/analytics`

### Findings (https://vercel.com/docs/analytics/quickstart, https://vercel.com/docs/analytics/package)

- Add `<Analytics />` from `@vercel/analytics/next` inside `<body>` of the root layout.
- Enabling analytics "will add new routes (scoped at `/_vercel/insights/*` and `/<unique-path>/*`)";
  v2 loads `/<unique-path>/script.js` (Resilient Intake) and posts to `/<unique-path>/view`.
  The plain-HTML variant is `<script defer src=".../script.js">`, i.e. a deferred, non-blocking
  first-party script on the same origin (no extra DNS/TLS).
- `mode`, `debug`, `beforeSend`, `scriptSrc` are the only knobs; Vercel does not publish a byte
  size or a stated Lighthouse impact in these docs.
- The `<Analytics />` component is itself a Client Component (`'use client'` in its build config
  is cited in the Next docs as the library-author example).

### Decision for this site

- Use `<Analytics />` (pageviews only, no custom events); expect one deferred same-origin script
  of a few KB plus one beacon. It executes after hydration and should not move TBT measurably.
  Verify by running Lighthouse with and without it; if TBT changes, wrap it in a
  `requestIdleCallback`-gated dynamic import.
- Skip `@vercel/speed-insights` for the Lighthouse target (second script, same pattern); add it
  later only if field data is wanted.

## 6. Metadata / head

- Static `export const metadata` for title/description; `viewport` and `themeColor` moved to
  `export const viewport` in Next 14+ (`themeColor` in `metadata` is deprecated).
  Source: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- Next injects `<meta charset>` and `<meta name="viewport" content="width=device-width, initial-scale=1">`
  automatically; do not set `maximumScale: 1` / `userScalable: false` (accessibility audit hit).
- `experimental.inlineCss: true` (https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss)
  replaces the CSS `<link>` with an inline `<style>`; docs recommend it for atomic CSS like
  Tailwind and first-time visitors, flag it as experimental/not production-recommended, and note
  styles are duplicated in the RSC payload. Try it last: it removes one render-blocking request,
  which on throttled mobile is often the difference between 99 and 100 FCP/LCP.

## Checklist for the prototype ticket

Implement:

- [ ] Do not set `output: 'export'`; deploy normal `next build` to Vercel so `/_next/image` works. Page must be prerendered (static) in the build summary.
- [ ] `next.config.ts`: `images.formats = ['image/avif', 'image/webp']`; `images.qualities` including the hero values.
- [ ] Hero as `<picture>` built with `getImageProps()` (desktop source 2400x1350, phone source 2400x3000), `sizes="100vw"`, `fetchPriority="high"`, `loading="eager"`, no `preload`, `object-cover`, absolutely positioned behind content.
- [ ] Hero container `min-h-svh`; no JS touches layout; delete the `screen.availHeight` logic. Gradient underlay is a plain CSS div.
- [ ] Fonts: subset Montserrat to Latin, ship only 200/300/400 normal as woff2 (or one variable woff2), via `next/font/local` with `display: 'swap'`, `preload: true`, `adjustFontFallback: 'Arial'`, wired to Tailwind through `--font-montserrat`.
- [ ] Page, header, experience cards, skills = Server Components reading resume JSON at build time.
- [ ] `FilterToolbar` is the only `'use client'` file; it toggles a data attribute and CSS does the filtering. No `@fortawesome` in the client graph; icons are inline SVG rendered on the server.
- [ ] `<Analytics />` from `@vercel/analytics/next` in the root layout body, nothing else third-party.
- [ ] `export const metadata` + `export const viewport` (themeColor black); no `userScalable: false`.
- [ ] Optional last step: `experimental.inlineCss: true`; keep only if it moves the score.

Verify (Lighthouse mobile, Vercel preview URL, 3 runs each, take the median):

- [ ] Performance 100; LCP < 1.5 s, CLS = 0, TBT < 50 ms, FCP < 1.2 s.
- [ ] LCP element reported is the hero `<img>` (or the `h1`), and "Preload LCP image"/"Largest Contentful Paint image was lazily loaded" audits pass.
- [ ] Network: the phone hero request is AVIF, <= 50 KB at 390 px wide on DPR 3; desktop hero <= 150 KB at 1920 px.
- [ ] Exactly 1-3 font requests, all woff2, each <= ~30 KB after subsetting; "Ensure text remains visible during webfont load" passes; no font-related layout shift in the CLS trace.
- [ ] `next build` output: route `/` marked static; First Load JS for `/` minimal, toolbar chunk < 10 KB gz; no `@fortawesome` chunk.
- [ ] Analytics script present only after `load`; removing it changes TBT by 0 ms.
- [ ] Resize the browser across 600 px and scroll on a real phone: no reflow of the hero while the URL bar collapses.

## Sources

- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/api-reference/components/font
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss
- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/package
- https://react.dev/reference/react-dom/preload
- https://web.dev/articles/optimize-lcp
- https://web.dev/articles/optimize-cls
- https://web.dev/articles/font-best-practices
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
- https://developer.mozilla.org/en-US/docs/Web/CSS/length
