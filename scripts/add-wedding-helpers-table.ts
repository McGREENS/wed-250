import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function addWeddingHelpersTable() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS wedding_helpers (
        id TEXT PRIMARY KEY NOT NULL,
        wedding_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT,
        assigned_tasks TEXT,
        created_at INTEGER,
        updated_at INTEGER,
        FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
      )
    `);
    
    console.log("✓ wedding_helpers table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    client.close();
  }
}

addWeddingHelpersTable();
