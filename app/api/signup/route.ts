import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vendors, weddings } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password } = body;

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (type === "couple") {
      const { name, weddingDate } = body;

      // Create user
      const [user] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role: "COUPLE",
      }).returning();

      // Create wedding if date provided
      if (weddingDate) {
        await db.insert(weddings).values({
          userId: user.id,
          coupleNames: name,
          weddingDate: new Date(weddingDate),
        });
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(email, name, "COUPLE");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail signup if email fails
      }

      return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    } else if (type === "vendor") {
      const { businessName, phone, serviceCategory } = body;

      // Create user
      const [user] = await db.insert(users).values({
        name: businessName,
        email,
        password: hashedPassword,
        role: "VENDOR",
        phone,
      }).returning();

      // Create vendor profile
      await db.insert(vendors).values({
        userId: user.id,
        businessName,
        category: serviceCategory,
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(email, businessName, "VENDOR");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail signup if email fails
      }

      return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    }

    return NextResponse.json({ error: "Invalid signup type" }, { status: 400 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
