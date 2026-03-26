import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, vendors, pendingVendorSignups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Find pending signup
    const [pending] = await db.select().from(pendingVendorSignups).where(eq(pendingVendorSignups.email, email)).limit(1);

    if (!pending) {
      return NextResponse.json({ error: 'No pending signup found' }, { status: 400 });
    }

    // Check if OTP expired
    if (new Date() > new Date(pending.expiresAt)) {
      await db.delete(pendingVendorSignups).where(eq(pendingVendorSignups.email, email));
      return NextResponse.json({ error: 'OTP expired. Please request a new one' }, { status: 400 });
    }

    // Verify OTP
    if (pending.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Create user
    await db.insert(users).values({
      name: pending.businessName,
      email: pending.email,
      password: pending.password,
      role: 'VENDOR',
      phone: pending.phone,
    } as any);

    // Get the created user
    const [user] = await db.select().from(users).where(eq(users.email, pending.email)).limit(1);

    // Create vendor profile
    if (user) {
      await db.insert(vendors).values({
        userId: user.id,
        businessName: pending.businessName,
        category: pending.serviceCategory,
      } as any);
    }

    // Delete pending signup
    await db.delete(pendingVendorSignups).where(eq(pendingVendorSignups.email, email));

    // Send welcome email
    try {
      await sendWelcomeEmail(pending.email, pending.businessName, 'VENDOR');
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json({ success: true, user: { id: user?.id, email: pending.email, role: 'VENDOR' } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
