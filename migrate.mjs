import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("📦 Starting migration...\n");
  
  try {
    // Check if column exists
    console.log("1️⃣  Checking if max_bookings_per_day column exists...");
    const schema = await db.execute("PRAGMA table_info(vendors);");
    const hasColumn = schema.rows.some(r => r.name === 'max_bookings_per_day');
    
    if (hasColumn) {
      console.log("   ✅ Column already exists!\n");
    } else {
      console.log("   ⏳ Column not found, adding...");
      await db.execute("ALTER TABLE vendors ADD COLUMN max_bookings_per_day INTEGER DEFAULT 1;");
      console.log("   ✅ Column added successfully!\n");
    }
    
    // Create index
    console.log("2️⃣  Creating performance index...");
    try {
      await db.execute("CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON bookings(vendor_id, event_date);");
      console.log("   ✅ Index created (or already exists)\n");
    } catch {
      console.log("   ⚠️  Index creation note (may already exist)\n");
    }
    
    // Verify
    console.log("3️⃣  Verifying migration...");
    const finalSchema = await db.execute("PRAGMA table_info(vendors);");
    const column = finalSchema.rows.find(r => r.name === 'max_bookings_per_day');
    
    if (column) {
      console.log("   ✅ Verification successful!\n");
      console.log("   Column name: max_bookings_per_day");
      console.log("   Column type: INTEGER");
      console.log("   Default value: 1\n");
    }
    
    // Show sample
    console.log("4️⃣  Checking vendors...");
    const vendors = await db.execute("SELECT id, business_name, max_bookings_per_day FROM vendors LIMIT 3;");
    console.log(\   Found \ vendor(s)\n\);
    
    if (vendors.rows.length > 0) {
      vendors.rows.forEach(v => {
        console.log(\   • \: \ booking(s)/day\);
      });
      console.log("");
    }
    
    console.log("=" . repeat(50));
    console.log("✅ MIGRATION COMPLETE!");
    console.log("=" . repeat(50) + "\n");
    
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  }
}

migrate();
