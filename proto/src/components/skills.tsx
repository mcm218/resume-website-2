import type { SkillBlock } from '@/data/schema';
import { SKILLS } from '@/data/skills';

export function SkillsSection({ blocks }: { blocks: SkillBlock[] }) {
  return (
    <section id="skills" className="w-full">
      <h2 className="text-center">Skills</h2>
      <div className="flex flex-row flex-wrap justify-evenly">
        {blocks.map((b) => (
          <article key={b.title} className="max-sm:p-4">
            <h3 className="py-1 text-center">{b.title}</h3>
            <ul>
              {b.skills.map((s) => {
                const name = s.skill ? SKILLS[s.skill].name : s.title;
                const id = `skill-${name.replace(/\W+/g, '-').toLowerCase()}`;
                return (
                  <li key={name} className="py-1">
                    <label htmlFor={id} className="block">{name}</label>
                    <progress id={id} max={10} value={s.level} className="block">{s.level}/10</progress>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
