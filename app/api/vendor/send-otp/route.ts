import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, pendingVendorSignups, publicReferralLinks, referrals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sendVendorOTPEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, email, phone, serviceCategory, otherCategory, password, referralCode } = body;

    // Use otherCategory if serviceCategory is "Other"
    const finalCategory = serviceCategory === "Other" && otherCategory ? otherCategory : serviceCategory;

    // Check if email already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Validate referral code if provided
    if (referralCode) {
      const [publicLink] = await db
        .select()
        .from(publicReferralLinks)
        .where(eq(publicReferralLinks.referralCode, referralCode))
        .limit(1);

      if (publicLink) {
        const isActive = typeof publicLink.isActive === 'boolean' ? publicLink.isActive : !!publicLink.isActive;
        if (!isActive) {
          return NextResponse.json({ error: 'This referral link is no longer active' }, { status: 400 });
        }
      } else {
        const [referral] = await db
          .select()
          .from(referrals)
          .where(and(eq(referrals.referralCode, referralCode), eq(referrals.status, 'PENDING')))
          .limit(1);
        if (!referral) {
          return NextResponse.json({ error: 'Invalid or expired referral code' }, { status: 400 });
        }
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete any existing pending signup for this email
    await db.delete(pendingVendorSignups).where(eq(pendingVendorSignups.email, email));

    // Store pending signup with OTP (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.insert(pendingVendorSignups).values({
      businessName,
      email,
      phone,
      serviceCategory: finalCategory,
      password: hashedPassword,
      otp,
      expiresAt,
      metadata: referralCode ? JSON.stringify({ referralCode }) : null,
    } as any);

    // Send OTP email
    try {
      await sendVendorOTPEmail({ email, businessName, otp });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
