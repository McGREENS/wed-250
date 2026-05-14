// @ts-nocheck 
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../lib/db/schema";
import bcrypt from "bcryptjs";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Admin User
    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(schema.users).values({
      name: "Admin User",
      email: "admin@andiza.co.rw",
      password: adminPassword,
      role: "ADMIN",
      phone: "+250788000001",
    }).returning();
    console.log("✓ Admin created:", admin.email);

    // 2. Create Couple Users
    console.log("Creating couple users...");
    const couplePassword = await bcrypt.hash("couple123", 10);
    const couples = await db.insert(schema.users).values([
      {
        name: "John & Jane Doe",
        email: "couple1@test.com",
        password: couplePassword,
        role: "COUPLE",
        phone: "+250788000002",
      },
      {
        name: "Mike & Sarah Smith",
        email: "couple2@test.com",
        password: couplePassword,
        role: "COUPLE",
        phone: "+250788000003",
      },
    ]).returning();
    console.log(`✓ Created ${couples.length} couple users`);

    // 3. Create Vendor Users & Vendors
    console.log("Creating vendors...");
    const vendorPassword = await bcrypt.hash("vendor123", 10);
    
    const vendorData = [
      {
        name: "Elite Photography",
        email: "photo@test.com",
        category: "Photography",
        businessName: "Elite Photography Studio",
        description: "Professional wedding photography with 10+ years experience. Capturing your special moments with artistic excellence.",
        location: "Kigali, Rwanda",
        priceRange: "500,000 - 2,000,000 RWF",
        images: JSON.stringify(["/photography.jpg"]),
        portfolio: JSON.stringify(["/photography.jpg"]),
      },
      {
        name: "Royal Catering",
        email: "catering@test.com",
        category: "Catering",
        businessName: "Royal Catering Services",
        description: "Exquisite catering services for weddings and events. International and local cuisine.",
        location: "Kigali, Rwanda",
        priceRange: "1,000,000 - 5,000,000 RWF",
        images: JSON.stringify(["/planner.jpg"]),
        portfolio: JSON.stringify(["/planner.jpg"]),
      },
      {
        name: "Elegant Decor",
        email: "decor@test.com",
        category: "Decoration",
        businessName: "Elegant Event Decorations",
        description: "Transform your venue into a dream setting with our creative decoration services.",
        location: "Kigali, Rwanda",
        priceRange: "300,000 - 1,500,000 RWF",
        images: JSON.stringify(["/decor.jpg"]),
        portfolio: JSON.stringify(["/decor.jpg"]),
      },
      {
        name: "Sound & Beats",
        email: "music@test.com",
        category: "Music & Entertainment",
        businessName: "Sound & Beats Entertainment",
        description: "Professional DJ services and live bands for unforgettable wedding entertainment.",
        location: "Kigali, Rwanda",
        priceRange: "200,000 - 1,000,000 RWF",
        images: JSON.stringify(["/entertainment.jpg"]),
        portfolio: JSON.stringify(["/entertainment.jpg"]),
      },
      {
        name: "Perfect Day Planners",
        email: "planner@test.com",
        category: "Wedding Planning",
        businessName: "Perfect Day Wedding Planners",
        description: "Full-service wedding planning to make your special day stress-free and perfect.",
        location: "Kigali, Rwanda",
        priceRange: "800,000 - 3,000,000 RWF",
        images: JSON.stringify(["/planner.jpg"]),
        portfolio: JSON.stringify(["/planner.jpg"]),
      },
    ];

    const vendors = [];
    for (const vd of vendorData) {
      const [vendorUser] = await db.insert(schema.users).values({
        name: vd.name,
        email: vd.email,
        password: vendorPassword,
        role: "VENDOR",
        phone: `+25078800000${vendors.length + 4}`,
      }).returning();

      const [vendor] = await db.insert(schema.vendors).values({
        userId: vendorUser.id,
        businessName: vd.businessName,
        category: vd.category,
        description: vd.description,
        location: vd.location,
        priceRange: vd.priceRange,
        rating: Math.random() * 2 + 3, // 3-5 rating
        reviewCount: Math.floor(Math.random() * 50) + 10,
        featured: vendors.length < 3,
        verified: true,
        images: vd.images,
        portfolio: vd.portfolio,
      }).returning();

      vendors.push(vendor);
    }
    console.log(`✓ Created ${vendors.length} vendors`);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n🔑 Test Credentials:");
    console.log("═══════════════════════════════════════");
    console.log("Admin:");
    console.log("  Email: admin@andiza.co.rw");
    console.log("  Password: admin123");
    console.log("\nCouple Users:");
    console.log("  Email: couple1@test.com | Password: couple123");
    console.log("  Email: couple2@test.com | Password: couple123");
    console.log("\nVendor Users:");
    console.log("  Email: photo@test.com | Password: vendor123");
    console.log("  Email: catering@test.com | Password: vendor123");
    console.log("  Email: decor@test.com | Password: vendor123");
    console.log("  Email: music@test.com | Password: vendor123");
    console.log("  Email: planner@test.com | Password: vendor123");
    console.log("═══════════════════════════════════════\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✓ Seed script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });
