import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  try {
    console.log('Adding new columns to tasks table...');

    // Add new columns to tasks table
    await client.execute(`
      ALTER TABLE tasks ADD COLUMN assigned_helper_id TEXT REFERENCES wedding_helpers(id) ON DELETE SET NULL;
    `);
    console.log('✓ Added assigned_helper_id column');

    await client.execute(`
      ALTER TABLE tasks ADD COLUMN due_date INTEGER;
    `);
    console.log('✓ Added due_date column');

    await client.execute(`
      ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium';
    `);
    console.log('✓ Added priority column');

    await client.execute(`
      ALTER TABLE tasks ADD COLUMN notes TEXT;
    `);
    console.log('✓ Added notes column');

    console.log('\n✅ Migration completed successfully!');
  } catch (error: any) {
    if (error.message?.includes('duplicate column name')) {
      console.log('⚠️  Columns already exist, skipping migration');
    } else {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
