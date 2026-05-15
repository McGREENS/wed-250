import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { referrals, users } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const [referral] = await db
      .select({
        id: referrals.id,
        referrerId: referrals.referrerId,
        referredEmail: referrals.referredEmail,
        referredName: referrals.referredName,
        referredRole: referrals.referredRole,
        status: referrals.status,
        expiresAt: referrals.expiresAt,
        referrerName: users.name,
        referrerEmail: users.email,
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.referrerId, users.id))
      .where(eq(referrals.referralCode, code))
      .limit(1);

    if (!referral) {
      return NextResponse.json(
        { error: 'Invalid referral code', valid: false },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(referral.expiresAt);
    
    if (now > expiresAt) {
      if (referral.status === 'PENDING') {
        await db
          .update(referrals)
          .set({ status: 'EXPIRED' as const, updatedAt: new Date() } as any)
          .where(eq(referrals.id, referral.id));
      }
      
      return NextResponse.json(
        { error: 'This referral link has expired', valid: false },
        { status: 400 }
      );
    }

    if (referral.status === 'ACCEPTED') {
      return NextResponse.json(
        { error: 'This referral has already been used', valid: false },
        { status: 400 }
      );
    }

    if (referral.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This referral has been cancelled', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      referral: {
        referredEmail: referral.referredEmail,
        referredName: referral.referredName,
        referredRole: referral.referredRole,
        referrerName: referral.referrerName,
        expiresAt: referral.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error verifying referral:', error);
    return NextResponse.json(
      { error: 'Failed to verify referral code', valid: false },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await params;
    const body = await req.json();
    const { referredEmail } = body;

    if (!referredEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referredEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get the referral
    const [referral] = await db
      .select()
      .from(referrals)
      .where(eq(referrals.id, code))
      .limit(1);

    if (!referral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Check if user owns this referral
    if (referral.referrerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if new email is already registered
    if (referredEmail !== referral.referredEmail) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, referredEmail))
        .limit(1);

      if (existingUser) {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        );
      }

      // Check if there's already a pending referral for this email (excluding current referral)
      const [existingReferral] = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referredEmail, referredEmail),
            eq(referrals.status, 'PENDING'),
            ne(referrals.id, code)
          )
        )
        .limit(1);

      if (existingReferral) {
        return NextResponse.json(
          { error: 'A pending referral already exists for this email' },
          { status: 400 }
        );
      }
    }

    // Update the email
    await db
      .update(referrals)
      .set({
        referredEmail,
        updatedAt: new Date(),
      } as any)
      .where(eq(referrals.id, code));

    return NextResponse.json({
      success: true,
      message: 'Email updated successfully',
    });
  } catch (error) {
    console.error('Error updating referral email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
