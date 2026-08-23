import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./globals.css', import.meta.url), 'utf8');
const rule = (selector: string) => {
  const match = css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`no rule for ${selector}`);
  return match[1];
};

describe('scroll-driven header CSS', () => {
  it('drives every header animation off the root scroller', () => {
    for (const selector of ['.hdr', '.hdr-title', '.hdr-fade']) {
      expect(rule(selector)).toContain('animation-timeline: scroll(root)');
    }
  });

  // Lightning CSS rewrites the `animation` shorthand and turns its `auto` duration
  // into `0s`, which freezes the animation at its start. The longhand survives.
  it('declares animation-duration as a longhand, never via the shorthand', () => {
    for (const selector of ['.hdr', '.hdr-title', '.hdr-fade']) {
      expect(rule(selector)).toContain('animation-duration: auto');
      expect(rule(selector)).not.toMatch(/animation:\s/);
    }
  });

  it('collapses the fading parts twice as fast as the bar animates', () => {
    expect(rule('.hdr')).toContain('animation-range: 0 75svh');
    expect(rule('.hdr-title')).toContain('animation-range: 0 75svh');
    expect(rule('.hdr-fade')).toContain('animation-range: 0 37svh');
  });

  // `max-height: none` is not interpolable: without an explicit `from`, the
  // collapse flips discretely at 50% of the range instead of easing shut.
  it('gives the collapse an interpolable starting height', () => {
    const start = css.indexOf('@keyframes hdr-collapse');
    const collapse = css.slice(start, css.indexOf('\n', start));
    expect(collapse).toMatch(/from\s*\{[^}]*max-height:\s*[\d.]+/);
  });

  it('guards the whole block behind @supports', () => {
    expect(css).toContain('@supports (animation-timeline: scroll())');
  });
});
