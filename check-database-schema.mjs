import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkDatabaseSchema() {
  try {
    console.log("\n=== Checking Database Schema ===\n");
    
    // Get all tables
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    console.log("📋 All Tables in Database:");
    console.log(tables.rows.map(r => r.name).join(", "));
    console.log("\n");
    
    // Check wedding_helpers table specifically
    console.log("🔍 Checking wedding_helpers table structure:\n");
    const weddingHelpersInfo = await client.execute(`
      PRAGMA table_info(wedding_helpers);
    `);
    
    if (weddingHelpersInfo.rows.length > 0) {
      console.log("wedding_helpers columns:");
      weddingHelpersInfo.rows.forEach(col => {
        console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
      });
    } else {
      console.log("❌ wedding_helpers table does not exist!");
    }
    
    console.log("\n");
    
    // Check tasks table
    console.log("🔍 Checking tasks table structure:\n");
    const tasksInfo = await client.execute(`
      PRAGMA table_info(tasks);
    `);
    
    if (tasksInfo.rows.length > 0) {
      console.log("tasks columns:");
      tasksInfo.rows.forEach(col => {
        console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
      });
    } else {
      console.log("❌ tasks table does not exist!");
    }
    
    console.log("\n");
    
    // Check if migrations table exists
    const migrationsCheck = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='__drizzle_migrations';
    `);
    
    if (migrationsCheck.rows.length > 0) {
      console.log("📝 Migration History:");
      const migrations = await client.execute(`
        SELECT * FROM __drizzle_migrations ORDER BY created_at;
      `);
      migrations.rows.forEach(m => {
        console.log(`  - ${m.hash} (${new Date(m.created_at).toISOString()})`);
      });
    } else {
      console.log("⚠️  No migrations table found - database may not have been migrated");
    }
    
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await client.close();
  }
}

checkDatabaseSchema();
