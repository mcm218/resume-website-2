import { describe, expect, it } from 'vitest';
import { SKILL_IDS, SKILLS } from './skills';

describe('skill registry', () => {
  it('has the 16 skills, each with a name and icon', () => {
    expect(SKILL_IDS).toHaveLength(16);
    for (const id of SKILL_IDS) {
      expect(SKILLS[id].name).toBeTruthy();
      expect(SKILLS[id].icon).toBeTruthy();
    }
  });
});
