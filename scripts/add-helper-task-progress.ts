import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function addHelperTaskProgressTable() {
  try {
    console.log("Creating helper_task_progress table...");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS helper_task_progress (
        id TEXT PRIMARY KEY,
        helper_id TEXT NOT NULL,
        task_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        comments TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (helper_id) REFERENCES wedding_helpers(id) ON DELETE CASCADE
      )
    `);

    console.log("✓ helper_task_progress table created successfully");
  } catch (error) {
    console.error("Error creating helper_task_progress table:", error);
  } finally {
    client.close();
  }
}

addHelperTaskProgressTable();
