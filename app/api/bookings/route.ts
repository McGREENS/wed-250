import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { createClient } from '@libsql/client';
import { bookings, vendors, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

const rawClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);

    const userBookings = await db
      .select({
        id: bookings.id,
        vendorId: bookings.vendorId,
        servicePackage: bookings.servicePackage,
        serviceType: bookings.serviceType,
        bookingDate: bookings.bookingDate,
        eventDate: bookings.eventDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        amount: bookings.amount,
        depositAmount: bookings.depositAmount,
        paymentStatus: bookings.paymentStatus,
        notes: bookings.notes,
        clientName: bookings.clientName,
        clientEmail: bookings.clientEmail,
        clientPhone: bookings.clientPhone,
        vendorName: vendors.businessName,
        vendorLocation: vendors.location,
        vendorEmail: users.email,
        vendorPhone: users.phone,
      })
      .from(bookings)
      .leftJoin(vendors, eq(bookings.vendorId, vendors.id))
      .leftJoin(users, eq(vendors.userId, users.id))
      .where(eq(bookings.userId, userId));

    return NextResponse.json({ bookings: userBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });

    const result = await rawClient.execute({
      sql: `UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ? AND user_id = ?`,
      args: [Math.floor(Date.now() / 1000), id, userId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
