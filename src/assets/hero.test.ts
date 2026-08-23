import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Width and height from the first JPEG start-of-frame marker. */
function jpegSize(path: string): { width: number; height: number } {
  const buf = readFileSync(new URL(path, import.meta.url));
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error('not a JPEG segment');
    const marker = buf[i + 1];
    const length = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  throw new Error('no start-of-frame marker');
}

describe('hero assets', () => {
  it('ships the desktop hero at 2400×1350', () => {
    expect(jpegSize('./hero-desktop.jpg')).toEqual({ width: 2400, height: 1350 });
  });

  it('ships the phone hero at 2400×3000', () => {
    expect(jpegSize('./hero-phone.jpg')).toEqual({ width: 2400, height: 3000 });
  });
});
