import raw from './resume.json';
import { ResumeSchema } from './schema';

// Parsed at import time: invalid data fails `next build`.
export const resume = ResumeSchema.parse(raw);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatYearMonth(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
