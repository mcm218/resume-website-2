import type { ReactNode } from 'react';
import { GENERATED_ICONS } from './icons.generated';
import { HAND_ICONS } from './icons.hand';

/** The contents of one icon: what a `<symbol>` needs. */
export type IconArtwork = { viewBox: string; children: ReactNode };

/**
 * Every icon the site uses, keyed by icon id: the FontAwesome glyphs extracted at
 * build time plus the hand-extracted ones. Skills reach their icon through
 * `SKILLS[id].icon`; contact and toolbar icons are referenced by id directly.
 */
export const ICONS: Record<string, IconArtwork> = { ...GENERATED_ICONS, ...HAND_ICONS };

export const ICON_IDS = Object.keys(ICONS);
