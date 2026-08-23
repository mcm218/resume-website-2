import type { ExperienceGroup, ExperienceItem } from '@/data/schema';
import { formatYearMonth } from '@/data/resume';
import { SKILLS } from '@/data/skills';
import { Icon } from './icon-sprite';

export function ExperienceGroupSection({ group }: { group: ExperienceGroup }) {
  return (
    <section className="flex max-w-[45rem] flex-col">
      <h2>{group.title}</h2>
      <ul>
        {group.items.map((item) => (
          <li key={item.role}><ExperienceCard item={item} /></li>
        ))}
      </ul>
    </section>
  );
}

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <article className="xp-card" data-skills={item.skills.join(' ')}>
      <div className="mt-5 mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="inline">{item.role}</h3>
        {item.company && <p>{item.company}</p>}
      </div>
      {(item.start || item.location) && (
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          {item.start && (
            <span>{formatYearMonth(item.start)} - {item.end === null ? 'Present' : item.end ? formatYearMonth(item.end) : ''}</span>
          )}
          {item.location && <span>{item.location}</span>}
        </div>
      )}
      <ul className="flex flex-wrap items-center gap-2.5" aria-label="Skills used">
        {item.skills.map((id) => (
          <li key={id} className="chip" title={SKILLS[id].name}>
            <Icon id={id} /><span className="sr-only">{SKILLS[id].name}</span>
          </li>
        ))}
      </ul>
      <ul className="list-[square] pl-5">
        {item.notes.map((note, i) => <li key={i} className="py-1 font-normal">{note}</li>)}
      </ul>
      {item.links && (
        <ul className="flex flex-wrap gap-4 pt-2">
          {item.links.map((l) => <li key={l.url}><a className="underline" href={l.url}>{l.label}</a></li>)}
        </ul>
      )}
    </article>
  );
}
