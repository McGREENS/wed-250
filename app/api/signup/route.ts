import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vendors, weddings, referrals } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";
import type { InferInsertModel } from "drizzle-orm";

type NewUser = InferInsertModel<typeof users>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password, referralCode } = body;

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Validate referral code if provided
    let referralRecord = null;
    if (referralCode) {
      const [referral] = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referralCode, referralCode),
            eq(referrals.status, 'PENDING')
          )
        )
        .limit(1);

      if (!referral) {
        return NextResponse.json(
          { error: "Invalid or expired referral code" },
          { status: 400 }
        );
      }

      // Check if referral email matches
      if (referral.referredEmail !== email) {
        return NextResponse.json(
          { error: "This referral code is for a different email address" },
          { status: 400 }
        );
      }

      // Check if referral has expired
      const now = new Date();
      const expiresAt = new Date(referral.expiresAt);
      if (now > expiresAt) {
        await db
          .update(referrals)
          .set({ status: 'EXPIRED' as const, updatedAt: new Date() } as any)
          .where(eq(referrals.id, referral.id));
        
        return NextResponse.json(
          { error: "This referral link has expired" },
          { status: 400 }
        );
      }

      referralRecord = referral;
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
      }

      // Update referral if exists
      if (referralRecord && user) {
        await db
          .update(referrals)
          .set({
            status: 'ACCEPTED' as const,
            referredUserId: user.id,
            acceptedAt: new Date(),
            updatedAt: new Date(),
          } as any)
          .where(eq(referrals.id, referralRecord.id));
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
      }

      // Update referral if exists
      if (referralRecord && user) {
        await db
          .update(referrals)
          .set({
            status: 'ACCEPTED' as const,
            referredUserId: user.id,
            acceptedAt: new Date(),
            updatedAt: new Date(),
          } as any)
          .where(eq(referrals.id, referralRecord.id));
      }

      return NextResponse.json({ success: true, user: { id: user?.id, email, role: "VENDOR" } });
    }

    return NextResponse.json({ error: "Invalid signup type" }, { status: 400 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
