import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    // Fetch all bookings for this vendor
    const vendorBookings = await db.select({
      eventDate: bookings.eventDate,
      status: bookings.status,
    })
    .from(bookings)
    .where(eq(bookings.vendorId, vendorId));

    // Filter out cancelled bookings and format dates
    const bookedDates = vendorBookings
      .filter(b => b.status !== 'cancelled' && b.eventDate)
      .map(b => {
        const date = new Date(b.eventDate!);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      });

    return NextResponse.json({ bookedDates });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return NextResponse.json({ error: 'Failed to fetch booked dates' }, { status: 500 });
  }
}
