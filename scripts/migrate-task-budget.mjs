import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const addCols = [
    `ALTER TABLE tasks ADD COLUMN quantity REAL`,
    `ALTER TABLE tasks ADD COLUMN unit_price REAL`,
    `ALTER TABLE tasks ADD COLUMN deposit REAL`,
    `ALTER TABLE tasks ADD COLUMN market_price REAL`,
  ];

  for (const sql of addCols) {
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
