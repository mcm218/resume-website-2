import { describe, expect, it } from 'vitest';
import { formatYearMonth, resume } from './resume';

describe('formatYearMonth', () => {
  it('renders YYYY-MM as "Month YYYY"', () => {
    expect(formatYearMonth('2023-01')).toBe('January 2023');
    expect(formatYearMonth('2019-12')).toBe('December 2019');
  });
});

describe('resume', () => {
  it('is the parsed resume document', () => {
    expect(resume.contact.name.length).toBeGreaterThan(0);
    expect(resume.experience.length).toBeGreaterThan(0);
  });
});
