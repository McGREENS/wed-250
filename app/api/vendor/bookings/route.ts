import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, vendors } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    if (!vendor.length) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const vendorBookings = await db.select().from(bookings)
      .where(eq(bookings.vendorId, vendor[0].id))
      .orderBy(desc(bookings.eventDate));

    return NextResponse.json({ bookings: vendorBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    if (!vendor.length) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const body = await req.json();
    const { clientName, clientEmail, clientPhone, eventDate, eventType, servicePackage, totalAmount, depositAmount, notes } = body;

    if (!clientName || !eventDate) {
      return NextResponse.json({ error: 'Client name and event date are required' }, { status: 400 });
    }

    const newBooking = {
      id: randomUUID(),
      vendorId: vendor[0].id,
      weddingId: null,
      userId: null,
      clientName,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      eventType: eventType || 'Wedding',
      servicePackage: servicePackage || null,
      serviceType: null,
      bookingDate: null,
      totalAmount: totalAmount || null,
      amount: null,
      depositAmount: depositAmount || null,
      paymentStatus: 'UNPAID',
      status: 'confirmed',
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(bookings).values(newBooking);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    if (!vendor.length) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const body = await req.json();
    const { id, status, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    const updates: any = { ...updateData, updatedAt: new Date() };
    if (status) updates.status = status;
    if (updateData.eventDate) updates.eventDate = new Date(updateData.eventDate);

    await db.update(bookings)
      .set(updates)
      .where(and(eq(bookings.id, id), eq(bookings.vendorId, vendor[0].id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    if (!vendor.length) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    await db.delete(bookings).where(and(eq(bookings.id, id), eq(bookings.vendorId, vendor[0].id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
