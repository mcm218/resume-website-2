import type { SkillBlockEntry } from '@/data/schema';
import { SKILLS } from '@/data/skills';

/**
 * What the skills list shows for one skill-block entry: the registry's display
 * name when the entry is tied to a skill, so a name only ever has one spelling on
 * the page, and the entry's own title otherwise (Agile, Scrum, Communication …).
 */
export function skillBlockEntryName(entry: SkillBlockEntry): string {
  return entry.skill ? SKILLS[entry.skill].name : entry.title;
}

/**
 * A stable id for the entry's `<label for>` / `<progress id>` pair. Registry-backed
 * entries use the skill id, which is already unique; free-text titles are slugged,
 * and punctuation collapses, so "C#" and "C++" would collide — the uniqueness test
 * over the real resume is what catches that.
 */
export function skillBlockEntryId(entry: SkillBlockEntry): string {
  const slug = entry.skill ?? entry.title.replace(/\W+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return `skill-${slug}`;
}
