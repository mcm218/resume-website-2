import { describe, expect, it } from 'vitest';
import { ICONS, ICON_IDS, type IconId } from './icons';
import { GENERATED_ICONS } from './icons.generated';
import { HAND_ICONS } from './icons.hand';
import { SKILL_IDS, SKILLS } from '@/data/skills';

describe('icon registry', () => {
  it('defines all 21 icons', () => {
    expect(ICON_IDS).toHaveLength(21);
  });

  it('defines each icon exactly once — the two sources never collide', () => {
    const collisions = Object.keys(HAND_ICONS).filter((id) => id in GENERATED_ICONS);
    expect(collisions).toEqual([]);
    expect(ICON_IDS).toHaveLength(
      Object.keys(GENERATED_ICONS).length + Object.keys(HAND_ICONS).length,
    );
  });

  it('covers every skill in the registry by its icon id', () => {
    for (const id of SKILL_IDS) {
      expect(ICONS[SKILLS[id].icon]).toBeDefined();
    }
  });

  it('covers the contact and toolbar icons', () => {
    const ids: IconId[] = ['envelope', 'linkedin', 'github', 'chevron-left', 'chevron-right'];
    for (const id of ids) {
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
