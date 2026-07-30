import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, vendors, servicePackages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendQuoteRequestEmail } from '@/lib/email';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, eventDate, guestCount, message, contactMethod } = body;

    if (!clientName || !clientEmail || !clientPhone || !eventDate || !guestCount || !contactMethod) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Get venue (servicePackage) and vendor
    const [venueService] = await db.select().from(servicePackages).where(eq(servicePackages.id, id)).limit(1);
    if (!venueService) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });

    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, venueService.vendorId)).limit(1);
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const [vendorUser] = await db.select({ email: users.email, name: users.name })
      .from(users).where(eq(users.id, vendor.userId)).limit(1);
    if (!vendorUser) return NextResponse.json({ error: 'Vendor user not found' }, { status: 404 });

    const parsedDate = new Date(eventDate);
    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // Save quote as a pending booking
    const [newBooking] = await db.insert(bookings).values({
      vendorId: vendor.id,
      clientName,
      clientEmail,
      clientPhone,
      eventDate: parsedDate,
      eventType: 'Wedding',
      servicePackage: venueService.name,
      serviceType: 'Venue',
      status: 'pending',
      notes: message
        ? `Quote request for ${guestCount} guests. Preferred contact: ${contactMethod}.\n\nMessage: ${message}`
        : `Quote request for ${guestCount} guests. Preferred contact: ${contactMethod}.`,
      totalAmount: venueService.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any).returning();

    // Send email notification to vendor (non-blocking — don't fail the request if email fails)
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://www.andiza.rw'}/vendor/bookings`;
    try {
      console.log('Sending quote email to vendor:', vendorUser.email);
      const emailResult = await sendQuoteRequestEmail({
        vendorEmail: vendorUser.email,
        vendorName: vendor.businessName,
        venueName: venueService.name,
        clientName,
        clientEmail,
        clientPhone,
        eventDate: formattedDate,
        guestCount,
        message: message || '',
        contactMethod,
        dashboardUrl,
      });
      console.log('Quote email result:', JSON.stringify(emailResult));
    } catch (emailErr) {
      console.error('Quote email failed (booking still saved):', emailErr);
    }

    return NextResponse.json({ success: true, bookingId: newBooking.id });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}
