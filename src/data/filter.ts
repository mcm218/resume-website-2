import type { SkillId } from './skills';

/**
 * The filter predicate: an experience item is shown when the filter is empty
 * or the item uses at least one selected skill.
 */
export function matches(itemSkills: readonly SkillId[], selected: ReadonlySet<SkillId>): boolean {
  return selected.size === 0 || itemSkills.some((skill) => selected.has(skill));
}

/** Select a skill that is not selected, deselect one that is. Never mutates. */
export function toggle(selected: ReadonlySet<SkillId>, id: SkillId): Set<SkillId> {
  const next = new Set(selected);
  if (!next.delete(id)) next.add(id);
  return next;
}
