import 'dotenv/config';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log('Starting migration...');

  try {
    // Check and migrate existing category data to categories array
    console.log('Migrating category data to categories array...');
    const vendors = await db.execute('SELECT id, category, categories FROM vendors');
    
    for (const vendor of vendors.rows) {
      // Only migrate if categories is null and category exists
      if (!vendor.categories && vendor.category) {
        const categories = JSON.stringify([vendor.category]);
        await db.execute({
          sql: 'UPDATE vendors SET categories = ? WHERE id = ?',
          args: [categories, vendor.id]
        });
        console.log(`Migrated vendor ${vendor.id}: ${vendor.category} -> ${categories}`);
      }
    }

    // Set default serviceType for existing service packages
    console.log('Setting default serviceType for existing packages...');
    await db.execute(`UPDATE service_packages SET service_type = 'General' WHERE service_type IS NULL OR service_type = ''`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrate();
