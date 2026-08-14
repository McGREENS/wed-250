import { createClient } from "@libsql/client";

async function verifyMigration() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("\n🔍 Verifying Migration...\n");

  try {
    // Check if column exists
    const result = await db.execute("PRAGMA table_info(vendors);");
    
    const hasColumn = result.rows.some(row => row.name === 'max_bookings_per_day');
    
    if (hasColumn) {
      console.log("✅ Column 'max_bookings_per_day' EXISTS in vendors table\n");
      
      // Show column details
      const columnInfo = result.rows.find(row => row.name === 'max_bookings_per_day');
      console.log("Column Details:");
      console.log(`  Name: ${columnInfo.name}`);
      console.log(`  Type: ${columnInfo.type}`);
      console.log(`  NotNull: ${columnInfo.notnull}`);
      console.log(`  Default: ${columnInfo.dflt_value}`);
    } else {
      console.log("❌ Column 'max_bookings_per_day' NOT FOUND in vendors table\n");
      console.log("Available columns:");
      result.rows.forEach(row => {
        console.log(`  - ${row.name} (${row.type})`);
      });
    }

    // Check sample vendors
    console.log("\n📊 Sample Vendors:\n");
    const vendorResult = await db.execute(
      "SELECT id, business_name, max_bookings_per_day FROM vendors LIMIT 3;"
    );

    if (vendorResult.rows.length > 0) {
      vendorResult.rows.forEach(vendor => {
        console.log(`  Vendor: ${vendor.business_name}`);
        console.log(`    Max Bookings/Day: ${vendor.max_bookings_per_day || 'NULL'}`);
      });
    } else {
      console.log("  No vendors found in database");
    }

    console.log("\n✅ Migration verification complete!\n");
  } catch (error) {
    console.error("❌ Error verifying migration:", error.message);
  }
}

verifyMigration();
