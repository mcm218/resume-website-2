/**
 * The characters the bundled Montserrat faces carry.
 *
 * The resume is a fixed document, so the faces are subset to what it can render
 * instead of the whole Latin block — that is the difference between ~30 KB and
 * ~5 KB per weight, and three weights sit on the critical path. `fonts.test.ts`
 * fails if the resume ever uses a character outside this set, which is the signal
 * to widen the range and re-run `scripts/subset-fonts.sh`.
 */
export const SUBSET_UNICODES = [
  'U+0020-007E', // printable ASCII
  'U+00A0', // no-break space
  'U+00A9', // ©
  'U+00B0', // °
  'U+00C0-00FF', // Latin-1 letters (á é í ñ ó ú ü …)
  'U+2013-2014', // en and em dash
  'U+2018-201D', // curly quotes
  'U+2022', // bullet
  'U+2026', // ellipsis
] as const;

/** Every code point the subsets contain, for checking text against. */
export function subsetCodePoints(): Set<number> {
  const points = new Set<number>();
  for (const range of SUBSET_UNICODES) {
    const [start, end] = range.slice(2).split('-');
    const last = parseInt(end ?? start, 16);
    for (let code = parseInt(start, 16); code <= last; code += 1) points.add(code);
  }
  return points;
}
