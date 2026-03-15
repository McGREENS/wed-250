import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, vendors, servicePackages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get recent bookings with vendor info
    const recentBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        servicePackage: bookings.servicePackage,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        eventDate: bookings.eventDate,
        createdAt: bookings.createdAt,
        vendorName: vendors.businessName,
      })
      .from(bookings)
      .leftJoin(vendors, eq(bookings.vendorId, vendors.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt))
      .limit(5);

    return NextResponse.json(recentBookings);
  } catch (error) {
    console.error('Recent bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch recent bookings' }, { status: 500 });
  }
}