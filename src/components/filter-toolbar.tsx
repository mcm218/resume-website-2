'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { matches, toggle } from '@/data/filter';
import { SKILL_IDS, SKILLS, type SkillId } from '@/data/skills';
import { Icon } from './icon';

/**
 * The only client island. Its icons are `<use>` references into the server-rendered
 * sprite, so no icon path data enters the client bundle or the RSC payload.
 *
 * The cards themselves stay server HTML: filtering marks the ones that do not match
 * with `data-dim` and CSS fades them, because "shows when it uses any selected
 * skill" is not something a CSS attribute selector can express.
 */
const NARROW = '(max-width: 599px)';

function subscribeToNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const isNarrowNow = () => window.matchMedia(NARROW).matches;

// The server has no viewport, so it renders the expanded toolbar; a narrow client
// collapses it on hydration.
const isNarrowOnServer = () => false;

export function FilterToolbar() {
  const [selected, setSelected] = useState<ReadonlySet<SkillId>>(() => new Set());
  const [expandedByHand, setExpandedByHand] = useState<boolean | null>(null);

  const narrow = useSyncExternalStore(subscribeToNarrow, isNarrowNow, isNarrowOnServer);
  // Phones start collapsed, wide screens expanded, until the visitor says otherwise.
  const expanded = expandedByHand ?? !narrow;

  useEffect(() => {
    for (const card of document.querySelectorAll<HTMLElement>('.xp-card')) {
      const skills = (card.dataset.skills ?? '').split(' ').filter(Boolean) as SkillId[];
      if (matches(skills, selected)) delete card.dataset.dim;
      else card.dataset.dim = '';
    }
    for (const column of document.querySelectorAll<HTMLElement>('.primary-column')) {
      column.dataset.expanded = String(expanded);
    }
  }, [selected, expanded]);

  return (
    // Collapsing slides the list out by exactly its own width, so the 1.25rem
    // handle always stays on screen — a fixed offset left it unreachable on phones,
    // which is the one viewport where collapsed is the default.
    <div
      className={`fixed top-1/2 left-4 z-10 flex -translate-y-1/2 transition-transform duration-250 ease-in-out ${
        expanded ? 'translate-x-0' : 'translate-x-[calc(-100%+1.25rem)]'
      }`}
    >
      <ul
        id="skill-filter"
        aria-label="Filter experience by skill"
        inert={!expanded}
        className="flex max-h-[80vh] flex-col items-center gap-2.5 overflow-y-scroll rounded-[10px] bg-black/70 px-2.5 py-5 [scrollbar-width:none] max-[600px]:bg-black"
      >
        {SKILL_IDS.map((id) => (
          <li key={id}>
            <button
              type="button"
              className="chip block cursor-pointer"
              aria-pressed={selected.has(id)}
              aria-label={SKILLS[id].name}
              title={SKILLS[id].name}
              onClick={() => setSelected((previous) => toggle(previous, id))}
            >
              <Icon id={SKILLS[id].icon} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-label={expanded ? 'Hide filters' : 'Show filters'}
        aria-expanded={expanded}
        aria-controls="skill-filter"
        onClick={() => setExpandedByHand(!expanded)}
        className="flex h-[50px] w-5 cursor-pointer items-center self-center rounded-r-[10px] bg-black/70 max-[600px]:bg-black"
      >
        <Icon id={expanded ? 'chevron-left' : 'chevron-right'} className="h-4 w-4" />
      </button>
    </div>
  );
}
