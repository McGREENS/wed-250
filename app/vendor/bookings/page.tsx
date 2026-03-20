export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { vendors, bookings, venueTours, servicePackages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import BookingsClient from './BookingsClient';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

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
    return <BookingsClient initialBookings={[]} initialTours={[]} initialQuotes={[]} />;
  }

  const vendorBookings = await db.select().from(bookings)
    .where(eq(bookings.vendorId, vendor[0].id))
    .orderBy(desc(bookings.eventDate));

  // Split: venue quote requests vs regular bookings
  const regularBookings = vendorBookings.filter(b => b.serviceType !== 'Venue');
  const quoteRequests = vendorBookings.filter(b => b.serviceType === 'Venue');

  // Fetch venue tours for all venues (servicePackages) belonging to this vendor
  const vendorTours = await db
    .select({
      id: venueTours.id,
      venueId: venueTours.venueId,
      venueName: servicePackages.name,
      name: venueTours.name,
      email: venueTours.email,
      phone: venueTours.phone,
      tourDate: venueTours.tourDate,
      tourTime: venueTours.tourTime,
      status: venueTours.status,
      notes: venueTours.notes,
      createdAt: venueTours.createdAt,
    })
    .from(venueTours)
    .leftJoin(servicePackages, eq(venueTours.venueId, servicePackages.id))
    .where(eq(servicePackages.vendorId, vendor[0].id))
    .orderBy(desc(venueTours.createdAt));

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <BookingsClient initialBookings={regularBookings as any} initialTours={vendorTours as any} initialQuotes={quoteRequests as any} />
    </Suspense>
  );
}
