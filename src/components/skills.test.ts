import { describe, expect, it } from 'vitest';
import { skillEntryId, skillEntryName } from './skills-entry';
import { resume } from '@/data/resume';

describe('skillEntryName', () => {
  it('prefers the registry display name when the entry names a skill', () => {
    expect(skillEntryName({ title: 'Node.js', skill: 'nodejs', level: 8 })).toBe('NodeJS');
    expect(skillEntryName({ title: 'HTML5', skill: 'html', level: 9 })).toBe('HTML');
  });

  it('falls back to the entry title for skills outside the registry', () => {
    expect(skillEntryName({ title: 'Agile', level: 8 })).toBe('Agile');
  });
});

describe('skillEntryId', () => {
  it('slugs a display name into an id usable by label/for', () => {
    expect(skillEntryId('React Native')).toBe('skill-react-native');
    expect(skillEntryId('C#')).toBe('skill-c');
    expect(skillEntryId('Node.js')).toBe('skill-node-js');
  });

  it('gives every entry in the resume a unique id', () => {
    const ids = resume.skillBlocks.flatMap((block) =>
      block.skills.map((entry) => skillEntryId(skillEntryName(entry))),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
