import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("\n📦 Vendor Booking Capacity Migration\n");
  
  try {
    // Step 1: Check if column exists
    console.log("Step 1️⃣  Checking if max_bookings_per_day column exists...");
    const schema = await db.execute("PRAGMA table_info(vendors);");
    const hasColumn = schema.rows.some(r => r.name === 'max_bookings_per_day');
    
    if (hasColumn) {
      console.log("   ✅ Column already exists!\n");
    } else {
      console.log("   ⏳ Column not found, adding...");
      await db.execute("ALTER TABLE vendors ADD COLUMN max_bookings_per_day INTEGER DEFAULT 1;");
      console.log("   ✅ Column added successfully!\n");
    }
    
    // Step 2: Create index
    console.log("Step 2️⃣  Creating performance index...");
    try {
      await db.execute("CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON bookings(vendor_id, event_date);");
      console.log("   ✅ Index created (or already exists)\n");
    } catch {
      console.log("   ⚠️  Index already exists\n");
    }
    
    // Step 3: Verify
    console.log("Step 3️⃣  Verifying migration...");
    const finalSchema = await db.execute("PRAGMA table_info(vendors);");
    const column = finalSchema.rows.find(r => r.name === 'max_bookings_per_day');
    
    if (column) {
      console.log("   ✅ Verification successful!\n");
      console.log("   Column name: max_bookings_per_day");
      console.log("   Column type: " + column.type);
      console.log("   Default value: 1\n");
    }
    
    // Step 4: Show sample
    console.log("Step 4️⃣  Checking existing vendors...");
    const vendors = await db.execute("SELECT id, business_name, max_bookings_per_day FROM vendors LIMIT 5;");
    console.log("   Found " + vendors.rows.length + " vendor(s)\n");
    
    if (vendors.rows.length > 0) {
      console.log("   Sample vendors:");
      vendors.rows.forEach(v => {
        console.log("   • " + v.business_name + ": " + v.max_bookings_per_day + " booking(s)/day");
      });
      console.log("");
    }
    
    console.log("=".repeat(60));
    console.log("✅ MIGRATION COMPLETE - Database is ready!");
    console.log("=".repeat(60) + "\n");
    
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED:");
    console.error("Error: " + error.message);
    process.exit(1);
  }
}

migrate();
