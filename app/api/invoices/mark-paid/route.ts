import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoices, vendors } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.id, invoiceId),
          eq(invoices.vendorId, vendor.id)
        )
      )
      .limit(1);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await db
      .update(invoices)
      .set({
        status: 'PAID' as const,
        paidAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq(invoices.id, invoiceId));

    return NextResponse.json({
      success: true,
      message: 'Invoice marked as paid',
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return NextResponse.json({ error: 'Failed to mark invoice as paid' }, { status: 500 });
  }
}
