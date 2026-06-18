import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function applySchemaChanges() {
  try {
    console.log("\n=== Applying Schema Changes to Production ===\n");
    
    // Create wedding_helpers table
    console.log("1. Creating wedding_helpers table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS wedding_helpers (
        id TEXT PRIMARY KEY NOT NULL,
        wedding_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT,
        assigned_tasks TEXT,
        helper_user_id TEXT,
        access_token TEXT UNIQUE,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
        FOREIGN KEY (helper_user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("✓ wedding_helpers table created");
    
    // Create helper_task_progress table
    console.log("\n2. Creating helper_task_progress table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS helper_task_progress (
        id TEXT PRIMARY KEY NOT NULL,
        helper_id TEXT NOT NULL,
        task_id TEXT,
        task_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        comments TEXT,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (helper_id) REFERENCES wedding_helpers(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);
    console.log("✓ helper_task_progress table created");
    
    // Add missing columns to tasks table
    console.log("\n3. Adding columns to tasks table...");
    
    const tasksColumns = [
      { name: 'assigned_helper_id', sql: 'ALTER TABLE tasks ADD COLUMN assigned_helper_id TEXT REFERENCES wedding_helpers(id)' },
      { name: 'due_date', sql: 'ALTER TABLE tasks ADD COLUMN due_date INTEGER' },
      { name: 'priority', sql: "ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'" },
      { name: 'notes', sql: 'ALTER TABLE tasks ADD COLUMN notes TEXT' }
    ];
    
    for (const col of tasksColumns) {
      try {
        await client.execute(col.sql);
        console.log(`  ✓ Added ${col.name}`);
      } catch (err) {
        if (err.message.includes('duplicate column')) {
          console.log(`  - ${col.name} already exists`);
        } else {
          console.log(`  ✗ Error adding ${col.name}: ${err.message}`);
        }
      }
    }
    
    console.log("\n✅ Schema changes applied successfully!\n");
    
    // Verify
    console.log("=== Verification ===\n");
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND (name='wedding_helpers' OR name='helper_task_progress')
      ORDER BY name;
    `);
    
    console.log("Tables found:");
    tables.rows.forEach(r => console.log(`  ✓ ${r.name}`));
    
    const weddingHelpersInfo = await client.execute(`PRAGMA table_info(wedding_helpers)`);
    console.log(`\nwedding_helpers has ${weddingHelpersInfo.rows.length} columns`);
    
    const tasksInfo = await client.execute(`PRAGMA table_info(tasks)`);
    console.log(`tasks has ${tasksInfo.rows.length} columns\n`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

applySchemaChanges();
