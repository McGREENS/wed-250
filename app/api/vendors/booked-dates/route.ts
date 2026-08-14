import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    // Fetch vendor to get max bookings per day
    const [vendor] = await db.select({
      maxBookingsPerDay: vendors.maxBookingsPerDay,
    })
    .from(vendors)
    .where(eq(vendors.id, vendorId));

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const maxBookingsPerDay = vendor.maxBookingsPerDay || 1;

    // Fetch all bookings for this vendor
    const vendorBookings = await db.select({
      eventDate: bookings.eventDate,
      status: bookings.status,
    })
    .from(bookings)
    .where(eq(bookings.vendorId, vendorId));

    // Group bookings by date and count them
    const dateBookingMap: { [key: string]: number } = {};
    
    vendorBookings
      .filter(b => b.status !== 'cancelled' && b.eventDate)
      .forEach(b => {
        const date = new Date(b.eventDate!);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        dateBookingMap[dateStr] = (dateBookingMap[dateStr] || 0) + 1;
      });

    // Return both array of fully-booked dates and detailed map with counts
    const bookedDates = Object.keys(dateBookingMap).filter(date => dateBookingMap[date] >= maxBookingsPerDay);
    
    return NextResponse.json({ 
      bookedDates,
      dateBookingMap,
      maxBookingsPerDay,
      capacityInfo: Object.keys(dateBookingMap).reduce((acc, date) => {
        acc[date] = {
          bookings: dateBookingMap[date],
          max: maxBookingsPerDay,
          available: dateBookingMap[date] < maxBookingsPerDay
        };
        return acc;
      }, {} as { [key: string]: { bookings: number; max: number; available: boolean } })
    });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return NextResponse.json({ error: 'Failed to fetch booked dates' }, { status: 500 });
  }
}
