import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  try {
    console.log('Updating helper_task_progress table...');

    // Add task_id column
    await client.execute(`
      ALTER TABLE helper_task_progress ADD COLUMN task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE;
    `);
    console.log('✓ Added task_id column');

    console.log('\n✅ Migration completed successfully!');
    console.log('\n⚠️  Note: You may need to manually update existing progress records or clear old data.');
  } catch (error: any) {
    if (error.message?.includes('duplicate column name')) {
      console.log('⚠️  Column already exists, skipping migration');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
