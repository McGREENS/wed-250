import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60,
});

export const db = drizzle(client, { schema });

// Migration function for tasks table and calendar_published column
export async function migrateTasks() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        timeline TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        custom INTEGER DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Tasks table created successfully!');

    try {
      await client.execute(`
        ALTER TABLE vendors ADD COLUMN calendar_published INTEGER DEFAULT 0;
      `);
      console.log('calendar_published column added to vendors table!');
    } catch (error: any) {
      if (error.message?.includes('duplicate column')) {
        console.log('calendar_published column already exists!');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
