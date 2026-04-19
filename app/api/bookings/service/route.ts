import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, vendors, servicePackages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { sendServiceBookingClientEmail, sendServiceBookingVendorEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorId, serviceId, clientName, clientEmail, clientPhone, eventDate, notes, userId } = body;

    if (!vendorId || !serviceId || !clientName || !clientEmail || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch service + vendor + vendor user email in parallel
    const [serviceRow, vendorRow] = await Promise.all([
      db.select().from(servicePackages).where(eq(servicePackages.id, serviceId)).limit(1),
      db.select({
        id: vendors.id,
        businessName: vendors.businessName,
        location: vendors.location,
        userId: vendors.userId,
      }).from(vendors).where(eq(vendors.id, vendorId)).limit(1),
    ]);

    if (!serviceRow.length) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    if (!vendorRow.length) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const service = serviceRow[0];
    const vendor = vendorRow[0];

    // Get vendor's login email
    const [vendorUser] = await db.select({ email: users.email, name: users.name })
      .from(users).where(eq(users.id, vendor.userId)).limit(1);

    const bookingId = randomUUID();
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // Insert booking
    await db.insert(bookings).values({
      id: bookingId,
      vendorId,
      userId: userId || null,
      weddingId: null,
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      eventDate: new Date(eventDate),
      eventType: 'Wedding',
      servicePackage: service.name,
      serviceType: service.serviceType,
      bookingDate: new Date(),
      totalAmount: service.price,
      amount: service.price,
      depositAmount: null,
      paymentStatus: 'UNPAID',
      status: 'pending',
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.andiza.co.rw';

    // Send emails — never throw, just log
    await Promise.allSettled([
      sendServiceBookingClientEmail({
        clientEmail,
        clientName,
        serviceName: service.name,
        serviceType: service.serviceType,
        vendorName: vendor.businessName,
        vendorLocation: vendor.location || 'Kigali, Rwanda',
        eventDate: formattedDate,
        price: service.price,
        notes: notes || null,
        dashboardUrl: `${baseUrl}/dashboard/bookings`,
      }),
      vendorUser?.email ? sendServiceBookingVendorEmail({
        vendorEmail: vendorUser.email,
        vendorName: vendor.businessName,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        serviceName: service.name,
        serviceType: service.serviceType,
        eventDate: formattedDate,
        price: service.price,
        notes: notes || null,
        dashboardUrl: `${baseUrl}/vendor/bookings`,
      }) : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error('Service booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
