import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { vendors, bookings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import CalendarClient from './CalendarClient';

export default async function VendorCalendarPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    const availability = vendor?.availability ? JSON.parse(vendor.availability) : { blocked: [] };
    const vendorBookings = vendor ? await db.select().from(bookings).where(eq(bookings.vendorId, vendor.id)) : [];

    return (
        <VendorPageLayout>
            <CalendarClient initialData={{ availability, bookings: vendorBookings }} />
        </VendorPageLayout>
    );
}
