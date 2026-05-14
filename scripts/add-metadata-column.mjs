import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addMetadataColumn() {
  try {
    console.log('Adding metadata column to pending_vendor_signups table...');
    await db.execute(`
      ALTER TABLE pending_vendor_signups ADD COLUMN metadata TEXT
    `);

    console.log('✅ Metadata column added successfully!');
  } catch (error) {
    console.error('❌ Error adding column:', error);
  }
}

addMetadataColumn();
