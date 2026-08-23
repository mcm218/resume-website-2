/**
 * The palette, in hex, for renderers that cannot read CSS custom properties —
 * today that means the Open Graph image, which Satori rasterises at build time.
 * `globals.css` holds the same colours as `@theme inline` tokens, and
 * `theme.test.ts` fails if the two drift apart.
 */
export const PALETTE = {
  black: '#000000',
  blue: '#00bbfa',
  grayblue: '#a1e2f7',
} as const;
