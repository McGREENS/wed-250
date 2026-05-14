import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addMessagingTables() {
  try {
    console.log('Creating conversations table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
        couple_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
        last_message_at INTEGER,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    console.log('Creating messages table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at INTEGER
      )
    `);

    console.log('✅ Messaging tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

addMessagingTables();
