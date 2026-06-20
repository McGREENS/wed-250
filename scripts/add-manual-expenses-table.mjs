import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addManualExpensesTable() {
  try {
    console.log('Creating manual_expenses table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS manual_expenses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        amount REAL NOT NULL,
        note TEXT,
        paid_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    console.log('Creating indexes...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_manual_expenses_user_id ON manual_expenses(user_id)
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_manual_expenses_category ON manual_expenses(category)
    `);

    console.log('✅ Manual expenses table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
}

addManualExpensesTable();
