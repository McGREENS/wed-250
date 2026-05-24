import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vendors, weddings, referrals, publicReferralLinks } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";
import type { InferInsertModel } from "drizzle-orm";

type NewUser = InferInsertModel<typeof users>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password, referralCode } = body;

    console.log(`[SIGNUP] Starting signup for ${email}, type: ${type}, referralCode: ${referralCode}`);

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Validate referral code if provided
    let referralRecord = null;
    let publicLinkRecord = null;
    if (referralCode) {
      console.log(`[SIGNUP] Looking for public link with code: ${referralCode}`);
      
      // First try to find a public referral link
      const allPublicLinks = await db
        .select()
        .from(publicReferralLinks)
        .where(eq(publicReferralLinks.referralCode, referralCode))
        .limit(1);

      console.log(`[SIGNUP] Found ${allPublicLinks.length} public links with this code`);

      if (allPublicLinks.length > 0) {
        const publicLink = allPublicLinks[0];
        const isActive = typeof publicLink.isActive === 'boolean' ? publicLink.isActive : !!publicLink.isActive;
        console.log(`[SIGNUP] Public link found - ID: ${publicLink.id}, Active: ${isActive}, Current usage: ${publicLink.usageCount}`);
        
        if (isActive) {
          publicLinkRecord = publicLink;
        } else {
          console.log(`[SIGNUP] Public link is inactive`);
          return NextResponse.json(
            { error: "This referral link is no longer active" },
            { status: 400 }
          );
        }
      } else {
        console.log(`[SIGNUP] No public link found, checking regular referrals`);
        
        // Fall back to regular referral
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
          console.log(`[SIGNUP] No referral found either`);
          return NextResponse.json(
            { error: "Invalid or expired referral code" },
            { status: 400 }
          );
        }

        // Check if referral email matches
        if (referral.referredEmail !== email) {
          console.log(`[SIGNUP] Referral email mismatch`);
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
          
          console.log(`[SIGNUP] Referral expired`);
          return NextResponse.json(
            { error: "This referral link has expired" },
            { status: 400 }
          );
        }

        referralRecord = referral;
      }
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

      if (!user) {
        console.log(`[SIGNUP] Failed to create user`);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      console.log(`[SIGNUP] User created: ${user.id}`);

      // Create wedding if date provided
      if (weddingDate) {
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
      if (referralRecord) {
        console.log(`[SIGNUP] Updating regular referral`);
        await db
          .update(referrals)
          .set({
            status: 'ACCEPTED',
            referredUserId: user.id,
            acceptedAt: new Date(),
            updatedAt: new Date(),
          } as any)
          .where(eq(referrals.id, referralRecord.id));
      }

      // Update public link usage if exists
      if (publicLinkRecord) {
        const currentCount = publicLinkRecord.usageCount || 0;
        console.log(`[SIGNUP] Updating public link ${publicLinkRecord.id}: ${currentCount} -> ${currentCount + 1}`);
        
        await db
          .update(publicReferralLinks)
          .set({
            usageCount: currentCount + 1,
            updatedAt: new Date(),
          } as any)
          .where(eq(publicReferralLinks.id, publicLinkRecord.id));
        
        console.log(`[SIGNUP] Public link updated successfully`);
      }

      console.log(`[SIGNUP] Couple signup completed for ${email}`);
      return NextResponse.json({ success: true, user: { id: user.id, email, role: "COUPLE" } });
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

      if (!user) {
        console.log(`[SIGNUP] Failed to create user`);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      console.log(`[SIGNUP] User created: ${user.id}`);

      // Create vendor profile
      await db.insert(vendors).values({
        userId: user.id,
        businessName,
        category: serviceCategory,
      } as any);

      // Send welcome email
      try {
        await sendWelcomeEmail(email, businessName, "VENDOR");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }

      // Update referral if exists
      if (referralRecord) {
        console.log(`[SIGNUP] Updating regular referral`);
        await db
          .update(referrals)
          .set({
            status: 'ACCEPTED',
            referredUserId: user.id,
            acceptedAt: new Date(),
            updatedAt: new Date(),
          } as any)
          .where(eq(referrals.id, referralRecord.id));
      }

      // Update public link usage if exists
      if (publicLinkRecord) {
        const currentCount = publicLinkRecord.usageCount || 0;
        console.log(`[SIGNUP] Updating public link ${publicLinkRecord.id}: ${currentCount} -> ${currentCount + 1}`);
        
        await db
          .update(publicReferralLinks)
          .set({
            usageCount: currentCount + 1,
            updatedAt: new Date(),
          } as any)
          .where(eq(publicReferralLinks.id, publicLinkRecord.id));
        
        console.log(`[SIGNUP] Public link updated successfully`);
      }

      console.log(`[SIGNUP] Vendor signup completed for ${email}`);
      return NextResponse.json({ success: true, user: { id: user.id, email, role: "VENDOR" } });
    }

    return NextResponse.json({ error: "Invalid signup type" }, { status: 400 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
