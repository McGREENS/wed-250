import dotenv from "dotenv";
import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  console.log("Creating public_referral_links table...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS public_referral_links (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      referral_code TEXT NOT NULL UNIQUE,
      referral_role TEXT NOT NULL,
      title TEXT,
      description TEXT,
      usage_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log("✓ public_referral_links table created successfully");
  process.exit(0);
} catch (error) {
  console.error("Error creating table:", error);
  process.exit(1);
}
