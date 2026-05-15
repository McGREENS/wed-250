import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { referrals, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      .where(eq(referrals.id, params.code))
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

      // Check if there's already a pending referral for this email
      const [existingReferral] = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referredEmail, referredEmail),
            eq(referrals.status, 'PENDING')
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
      .where(eq(referrals.id, params.code));

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
