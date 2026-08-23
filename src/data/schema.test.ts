import { describe, expect, it } from 'vitest';
import { ResumeSchema } from './schema';
import raw from './resume.json';

const valid = () => structuredClone(raw);

describe('ResumeSchema', () => {
  it('parses resume.json', () => {
    expect(() => ResumeSchema.parse(raw)).not.toThrow();
  });

  it('rejects a date that is not YYYY-MM', () => {
    const bad = valid();
    bad.experience[0].items[0].start = '2023-13';
    expect(ResumeSchema.safeParse(bad).success).toBe(false);
    bad.experience[0].items[0].start = 'January 2023';
    expect(ResumeSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an unknown skill id', () => {
    const bad = valid();
    (bad.experience[0].items[0].skills as string[]).push('cobol');
    expect(ResumeSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects `end` without `start`', () => {
    const bad = valid();
    const item = bad.experience[0].items[0] as { start?: string; end?: string | null };
    delete item.start;
    item.end = null;
    expect(ResumeSchema.safeParse(bad).success).toBe(false);
  });
});
