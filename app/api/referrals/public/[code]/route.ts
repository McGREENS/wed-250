import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publicReferralLinks, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const [link] = await db
      .select({
        id: publicReferralLinks.id,
        userId: publicReferralLinks.userId,
        referralCode: publicReferralLinks.referralCode,
        referralRole: publicReferralLinks.referralRole,
        title: publicReferralLinks.title,
        description: publicReferralLinks.description,
        isActive: publicReferralLinks.isActive,
        userName: users.name,
        userEmail: users.email,
      })
      .from(publicReferralLinks)
      .innerJoin(users, eq(publicReferralLinks.userId, users.id))
      .where(eq(publicReferralLinks.referralCode, code))
      .limit(1);

    if (!link) {
      return NextResponse.json(
        { error: 'Invalid referral code', valid: false },
        { status: 404 }
      );
    }

    if (!link.isActive) {
      return NextResponse.json(
        { error: 'This referral link is no longer active', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      referral: {
        referredRole: link.referralRole,
        referrerName: link.userName,
        title: link.title,
        description: link.description,
      },
    });
  } catch (error) {
    console.error('Error verifying public referral:', error);
    return NextResponse.json(
      { error: 'Failed to verify referral code', valid: false },
      { status: 500 }
    );
  }
}
