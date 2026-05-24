import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookingPayments, bookings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - fetch all payments for a booking
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookingId = req.nextUrl.searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    // Verify booking belongs to user
    const [booking] = await db.select().from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, session.user.id)))
      .limit(1);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const payments = await db.select().from(bookingPayments)
      .where(eq(bookingPayments.bookingId, bookingId))
      .orderBy(bookingPayments.paidAt);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST - record a new payment
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { bookingId, amount, note, paidAt } = await req.json();
    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'bookingId and a positive amount are required' }, { status: 400 });
    }

    // Verify booking belongs to user
    const [booking] = await db.select().from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, session.user.id)))
      .limit(1);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Fetch existing payments to compute total paid
    const existing = await db.select().from(bookingPayments)
      .where(eq(bookingPayments.bookingId, bookingId));
    const totalPaid = existing.reduce((s, p) => s + p.amount, 0) + amount;
    const totalAmount = booking.totalAmount || booking.amount || 0;

    // Determine new payment status
    let paymentStatus: 'UNPAID' | 'DEPOSIT_PAID' | 'PAID' = 'DEPOSIT_PAID';
    if (totalPaid >= totalAmount && totalAmount > 0) paymentStatus = 'PAID';
    else if (totalPaid <= 0) paymentStatus = 'UNPAID';

    // Insert payment record
    const [payment] = await db.insert(bookingPayments).values({
      bookingId,
      amount,
      note: note || null,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    } as any).returning();

    // Update booking deposit_amount and payment_status
    await db.update(bookings).set({
      depositAmount: totalPaid,
      paymentStatus,
      updatedAt: new Date(),
    } as any).where(eq(bookings.id, bookingId));

    return NextResponse.json({ payment, totalPaid, paymentStatus });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

// DELETE - remove a payment entry
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const paymentId = req.nextUrl.searchParams.get('id');
    const bookingId = req.nextUrl.searchParams.get('bookingId');
    if (!paymentId || !bookingId) return NextResponse.json({ error: 'id and bookingId required' }, { status: 400 });

    // Verify booking belongs to user
    const [booking] = await db.select().from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, session.user.id)))
      .limit(1);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    await db.delete(bookingPayments).where(eq(bookingPayments.id, paymentId));

    // Recompute total paid after deletion
    const remaining = await db.select().from(bookingPayments)
      .where(eq(bookingPayments.bookingId, bookingId));
    const totalPaid = remaining.reduce((s, p) => s + p.amount, 0);
    const totalAmount = booking.totalAmount || booking.amount || 0;

    let paymentStatus: 'UNPAID' | 'DEPOSIT_PAID' | 'PAID' = 'UNPAID';
    if (totalPaid >= totalAmount && totalAmount > 0) paymentStatus = 'PAID';
    else if (totalPaid > 0) paymentStatus = 'DEPOSIT_PAID';

    await db.update(bookings).set({
      depositAmount: totalPaid,
      paymentStatus,
      updatedAt: new Date(),
    } as any).where(eq(bookings.id, bookingId));

    return NextResponse.json({ success: true, totalPaid, paymentStatus });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
