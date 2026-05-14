import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { referrals, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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
