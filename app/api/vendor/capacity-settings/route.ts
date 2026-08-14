import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
    }

    const [vendor] = await db.select({
      maxBookingsPerDay: vendors.maxBookingsPerDay,
    })
    .from(vendors)
    .where(eq(vendors.userId, session.user.id))
    .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({
      maxBookingsPerDay: vendor.maxBookingsPerDay || 1,
    });
  } catch (error) {
    console.error('Error fetching capacity settings:', error);
    return NextResponse.json({ error: 'Failed to fetch capacity settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
    }

    const body = await req.json();
    const { maxBookingsPerDay } = body;

    if (maxBookingsPerDay === undefined || maxBookingsPerDay === null) {
      return NextResponse.json({ error: 'maxBookingsPerDay is required' }, { status: 400 });
    }

    const numValue = parseInt(maxBookingsPerDay);

    if (isNaN(numValue) || numValue < 1 || numValue > 10) {
      return NextResponse.json({ error: 'maxBookingsPerDay must be between 1 and 10' }, { status: 400 });
    }

    const [vendor] = await db.select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    await db.update(vendors)
      .set({
        maxBookingsPerDay: numValue,
        updatedAt: new Date(),
      } as any)
      .where(eq(vendors.userId, session.user.id));

    return NextResponse.json({
      success: true,
      maxBookingsPerDay: numValue,
      message: 'Capacity settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating capacity settings:', error);
    return NextResponse.json({ error: 'Failed to update capacity settings' }, { status: 500 });
  }
}
