import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import * as schema from './schema.prod';

export const db = drizzle(sql, { schema });

// Helper functions for user operations
export async function createUser(email: string, password: string, name: string) {
  const result = await db.insert(schema.users).values({
    email,
    password,
    name,
    createdAt: new Date(),
  }).returning();
  
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  return result[0] || null;
}

export async function getUserById(id: number) {
  const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  return result[0] || null;
}