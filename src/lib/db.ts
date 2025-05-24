import { drizzle as drizzlePg } from 'drizzle-orm/vercel-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { sql } from '@vercel/postgres';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';

// Import both schemas
import * as sqliteSchema from './db/schema';
import * as pgSchema from './db/schema.prod';

// Determine which database and schema to use
const isProduction = process.env.POSTGRES_URL !== undefined;

// Create the appropriate database instance
let db: any;
let users: any;

if (isProduction) {
  // Use Vercel Postgres in production
  db = drizzlePg(sql, { schema: pgSchema });
  users = pgSchema.users;
} else {
  // Use SQLite for local development
  const sqlite = new Database('sqlite.db');
  db = drizzleSqlite(sqlite, { schema: sqliteSchema });
  users = sqliteSchema.users;
  
  // Initialize SQLite tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
}

// Helper functions that work with both databases
export async function createUser(email: string, password: string, name: string) {
  const result = await db.insert(users).values({
    email,
    password,
    name,
    createdAt: new Date(),
  }).returning();
  
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function getUserById(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  const result = await db.select().from(users).where(eq(users.id, numericId)).limit(1);
  return result[0] || null;
}

export { db };