import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function updateWeddingHelpersTable() {
  try {
    const tableInfo = await client.execute(`PRAGMA table_info(wedding_helpers)`);
    const columns = tableInfo.rows.map((row: any) => row.name);
    
    if (!columns.includes('helper_user_id')) {
      await client.execute(`
        ALTER TABLE wedding_helpers ADD COLUMN helper_user_id TEXT REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log("✓ helper_user_id column added");
    } else {
      console.log("✓ helper_user_id column already exists");
    }
    
    if (!columns.includes('access_token')) {
      await client.execute(`
        ALTER TABLE wedding_helpers ADD COLUMN access_token TEXT
      `);
      console.log("✓ access_token column added");
    } else {
      console.log("✓ access_token column already exists");
    }
    
    console.log("\n✓ Wedding helpers table updated successfully!");
  } catch (error) {
    console.error("Error updating table:", error);
  } finally {
    client.close();
  }
}

updateWeddingHelpersTable();
