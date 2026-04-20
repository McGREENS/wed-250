import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, pendingVendorSignups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sendVendorOTPEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, email, phone, serviceCategory, otherCategory, password } = body;

    // Use otherCategory if serviceCategory is "Other"
    const finalCategory = serviceCategory === "Other" && otherCategory ? otherCategory : serviceCategory;

    // Check if email already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
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
