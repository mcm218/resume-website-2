import type { SkillBlock } from '@/data/schema';
import { skillBlockEntryId, skillBlockEntryName } from './skill-block-entry';

export function SkillsSection({
  blocks,
  className = '',
}: {
  blocks: SkillBlock[];
  className?: string;
}) {
  return (
    <section id="skills" className={`w-full ${className}`}>
      <h2 className="text-center">Skills</h2>
      <div className="flex flex-row flex-wrap justify-evenly">
        {blocks.map((block) => (
          <article key={block.title} className="p-4">
            <h3 className="py-1 text-center">{block.title}</h3>
            <ul>
              {block.skills.map((entry) => {
                const id = skillBlockEntryId(entry);
                return (
                  <li key={id} className="py-1">
                    <label htmlFor={id} className="block">
                      {skillBlockEntryName(entry)}
                    </label>
                    <progress id={id} max={10} value={entry.level} className="block">
                      {entry.level}/10
                    </progress>
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
