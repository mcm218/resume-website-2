import { describe, expect, it } from 'vitest';
import { ICONS, ICON_IDS } from './icons';
import { SKILL_IDS, SKILLS } from '@/data/skills';

describe('icon registry', () => {
  it('defines all 21 icons exactly once', () => {
    expect(ICON_IDS).toHaveLength(21);
    expect(new Set(ICON_IDS).size).toBe(ICON_IDS.length);
  });

  it('covers every skill in the registry by its icon id', () => {
    for (const id of SKILL_IDS) {
      expect(ICONS[SKILLS[id].icon]).toBeDefined();
    }
  });

  it('covers the contact and toolbar icons', () => {
    for (const id of ['envelope', 'linkedin', 'github', 'chevron-left', 'chevron-right']) {
      expect(ICONS[id]).toBeDefined();
    }
  });

  it('gives every icon a viewBox and artwork', () => {
    for (const id of ICON_IDS) {
      expect(ICONS[id].viewBox).toMatch(/^[-\d.]+ [-\d.]+ [\d.]+ [\d.]+$/);
      expect(ICONS[id].children).toBeTruthy();
    }
  });
});
