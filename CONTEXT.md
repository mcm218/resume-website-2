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
_Avoid_: experience (bare), card

**Note**:
A single plain-text bullet describing work done in an experience item.
_Avoid_: description, bullet

**Skill**:
A named technology (Angular, React, C#, …) with a display name and an icon. The unit the filter operates on.
_Avoid_: filterable item, filter item, FilterItem, tag

**Skill Block**:
A titled group of skills with proficiency shown on the skills list (separate from the filter).
_Avoid_: skills list

**Filter**:
The set of skills the visitor has selected; an experience item is shown when it uses at least one selected skill, and all items are shown when the filter is empty.
_Avoid_: CurrentFilters, bitmask, flags

**Destination** (port effort only):
The Lighthouse 100/100/100/100 static Next.js site on Vercel that this effort is finding its way to.
