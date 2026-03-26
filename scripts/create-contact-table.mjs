import { createClient } from '@libsql/client';
import 'dotenv/config';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createContactMessagesTable() {
  try {
    console.log('Creating contact_messages table...');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'UNREAD',
        created_at INTEGER
      )
    `);

    console.log('✅ contact_messages table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    db.close();
  }
}

createContactMessagesTable();
