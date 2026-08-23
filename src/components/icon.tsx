import type { SVGProps } from 'react';
import type { IconId } from './icons';

/**
 * One icon, as a reference into the sprite `IconSprite` renders once per page.
 *
 * This lives apart from `icon-sprite.tsx` on purpose: the sprite imports every
 * icon's artwork, and a client component that imported `Icon` from there would
 * drag all of it into the browser bundle. Here the only import is a type, which
 * compiles away.
 */
export function Icon({
  id,
  className = 'h-7 w-7',
  ...props
}: { id: IconId } & SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} fill="currentColor" aria-hidden="true" {...props}>
      <use href={`#i-${id}`} />
    </svg>
  );
}
