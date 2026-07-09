import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  // Add columns if they don't exist (SQLite doesn't support IF NOT EXISTS for columns, so we try/catch each)
  const columns = [
    `ALTER TABLE tasks ADD COLUMN budget_type TEXT DEFAULT 'fixed'`,
    `ALTER TABLE tasks ADD COLUMN budget_percent REAL`,
    `ALTER TABLE tasks ADD COLUMN actual_spent REAL`,
  ];

  for (const sql of columns) {
    try {
      await client.execute(sql);
      console.log('OK:', sql);
    } catch (e) {
      if (e.message?.includes('duplicate column')) {
        console.log('Already exists, skipping:', sql);
      } else {
        throw e;
      }
    }
  }
  console.log('Migration complete.');
}

migrate().catch(console.error);
