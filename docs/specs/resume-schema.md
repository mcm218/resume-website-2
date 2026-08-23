# Resume data schema

Resolves [Resume data schema](https://github.com/mcm218/resume-website-2/issues/6) on the
[Next.js port map](https://github.com/mcm218/resume-website-2/issues/3). Vocabulary: see `CONTEXT.md`.

## Files

```
src/data/
├── skills.ts     # Skill registry: id → display name + icon id (single source of truth)
├── schema.ts     # zod schema + inferred types
├── resume.json   # the Resume (hand-converted once from src/assets/me.json, which is deleted)
└── resume.ts     # `export const resume = ResumeSchema.parse(json)` — a bad edit fails `next build`
```

## Skill registry (`skills.ts`)

All 16 skills from the old bitmask; all are filterable in the toolbar.

| id | name | icon |
|---|---|---|
| `csharp` | C# | svg `csharp` |
| `unity` | Unity | svg `unity` |
| `xamarin` | Xamarin | svg `xamarin` |
| `salesforce` | Salesforce | svg `salesforce` |
| `angular` | Angular | svg `angular` |
| `html` | HTML | svg `html5` |
| `css` | CSS | svg `css3` |
| `javascript` | JavaScript | svg `js` |
| `typescript` | TypeScript | svg `typescript` |
| `nodejs` | NodeJS | svg `node` |
| `react` | React | svg `react` |
| `flutter` | Flutter | svg `flutter` |
| `cplusplus` | C/C++ | svg `cplusplus` |
| `elasticsearch` | ElasticSearch | svg `elasticsearch` |
| `react-native` | React Native | svg `reactnative` |
| `rabbitmq` | RabbitMQ | svg `rabbitmq` |

Icons are hand-extracted inline SVG components keyed by icon id (no FontAwesome runtime).

```ts
export const SKILL_IDS = ['csharp','unity','xamarin','salesforce','angular','html','css',
  'javascript','typescript','nodejs','react','flutter','cplusplus','elasticsearch',
  'react-native','rabbitmq'] as const;
export type SkillId = (typeof SKILL_IDS)[number];
export const SKILLS: Record<SkillId, { name: string; icon: string }> = { /* table above */ };
```

## Schema (`schema.ts`)

```ts
import { z } from 'zod';
import { SKILL_IDS } from './skills';

const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/); // "2023-01"

export const SkillIdSchema = z.enum(SKILL_IDS);

export const ContactSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  linkedin: z.string().url(),
  github: z.string().url(),          // profile URL, https://github.com/mcm218
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  university: z.string().min(1),
  end: YearMonth,
});

export const LinkSchema = z.object({ label: z.string().min(1), url: z.string().url() });

export const ExperienceItemSchema = z.object({
  role: z.string().min(1),
  company: z.string().optional(),
  location: z.string().optional(),
  start: YearMonth.optional(),
  end: YearMonth.nullable().optional(), // null = Present; only meaningful when `start` exists
  skills: z.array(SkillIdSchema),
  notes: z.array(z.string().min(1)),    // plain text, no markup
  links: z.array(LinkSchema).optional(),
}).refine(i => i.end === undefined || i.start !== undefined,
  { message: '`end` requires `start`' });

export const ExperienceGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(ExperienceItemSchema), // document order is display order
});

export const SkillBlockEntrySchema = z.object({
  title: z.string().min(1),             // free text; registry name wins when `skill` is set
  skill: SkillIdSchema.optional(),
  level: z.number().int().min(1).max(10),
});

export const SkillBlockSchema = z.object({
  title: z.string().min(1),
  skills: z.array(SkillBlockEntrySchema),
});

export const ResumeSchema = z.object({
  contact: ContactSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceGroupSchema),
  skillBlocks: z.array(SkillBlockSchema),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
```

## Rules

- **Dates** are `YYYY-MM`; render as "January 2023". `end: null` renders "Present". No date line when `start` is absent.
- **Ordering** is document order; `priority` and the date-then-priority sort are gone.
- **Filter** semantics unchanged: empty filter shows everything; otherwise an item shows when it has at least one selected skill.
- **Notes** are plain text. The three Ludum Dare notes lose their anchors; the URLs move to `links` on the Game Jams item.
- `phone` is dropped from contact.

## Conversion notes (`me.json` → `resume.json`)

- Bitmask → ids via the `FilterItem` bit order above (bit 0 = `csharp` … bit 15 = `rabbitmq`).
- `"January 2023"` → `"2023-01"`; `"Present"` → `null`; `""` → omit.
- Skill-block `skill: 8` → `level: 8`; add `skill` id where a registry entry exists
  (Typescript→`typescript`, Javascript→`javascript`, HTML5→`html`, CSS→`css`, C#→`csharp`,
  Xamarin→`xamarin`, Salesforce Lightning→`salesforce`, Angular→`angular`, React→`react`,
  Node.js→`nodejs`, Unity→`unity`, React Native→`react-native`, ElasticSearch→`elasticsearch`).
- Game Jams `links`: Ludum Dare 54, 51, 50 entries at ldjam.com.
