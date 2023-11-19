import {
    index,
    integer,
    real,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { ContactMe } from '../models/contact-me';
import { Education } from '../models/education';
import { Role } from '../models/role';
import { SkillBlock } from '../models/skill-block';


export const resumes = sqliteTable(
    'resumes',
    {
        id: text("id").primaryKey(),
        contact: text("contact", { mode: 'json' }).$type<ContactMe>(),
        education: text("education", { mode: 'json' }).$type<Education>(),
        experience: text("experience", { mode: 'json' }).$type<Role[]>(),
        skills: text("skills", { mode: 'json' }).$type<SkillBlock[]>(), 
    }
);
    
