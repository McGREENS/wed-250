import { config } from "dotenv";
import { createClient } from "@libsql/client";

config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  try {
    console.log("🔄 Running migration: Adding calendar_published column to vendors table...");
    
    await client.execute(`
      ALTER TABLE vendors ADD COLUMN calendar_published INTEGER DEFAULT 0;
    `);
    
    console.log("✅ Migration completed successfully!");
    console.log("✓ Added calendar_published column to vendors table");
  } catch (error) {
    if (error.message && error.message.includes("duplicate column")) {
      console.log("ℹ️  Column already exists, skipping...");
    } else {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }
}

migrate()
  .then(() => {
    console.log("✓ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });
