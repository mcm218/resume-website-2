import { describe, expect, it } from 'vitest';
import { formatDateRange, formatYearMonth, resume } from './resume';

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

describe('formatDateRange', () => {
  it('renders a closed range', () => {
    expect(formatDateRange({ start: '2022-01', end: '2022-08' })).toBe('January 2022 - August 2022');
  });

  it('renders an open range as Present', () => {
    expect(formatDateRange({ start: '2023-01', end: null })).toBe('January 2023 - Present');
  });

  it('renders a start with no end as just the start', () => {
    expect(formatDateRange({ start: '2023-01' })).toBe('January 2023');
  });

  it('renders nothing when the item has no start', () => {
    expect(formatDateRange({})).toBeUndefined();
    expect(formatDateRange({ end: null })).toBeUndefined();
  });
});
