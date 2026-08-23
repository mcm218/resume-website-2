import raw from './resume.json';
import { ResumeSchema } from './schema';

// Parsed at import time: a bad edit to resume.json fails `next build`.
export const resume = ResumeSchema.parse(raw);

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2023-01" → "January 2023" */
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * The date line for an experience item: "January 2023 - Present" while it is
 * ongoing, "January 2022 - August 2022" once it ended, and nothing at all for
 * items that carry no start (projects, game jams).
 */
export function formatDateRange(item: {
  start?: string;
  end?: string | null;
}): string | undefined {
  if (!item.start) return undefined;
  const start = formatYearMonth(item.start);
  if (item.end === undefined) return start;
  return `${start} - ${item.end === null ? 'Present' : formatYearMonth(item.end)}`;
}
