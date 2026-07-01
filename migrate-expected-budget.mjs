import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log('Adding expected_budget column to tasks table...');
  await client.execute(`ALTER TABLE tasks ADD COLUMN expected_budget REAL`);
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
