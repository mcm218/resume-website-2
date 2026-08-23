import { describe, expect, it } from 'vitest';
import { skillBlockEntryId, skillBlockEntryName } from './skill-block-entry';
import { resume } from '@/data/resume';

describe('skillBlockEntryName', () => {
  it('prefers the registry display name when the entry names a skill', () => {
    expect(skillBlockEntryName({ title: 'Node.js', skill: 'nodejs', level: 8 })).toBe('NodeJS');
    expect(skillBlockEntryName({ title: 'HTML5', skill: 'html', level: 9 })).toBe('HTML');
  });

  it('falls back to the entry title for skills outside the registry', () => {
    expect(skillBlockEntryName({ title: 'Agile', level: 8 })).toBe('Agile');
  });
});

describe('skillBlockEntryId', () => {
  it('uses the skill id when the entry has one, so registry entries cannot collide', () => {
    expect(skillBlockEntryId({ title: 'Node.js', skill: 'nodejs', level: 8 })).toBe('skill-nodejs');
    expect(skillBlockEntryId({ title: 'React Native', skill: 'react-native', level: 6 })).toBe(
      'skill-react-native',
    );
  });

  it('slugs a free-text title', () => {
    expect(skillBlockEntryId({ title: 'Agile', level: 8 })).toBe('skill-agile');
    expect(skillBlockEntryId({ title: 'Salesforce Lightning', level: 6 })).toBe(
      'skill-salesforce-lightning',
    );
  });

  it('gives every entry in the resume a unique id', () => {
    const ids = resume.skillBlocks.flatMap((block) => block.skills.map(skillBlockEntryId));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
