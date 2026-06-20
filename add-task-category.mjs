import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addCategoryColumn() {
  try {
    console.log("\n=== Adding category column to tasks table ===\n");
    
    // Add category column
    await client.execute(`
      ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT 'General';
    `);
    console.log("✓ Added category column to tasks table");
    
    // Verify
    const info = await client.execute(`PRAGMA table_info(tasks)`);
    console.log("\n✓ tasks table now has these columns:");
    info.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
    
    console.log("\n✅ Migration completed successfully!\n");
    
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log("✓ Category column already exists");
    } else {
      console.error("❌ Error:", error);
    }
  } finally {
    await client.close();
  }
}

addCategoryColumn();
