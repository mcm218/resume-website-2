import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PALETTE } from './theme';

const css = readFileSync(new URL('./globals.css', import.meta.url), 'utf8');

/** `hsl(195 100% 49%)` → `#00bbfa`, so the CSS tokens can be compared with PALETTE. */
function hslTokenToHex(token: string): string {
  const [h, s, l] = css
    .match(new RegExp(`--color-${token}:\\s*hsl\\(([^)]*)\\)`))![1]
    .split(/\s+/)
    .map((part) => Number(part.replace('%', '')));
  const chroma = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - chroma / 2;
  const [r, g, b] = (
    [
      [chroma, x, 0],
      [x, chroma, 0],
      [0, chroma, x],
      [0, x, chroma],
      [x, 0, chroma],
      [chroma, 0, x],
    ] as const
  )[Math.floor(h / 60) % 6];
  return `#${[r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')}`;
}

describe('PALETTE', () => {
  it('matches the colour tokens in globals.css', () => {
    expect(PALETTE.blue).toBe(hslTokenToHex('blue'));
    expect(PALETTE.grayblue).toBe(hslTokenToHex('grayblue'));
  });
});
