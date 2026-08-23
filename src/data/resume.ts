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
