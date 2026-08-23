import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('next.config', () => {
  it('serves AVIF/WebP at the qualities the hero uses', () => {
    expect(nextConfig.images?.formats).toEqual(['image/avif', 'image/webp']);
    expect(nextConfig.images?.qualities).toEqual([55, 60, 75]);
  });
});
