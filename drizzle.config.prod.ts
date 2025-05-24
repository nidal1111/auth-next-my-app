import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.prod.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;