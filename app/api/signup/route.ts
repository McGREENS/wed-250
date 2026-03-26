import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vendors, weddings } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";
import type { InferInsertModel } from "drizzle-orm";

type NewUser = InferInsertModel<typeof users>;

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
      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role: "COUPLE",
      } as any);

      // Get the created user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      // Create wedding if date provided
      if (weddingDate && user) {
        await db.insert(weddings).values({
          userId: user.id,
          coupleNames: name,
          weddingDate: new Date(weddingDate),
        } as any);
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(email, name, "COUPLE");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail signup if email fails
      }

      return NextResponse.json({ success: true, user: { id: user?.id, email, role: "COUPLE" } });
    } else if (type === "vendor") {
      const { businessName, phone, serviceCategory } = body;

      // Create user
      await db.insert(users).values({
        name: businessName,
        email,
        password: hashedPassword,
        role: "VENDOR",
        phone,
      } as any);

      // Get the created user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      // Create vendor profile
      if (user) {
        await db.insert(vendors).values({
          userId: user.id,
          businessName,
          category: serviceCategory,
        } as any);
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(email, businessName, "VENDOR");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail signup if email fails
      }

      return NextResponse.json({ success: true, user: { id: user?.id, email, role: "VENDOR" } });
    }

    return NextResponse.json({ error: "Invalid signup type" }, { status: 400 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
