import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("\n💳 Couple Subscriptions Migration (PesaPal)\n");

  try {
    // Step 1: Create couple_subscriptions table
    console.log("Step 1️⃣  Creating couple_subscriptions table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS couple_subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id TEXT NOT NULL CHECK(plan_id IN ('BASIC', 'STANDARD', 'PREMIUM')),
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
    console.log("   ✅ Table created (or already exists)\n");

    // Step 2: Create indexes for fast lookups
    console.log("Step 2️⃣  Creating indexes...");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_user_id
        ON couple_subscriptions(user_id);
    `);
    console.log("   ✅ Index on user_id created\n");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_status
        ON couple_subscriptions(status);
    `);
    console.log("   ✅ Index on status created\n");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_merchant_ref
        ON couple_subscriptions(pesapal_merchant_reference);
    `);
    console.log("   ✅ Index on pesapal_merchant_reference created\n");

    // Step 3: Verify table structure
    console.log("Step 3️⃣  Verifying table structure...");
    const schema = await db.execute("PRAGMA table_info(couple_subscriptions);");
    const columns = schema.rows.map((r) => r.name);
    const required = [
      "id", "user_id", "plan_id", "plan_name", "amount", "currency",
      "pesapal_order_tracking_id", "pesapal_merchant_reference",
      "status", "start_date", "end_date", "created_at", "updated_at",
    ];
    const missing = required.filter((c) => !columns.includes(c));

    if (missing.length > 0) {
      throw new Error(`Missing columns: ${missing.join(", ")}`);
    }
    console.log("   ✅ All required columns present\n");
    console.log("   Columns: " + columns.join(", ") + "\n");

    // Step 4: Row count
    console.log("Step 4️⃣  Checking existing rows...");
    const count = await db.execute("SELECT COUNT(*) as total FROM couple_subscriptions;");
    console.log("   ✅ Existing subscriptions: " + count.rows[0].total + "\n");

    console.log("=".repeat(60));
    console.log("✅ MIGRATION COMPLETE — couple_subscriptions table is ready!");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED:");
    console.error("Error: " + error.message);
    process.exit(1);
  }
}

migrate();
