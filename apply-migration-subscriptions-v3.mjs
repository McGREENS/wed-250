import { createClient } from "@libsql/client";
import { config } from "dotenv";

config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("\n💳 Subscriptions v3 Migration — Centiwise integration\n");
  console.log("   Adds TEST plan support, creates table if missing\n");

  try {
    // Step 1: Check if table exists at all
    console.log("Step 1️⃣  Checking if couple_subscriptions table exists...");
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='couple_subscriptions';"
    );
    const tableExists = tables.rows.length > 0;
    console.log("   " + (tableExists ? "✅ Table exists\n" : "⏳ Table not found — will create\n"));

    // Step 2: Create table fresh if it doesn't exist
    if (!tableExists) {
      console.log("Step 2️⃣  Creating couple_subscriptions table...");
      await db.execute(`
        CREATE TABLE couple_subscriptions (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          plan_name TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT NOT NULL DEFAULT 'RWF',
          pesapal_order_tracking_id TEXT,
          pesapal_merchant_reference TEXT,
          status TEXT NOT NULL DEFAULT 'PENDING',
          start_date INTEGER,
          end_date INTEGER,
          created_at INTEGER,
          updated_at INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      console.log("   ✅ Table created\n");
    } else {
      // Step 2 (table exists): Rebuild with updated constraints to include TEST plan
      console.log("Step 2️⃣  Rebuilding table to include TEST plan in plan_id...");

      // Create replacement table with no CHECK constraint (SQLite can't alter CHECK)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS couple_subscriptions_new (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          plan_name TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT NOT NULL DEFAULT 'RWF',
          pesapal_order_tracking_id TEXT,
          pesapal_merchant_reference TEXT,
          status TEXT NOT NULL DEFAULT 'PENDING',
          start_date INTEGER,
          end_date INTEGER,
          created_at INTEGER,
          updated_at INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Copy all existing rows
      await db.execute(`
        INSERT OR IGNORE INTO couple_subscriptions_new
          SELECT id, user_id, plan_id, plan_name, amount, currency,
                 pesapal_order_tracking_id, pesapal_merchant_reference,
                 status, start_date, end_date, created_at, updated_at
          FROM couple_subscriptions;
      `);

      const copied = await db.execute("SELECT COUNT(*) as total FROM couple_subscriptions_new;");
      console.log("   ✅ Copied " + copied.rows[0].total + " existing row(s)\n");

      await db.execute("DROP TABLE couple_subscriptions;");
      await db.execute("ALTER TABLE couple_subscriptions_new RENAME TO couple_subscriptions;");
      console.log("   ✅ Table rebuilt\n");
    }

    // Step 3: Create indexes
    console.log("Step 3️⃣  Creating indexes...");
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_user_id ON couple_subscriptions(user_id);"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_status ON couple_subscriptions(status);"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_couple_subscriptions_merchant_ref ON couple_subscriptions(pesapal_merchant_reference);"
    );
    console.log("   ✅ Indexes ready\n");

    // Step 4: Verify final structure
    console.log("Step 4️⃣  Verifying final table structure...");
    const pragma = await db.execute("PRAGMA table_info(couple_subscriptions);");
    console.log("   Columns:");
    pragma.rows.forEach(col => {
      console.log(`   • ${col.name} (${col.type}) ${col.notnull ? "NOT NULL" : ""} ${col.dflt_value ? "DEFAULT " + col.dflt_value : ""}`);
    });
    console.log("");

    // Step 5: Row count
    console.log("Step 5️⃣  Final row count...");
    const count = await db.execute("SELECT COUNT(*) as total FROM couple_subscriptions;");
    console.log("   ✅ Rows in table: " + count.rows[0].total + "\n");

    console.log("=".repeat(60));
    console.log("✅ MIGRATION COMPLETE — couple_subscriptions ready");
    console.log("   Supports plans: TEST (300 RWF) | INDIVIDUAL (30,000 RWF) | COUPLE (55,000 RWF)");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED:", error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();
