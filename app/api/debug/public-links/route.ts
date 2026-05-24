import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publicReferralLinks } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  try {
    const links = await db
      .select({
        id: publicReferralLinks.id,
        referralCode: publicReferralLinks.referralCode,
        referralRole: publicReferralLinks.referralRole,
        title: publicReferralLinks.title,
        usageCount: publicReferralLinks.usageCount,
        isActive: publicReferralLinks.isActive,
        createdAt: publicReferralLinks.createdAt,
      })
      .from(publicReferralLinks);

    return NextResponse.json({
      message: 'Public referral links in database',
      count: links.length,
      links: links,
    });
  } catch (error) {
    console.error('Error checking public links:', error);
    return NextResponse.json({ 
      error: String(error),
      message: 'Failed to fetch public links'
    }, { status: 500 });
  }
}
