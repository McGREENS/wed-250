import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { publicReferralLinks } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

function generateReferralCode(): string {
  return crypto.randomBytes(16).toString('hex');
}

// GET - Fetch all public referral links for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await db
      .select()
      .from(publicReferralLinks)
      .where(eq(publicReferralLinks.userId, session.user.id))
      .orderBy(desc(publicReferralLinks.createdAt));

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching public referral links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

// POST - Create a new public referral link
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { referralRole, title, description } = body;

    if (!referralRole || !['COUPLE', 'VENDOR'].includes(referralRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be COUPLE or VENDOR' },
        { status: 400 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = true;

    while (codeExists) {
      const [existing] = await db
        .select()
        .from(publicReferralLinks)
        .where(eq(publicReferralLinks.referralCode, referralCode))
        .limit(1);

      if (!existing) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Create public referral link
    const [newLink] = await db
      .insert(publicReferralLinks)
      .values({
        userId: session.user.id,
        referralCode,
        referralRole,
        title: title || `${referralRole} Referral Link`,
        description: description || `Join Andiza as a ${referralRole}`,
        usageCount: 0,
        isActive: true,
      } as any)
      .returning();

    return NextResponse.json({
      success: true,
      link: newLink,
      referralUrl: `${process.env.NEXTAUTH_URL}/signup?ref=${referralCode}`,
    });
  } catch (error) {
    console.error('Error creating public referral link:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}

// PUT - Update a public referral link
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    // Verify ownership
    const [link] = await db
      .select()
      .from(publicReferralLinks)
      .where(eq(publicReferralLinks.id, id))
      .limit(1);

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update link
    const updates: any = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (isActive !== undefined) updates.isActive = isActive;

    await db
      .update(publicReferralLinks)
      .set(updates)
      .where(eq(publicReferralLinks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating public referral link:', error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

// DELETE - Delete a public referral link
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    // Verify ownership
    const [link] = await db
      .select()
      .from(publicReferralLinks)
      .where(eq(publicReferralLinks.id, id))
      .limit(1);

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete link
    await db.delete(publicReferralLinks).where(eq(publicReferralLinks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting public referral link:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}
