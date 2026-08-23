# Resume site

A single-page personal resume for Michael Muñiz, rendered from one resume document and filterable by skill.

## Language

**Resume**:
The single document the site renders: contact, education, experience groups, and skill blocks.
_Avoid_: me.json, profile, CV

**Experience Group**:
A titled list of experience items (e.g. "Professional Experience", "Projects").
_Avoid_: role (the Angular `Role` type), section

**Experience Item**:
One job or project within an experience group: role title, company, location, dates, notes, and the skills it used.
The component that renders one is the **Experience Card** (`ExperienceCard`, `.xp-card`) — "card" names the view, never the data.
_Avoid_: experience (bare)

**Note**:
A single plain-text bullet describing work done in an experience item. Carries no markup.
_Avoid_: description, bullet

**Link**:
A labelled URL attached to an experience item (e.g. a game-jam entry page).
_Avoid_: anchor, href

**Skill**:
A named technology (Angular, React, C#, …) identified by a stable id, with a display name and an icon, defined once in the skill registry. The unit the filter operates on.
_Avoid_: filterable item, filter item, FilterItem, tag, bitmask

**Skill Registry**:
The single list of all skills and their display names and icons.
_Avoid_: enum, filter list

**Skill Block**:
A titled group of skill-block entries shown on the skills list (separate from the filter).
_Avoid_: skills list

**Skill Block Entry**:
A free-text title with a level, optionally tied to a skill in the registry.
_Avoid_: skill (bare)

**Level**:
A self-rated proficiency from 1 to 10 on a skill-block entry.
_Avoid_: skill (the old JSON field), rating, score

**Filter**:
The set of skills the visitor has selected; an experience item is shown when it uses at least one selected skill, and all items are shown when the filter is empty.
_Avoid_: CurrentFilters, bitmask, flags

**Destination** (port effort only):
The Lighthouse 100/100/100/100 static Next.js site on Vercel that this effort is finding its way to.
