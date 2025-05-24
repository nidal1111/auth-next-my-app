import { db } from './db/index';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(email: string, password: string, name: string) {
  const result = await db.insert(users).values({
    email,
    password,
    name,
  }).returning();
  
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, parseInt(id)));
  return result[0];
}