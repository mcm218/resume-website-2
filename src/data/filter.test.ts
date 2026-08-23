import { describe, expect, it } from 'vitest';
import { matches } from './filter';
import type { SkillId } from './skills';

const item: SkillId[] = ['angular', 'typescript'];

describe('matches', () => {
  it('shows every item when the filter is empty', () => {
    expect(matches(item, new Set())).toBe(true);
    expect(matches([], new Set())).toBe(true);
  });

  it('shows an item that uses at least one selected skill', () => {
    expect(matches(item, new Set<SkillId>(['typescript', 'react']))).toBe(true);
  });

  it('hides an item that uses none of the selected skills', () => {
    expect(matches(item, new Set<SkillId>(['react']))).toBe(false);
    expect(matches([], new Set<SkillId>(['react']))).toBe(false);
  });
});
