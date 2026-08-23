import { z } from 'zod';
import { SKILL_IDS } from './skills';

const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const SkillIdSchema = z.enum(SKILL_IDS);

export const ContactSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  linkedin: z.string().url(),
  github: z.string().url(),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  university: z.string().min(1),
  end: YearMonth,
});

export const LinkSchema = z.object({ label: z.string().min(1), url: z.string().url() });

export const ExperienceItemSchema = z
  .object({
    role: z.string().min(1),
    company: z.string().optional(),
    location: z.string().optional(),
    start: YearMonth.optional(),
    end: YearMonth.nullable().optional(),
    skills: z.array(SkillIdSchema),
    notes: z.array(z.string().min(1)),
    links: z.array(LinkSchema).optional(),
  })
  .refine((i) => i.end === undefined || i.start !== undefined, { message: '`end` requires `start`' });

export const ExperienceGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(ExperienceItemSchema),
});

export const SkillBlockEntrySchema = z.object({
  title: z.string().min(1),
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
export type ExperienceGroup = z.infer<typeof ExperienceGroupSchema>;
export type SkillBlock = z.infer<typeof SkillBlockSchema>;
