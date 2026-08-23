import { ICONS } from './icons';

/**
 * Every icon defined exactly once as a `<symbol>`; everything else on the page
 * references them with `<use>`, so no icon artwork is ever repeated in the HTML.
 */
export function IconSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {Object.entries(ICONS).map(([id, { viewBox, children }]) => (
          <symbol key={id} id={`i-${id}`} viewBox={viewBox}>
            {children}
          </symbol>
        ))}
      </defs>
    </svg>
  );
}
