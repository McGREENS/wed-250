import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addColorColumn() {
  try {
    console.log('Adding color column to invoices table...');
    
    await client.execute(`
      ALTER TABLE invoices ADD COLUMN color TEXT DEFAULT '#8B4513';
    `);
    
    console.log('✅ Color column added successfully!');
  } catch (error) {
    console.error('Error adding color column:', error);
  } finally {
    client.close();
  }
}

addColorColumn();
