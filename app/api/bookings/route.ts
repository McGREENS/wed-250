import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, vendors, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      .where(eq(bookings.userId, session.user.id));

    return NextResponse.json({ bookings: userBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
