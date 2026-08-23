import { describe, expect, it } from 'vitest';
import { subsetCodePoints } from './font-subset';
import { resume } from '@/data/resume';
import { SKILLS } from '@/data/skills';

/** Everything the page can render in a bundled face. */
function renderedText(): string {
  return [
    JSON.stringify(resume),
    Object.values(SKILLS)
      .map((skill) => skill.name)
      .join(''),
    'Skills Present Hide Show filters Filter experience by skill Email LinkedIn GitHub profile',
  ].join('');
}

describe('font subsets', () => {
  it('cover every character the site can render', () => {
    const covered = subsetCodePoints();
    const missing = [...new Set(renderedText())].filter(
      (character) => !covered.has(character.codePointAt(0)!),
    );
    expect(missing).toEqual([]);
  });
});
