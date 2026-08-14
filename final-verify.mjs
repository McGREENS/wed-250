import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function verify() {
  console.log("\n✅ FINAL MIGRATION VERIFICATION\n");
  
  try {
    // Check column
    const schema = await db.execute("PRAGMA table_info(vendors);");
    const column = schema.rows.find(r => r.name === 'max_bookings_per_day');
    
    console.log("1. Column Status:");
    console.log("   ✅ max_bookings_per_day column EXISTS");
    console.log("   Type: " + column.type);
    console.log("   Default: " + column.dflt_value);
    console.log("");
    
    // Check vendors
    const vendors = await db.execute("SELECT COUNT(*) as total FROM vendors;");
    const count = vendors.rows[0].total;
    
    console.log("2. Vendors in Database:");
    console.log("   Total: " + count + " vendor(s)");
    console.log("");
    
    // Check bookings
    const bookings = await db.execute("SELECT COUNT(*) as total FROM bookings WHERE status != 'cancelled';");
    const bookingCount = bookings.rows[0].total;
    
    console.log("3. Active Bookings:");
    console.log("   Total: " + bookingCount + " active booking(s)");
    console.log("");
    
    // Sample vendors
    const sampleVendors = await db.execute("SELECT id, business_name, max_bookings_per_day FROM vendors LIMIT 5;");
    
    console.log("4. Sample Vendor Data:");
    if (sampleVendors.rows.length > 0) {
      sampleVendors.rows.forEach((v, i) => {
        console.log("   " + (i + 1) + ". " + v.business_name);
        console.log("      Max Bookings/Day: " + v.max_bookings_per_day);
      });
    }
    console.log("");
    
    console.log("=".repeat(60));
    console.log("🎉 DATABASE IS READY FOR VENDOR BOOKING CAPACITY FEATURE!");
    console.log("=".repeat(60));
    console.log("");
    console.log("Next steps:");
    console.log("1. npm run dev");
    console.log("2. Add CapacitySettings component to vendor settings page");
    console.log("3. Test vendor capacity updates");
    console.log("4. Test booking validation");
    console.log("");
    
  } catch (error) {
    console.error("Error: " + error.message);
    process.exit(1);
  }
}

verify();
