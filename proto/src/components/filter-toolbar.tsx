'use client';
import { useEffect, useState } from 'react';
import { SKILL_IDS, SKILLS, type SkillId } from '@/data/skills';
import { Icon } from './icon-sprite';

// The only client island. Icons are <use> references into the server-rendered
// sprite, so no icon data enters the client bundle or the RSC payload. Cards are
// server HTML; matching toggles data-dim on them (an "any selected skill matches"
// rule plain CSS attribute selectors cannot express).
export function FilterToolbar() {
  const [selected, setSelected] = useState<Set<SkillId>>(() => new Set());
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 600) setExpanded(false);
  }, []);

  useEffect(() => {
    for (const card of document.querySelectorAll<HTMLElement>('.xp-card')) {
      const skills = (card.dataset.skills ?? '').split(' ');
      const match = selected.size === 0 || skills.some((s) => selected.has(s as SkillId));
      if (match) delete card.dataset.dim; else card.dataset.dim = '';
    }
    document.querySelectorAll<HTMLElement>('.primary-column').forEach((el) => { el.dataset.expanded = String(expanded); });
  }, [selected, expanded]);

  const toggle = (id: SkillId) =>
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className={`fixed top-1/2 z-10 flex -translate-y-1/2 transition-[left] duration-250 ease-in-out ${expanded ? 'left-4' : '-left-[70px]'}`}>
      <ul aria-label="Filter experience by skill" className="flex max-h-[50vh] flex-col items-center gap-2.5 overflow-y-scroll rounded-[10px] bg-black/70 px-2.5 py-5 [scrollbar-width:none] max-sm:bg-black">
        {SKILL_IDS.map((id) => (
          <li key={id}>
            <button type="button" className="chip block cursor-pointer" aria-pressed={selected.has(id)} aria-label={SKILLS[id].name} title={SKILLS[id].name} onClick={() => toggle(id)}>
              <Icon id={id} />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" aria-label={expanded ? 'Hide filters' : 'Show filters'} aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}
        className="flex h-[50px] w-5 cursor-pointer items-center self-center rounded-r-[10px] bg-black/70 max-sm:bg-black">
        <Icon id={expanded ? 'chevron-left' : 'chevron-right'} className="h-4 w-4" />
      </button>
    </div>
  );
}
