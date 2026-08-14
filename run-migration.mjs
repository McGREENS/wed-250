import { createClient } from "@libsql/client";

async function runMigration() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("\n📦 Vendor Booking Capacity Migration\n");
  console.log("Database:", process.env.TURSO_DATABASE_URL);
  console.log("");

  try {
    // Step 1: Check if column already exists
    console.log("Step 1: Checking if column exists...");
    const existingSchema = await db.execute("PRAGMA table_info(vendors);");
    const columnExists = existingSchema.rows.some(row => row.name === 'max_bookings_per_day');

    if (columnExists) {
      console.log("✅ Column already exists, skipping creation\n");
    } else {
      console.log("⏳ Column does not exist, adding...");
      
      // Add the column
      await db.execute("ALTER TABLE vendors ADD COLUMN max_bookings_per_day INTEGER DEFAULT 1;");
      console.log("✅ Column created successfully\n");
    }

    // Step 2: Create index
    console.log("Step 2: Creating performance index...");
    try {
      await db.execute("CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON bookings(vendor_id, event_date);");
      console.log("✅ Index created (or already exists)\n");
    } catch (err) {
      console.log("⚠️  Index creation skipped (may already exist)\n");
    }

    // Step 3: Verify
    console.log("Step 3: Verifying migration...");
    const finalSchema = await db.execute("PRAGMA table_info(vendors);");
    const finalColumn = finalSchema.rows.find(row => row.name === 'max_bookings_per_day');

    if (finalColumn) {
      console.log("✅ Column verified!\n");
      console.log("Column Details:");
      console.log(`  Name: ${finalColumn.name}`);
      console.log(`  Type: ${finalColumn.type}`);
      console.log(`  Default: ${finalColumn.dflt_value}\n`);
    } else {
      console.log("❌ Verification failed - column not found\n");
      return;
    }

    // Step 4: Show sample data
    console.log("Step 4: Checking existing vendors...");
    const vendors = await db.execute(
      "SELECT id, business_name, max_bookings_per_day FROM vendors LIMIT 5;"
    );

    if (vendors.rows.length > 0) {
      console.log(`✅ Found ${vendors.rows.length} vendor(s)\n`);
      console.log("Sample vendors:");
      vendors.rows.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.business_name}`);
        console.log(`     Max Bookings/Day: ${v.max_bookings_per_day}`);
      });
    } else {
      console.log("ℹ️  No vendors in database yet\n");
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ MIGRATION SUCCESSFUL!");
    console.log("=".repeat(50) + "\n");

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED:");
    console.error("Error:", error.message);
    console.error("\nStack:", error.stack);
    process.exit(1);
  }
}

runMigration();
