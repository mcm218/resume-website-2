import type { SkillBlockEntry } from '@/data/schema';
import { SKILLS } from '@/data/skills';

/**
 * What the skills list shows for one entry: the registry's display name when the
 * entry is tied to a skill, so a name only ever has one spelling on the page, and
 * the entry's own title otherwise (Agile, Scrum, Communication …).
 */
export function skillEntryName(entry: SkillBlockEntry): string {
  return entry.skill ? SKILLS[entry.skill].name : entry.title;
}

/** A stable id for the `<label for>` / `<progress id>` pair. */
export function skillEntryId(name: string): string {
  return `skill-${name.replace(/\W+/g, '-').replace(/-$/, '').toLowerCase()}`;
}
