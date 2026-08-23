import { describe, expect, it } from 'vitest';
import { matches, toggle } from './filter';
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

describe('toggle', () => {
  it('adds a skill that is not selected', () => {
    expect([...toggle(new Set<SkillId>(), 'react')]).toEqual(['react']);
  });

  it('removes a skill that is selected', () => {
    expect([...toggle(new Set<SkillId>(['react']), 'react')]).toEqual([]);
  });

  it('leaves the other selections alone', () => {
    expect([...toggle(new Set<SkillId>(['react', 'angular']), 'react')]).toEqual(['angular']);
  });

  it('returns a new set rather than mutating the old one', () => {
    const before = new Set<SkillId>(['react']);
    const after = toggle(before, 'angular');
    expect(after).not.toBe(before);
    expect([...before]).toEqual(['react']);
  });
});
