import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("\n💳 Subscriptions v2 Migration — update plan_id values\n");

  try {
    // SQLite doesn't support ALTER COLUMN so we recreate the table
    console.log("Step 1️⃣  Recreating couple_subscriptions with updated plan_id constraint...");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS couple_subscriptions_new (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id TEXT NOT NULL CHECK(plan_id IN ('INDIVIDUAL', 'COUPLE')),
        plan_name TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'RWF',
        pesapal_order_tracking_id TEXT UNIQUE,
        pesapal_merchant_reference TEXT UNIQUE,
        status TEXT NOT NULL DEFAULT 'PENDING'
          CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
        start_date INTEGER,
        end_date INTEGER,
        created_at INTEGER,
        updated_at INTEGER
      );
    `);
    console.log("   ✅ New table created\n");

    console.log("Step 2️⃣  Copying existing rows (if any)...");
    await db.execute(`
      INSERT INTO couple_subscriptions_new
        SELECT * FROM couple_subscriptions
        WHERE plan_id IN ('INDIVIDUAL', 'COUPLE');
    `);
    console.log("   ✅ Rows copied\n");

    console.log("Step 3️⃣  Dropping old table...");
    await db.execute(`DROP TABLE couple_subscriptions;`);
    console.log("   ✅ Old table dropped\n");

    console.log("Step 4️⃣  Renaming new table...");
    await db.execute(`ALTER TABLE couple_subscriptions_new RENAME TO couple_subscriptions;`);
    console.log("   ✅ Table renamed\n");

    console.log("Step 5️⃣  Recreating indexes...");
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_user_id ON couple_subscriptions(user_id);`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_status ON couple_subscriptions(status);`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_merchant_ref ON couple_subscriptions(pesapal_merchant_reference);`);
    console.log("   ✅ Indexes created\n");

    console.log("Step 6️⃣  Verifying...");
    const count = await db.execute("SELECT COUNT(*) as total FROM couple_subscriptions;");
    console.log("   ✅ Rows in table: " + count.rows[0].total + "\n");

    console.log("=".repeat(60));
    console.log("✅ MIGRATION COMPLETE — plan_id updated to INDIVIDUAL | COUPLE");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED:", error.message);
    process.exit(1);
  }
}

migrate();
