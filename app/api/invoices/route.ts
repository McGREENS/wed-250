import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoices, vendors, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Generate invoice number
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${random}`;
}

// GET - Fetch all invoices for vendor
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (session.user.role === 'VENDOR') {
      const [vendor] = await db
        .select()
        .from(vendors)
        .where(eq(vendors.userId, session.user.id))
        .limit(1);

      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }

      if (invoiceId) {
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

        return NextResponse.json({ invoice });
      }

      const vendorInvoices = await db
        .select()
        .from(invoices)
        .where(eq(invoices.vendorId, vendor.id))
        .orderBy(desc(invoices.createdAt));

      return NextResponse.json({ invoices: vendorInvoices });
    } else if (session.user.role === 'COUPLE') {
      if (invoiceId) {
        const [invoice] = await db
          .select()
          .from(invoices)
          .where(
            and(
              eq(invoices.id, invoiceId),
              eq(invoices.clientId, session.user.id)
            )
          )
          .limit(1);

        if (!invoice) {
          return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ invoice });
      }

      const clientInvoices = await db
        .select()
        .from(invoices)
        .where(eq(invoices.clientId, session.user.id))
        .orderBy(desc(invoices.createdAt));

      return NextResponse.json({ invoices: clientInvoices });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST - Create new invoice
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
    const {
      bookingId,
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      issueDate,
      dueDate,
      items,
      discount,
      notes,
      terms,
      status,
      color,
    } = body;

    // Validation
    if (!clientName || !clientEmail || !issueDate || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    items.forEach((item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;
      
      if (item.taxable) {
        taxAmount += itemTotal * 0.18; // 18% tax
      }
    });

    const discountAmount = discount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Generate unique invoice number
    let invoiceNumber = generateInvoiceNumber();
    let numberExists = true;

    while (numberExists) {
      const [existing] = await db
        .select()
        .from(invoices)
        .where(eq(invoices.invoiceNumber, invoiceNumber))
        .limit(1);

      if (!existing) {
        numberExists = false;
      } else {
        invoiceNumber = generateInvoiceNumber();
      }
    }

    const [newInvoice] = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        vendorId: vendor.id,
        bookingId: bookingId || null,
        clientId: clientId || null,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        clientAddress: clientAddress || null,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxRate: 18,
        taxAmount,
        discount: discountAmount,
        total,
        status: status || 'DRAFT',
        color: color || '#8B4513',
        notes: notes || null,
        terms: terms || null,
        items: JSON.stringify(items),
      } as any)
      .returning();

    return NextResponse.json({
      success: true,
      invoice: newInvoice,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// PUT - Update invoice
export async function PUT(req: NextRequest) {
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
    const { invoiceId, ...updateData } = body;

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

    // Recalculate if items changed
    if (updateData.items) {
      let subtotal = 0;
      let taxAmount = 0;

      updateData.items.forEach((item: any) => {
        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;
        
        if (item.taxable) {
          taxAmount += itemTotal * 0.18;
        }
      });

      const discountAmount = updateData.discount || invoice.discount;
      const total = subtotal + taxAmount - discountAmount;

      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.total = total;
      updateData.items = JSON.stringify(updateData.items);
    }

    // Convert dates to Date objects if they exist
    if (updateData.issueDate) {
      updateData.issueDate = new Date(updateData.issueDate);
    }
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    updateData.updatedAt = new Date();

    await db
      .update(invoices)
      .set(updateData)
      .where(eq(invoices.id, invoiceId));

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

// DELETE - Delete invoice
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    await db
      .delete(invoices)
      .where(
        and(
          eq(invoices.id, invoiceId),
          eq(invoices.vendorId, vendor.id)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
