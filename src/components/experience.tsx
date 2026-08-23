import { formatDateRange } from '@/data/resume';
import type { ExperienceGroup, ExperienceItem } from '@/data/schema';
import { SKILLS } from '@/data/skills';
import { Icon } from './icon';

export function ExperienceGroupSection({
  group,
  className = '',
}: {
  group: ExperienceGroup;
  className?: string;
}) {
  return (
    // The background and radius live on the <section> itself: the mobile rule that
    // strips them keys off `.primary-column section`, so a styled wrapper div would
    // silently keep its card look on phones.
    <section className={`flex max-w-[45rem] flex-col ${className}`}>
      <h2>{group.title}</h2>
      <ul>
        {group.items.map((item) => (
          <li key={item.role}>
            <ExperienceCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const dates = formatDateRange(item);
  return (
    // data-skills is what the filter toolbar reads to decide whether to dim this card.
    <article className="xp-card" data-skills={item.skills.join(' ')}>
      <div className="mt-5 mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="inline">{item.role}</h3>
        {item.company && <p>{item.company}</p>}
      </div>
      {(dates || item.location) && (
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          {dates && <span>{dates}</span>}
          {item.location && <span>{item.location}</span>}
        </div>
      )}
      <ul className="flex flex-wrap items-center gap-2.5" aria-label="Skills used">
        {item.skills.map((id) => (
          <li key={id} className="chip" title={SKILLS[id].name}>
            <Icon id={SKILLS[id].icon} />
            <span className="sr-only">{SKILLS[id].name}</span>
          </li>
        ))}
      </ul>
      <ul className="xp-notes pl-5">
        {item.notes.map((note, index) => (
          // Index keys: notes are a fixed, document-ordered list and one item
          // legitimately repeats a note, so the text is not a unique key.
          <li key={index} className="py-1 font-normal">
            {note}
          </li>
        ))}
      </ul>
      {item.links && (
        <ul className="flex flex-wrap gap-4 pt-2">
          {item.links.map((link) => (
            <li key={link.url}>
              <a className="underline" href={link.url}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
