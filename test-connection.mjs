import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  const result = await db.execute("SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';");
  console.log("✅ Database connected");
  console.log("Tables in database:", result.rows[0].table_count);
} catch (e) {
  console.error("❌ Connection failed:", e.message);
}
