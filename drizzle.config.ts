import 'dotenv/config';
import type { Config } from 'drizzle-kit';
 
export default {
	schema: './api/drizzle/schema.ts',
	out: './api/drizzle/migrations',
	driver: 'turso', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        url: "libsql://resume-website-mcm218.turso.io",
        authToken: process.env.TURSO_TOKEN,
	},
} satisfies Config;