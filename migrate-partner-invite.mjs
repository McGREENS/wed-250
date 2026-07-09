import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log('Adding partner_user_id column to weddings table...');
  await client.execute(`ALTER TABLE weddings ADD COLUMN partner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL`);
  console.log('Migration successful!');
} catch (error) {
  if (error.message?.includes('duplicate column')) {
    console.log('Column already exists, skipping.');
  } else {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
} finally {
  client.close();
}
