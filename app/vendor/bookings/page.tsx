import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { vendors, bookings } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import BookingsClient from './BookingsClient';

export default async function VendorBookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'VENDOR') {
    redirect('/dashboard');
  }

  const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);

  if (!vendor.length) {
    return <BookingsClient initialBookings={[]} />;
  }

  const vendorBookings = await db.select().from(bookings)
    .where(eq(bookings.vendorId, vendor[0].id))
    .orderBy(desc(bookings.eventDate));

  return <BookingsClient initialBookings={vendorBookings} />;
}
