import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { vendors, vendorFinances } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET: Fetch all financial records for the vendor
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a vendor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access finances' }, { status: 403 });
    }

    // Get vendor record
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    // Fetch all financial records for this vendor
    const finances = await db
      .select()
      .from(vendorFinances)
      .where(eq(vendorFinances.vendorId, vendor.id))
      .orderBy(desc(vendorFinances.year), desc(vendorFinances.month));

    return NextResponse.json({ finances });
  } catch (error) {
    console.error('GET /api/vendor/finances error:', error);
    return NextResponse.json({ error: 'Failed to fetch finances' }, { status: 500 });
  }
}

// POST: Create a new financial record
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a vendor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access finances' }, { status: 403 });
    }

    // Get vendor record
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { month, year, grossIncome, taxRate, labourCosts, notes } = body;

    // Validation
    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Month must be between 1 and 12' }, { status: 400 });
    }

    if (year < 2000 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    // Check if record already exists for this month/year
    const [existing] = await db
      .select()
      .from(vendorFinances)
      .where(
        and(
          eq(vendorFinances.vendorId, vendor.id),
          eq(vendorFinances.month, month),
          eq(vendorFinances.year, year)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'Financial record already exists for this month/year. Use PUT to update.' },
        { status: 409 }
      );
    }

    // Calculate tax and net profit
    const grossIncomeValue = parseFloat(grossIncome) || 0;
    const taxRateValue = parseFloat(taxRate) || 18;
    const labourCostsValue = parseFloat(labourCosts) || 0;
    
    const taxAmount = (grossIncomeValue * taxRateValue) / 100;
    const netProfit = grossIncomeValue - taxAmount - labourCostsValue;

    // Create new record
    const [newFinance] = await db
      .insert(vendorFinances)
      .values({
        vendorId: vendor.id,
        month,
        year,
        grossIncome: grossIncomeValue,
        taxRate: taxRateValue,
        taxAmount,
        labourCosts: labourCostsValue,
        netProfit,
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ finance: newFinance }, { status: 201 });
  } catch (error) {
    console.error('POST /api/vendor/finances error:', error);
    return NextResponse.json({ error: 'Failed to create finance record' }, { status: 500 });
  }
}

// PUT: Update an existing financial record
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a vendor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access finances' }, { status: 403 });
    }

    // Get vendor record
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, grossIncome, taxRate, labourCosts, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Finance record ID is required' }, { status: 400 });
    }

    // Verify the record belongs to this vendor
    const [existing] = await db
      .select()
      .from(vendorFinances)
      .where(
        and(
          eq(vendorFinances.id, id),
          eq(vendorFinances.vendorId, vendor.id)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Finance record not found' }, { status: 404 });
    }

    // Recalculate with new values
    const grossIncomeValue = parseFloat(grossIncome) ?? existing.grossIncome;
    const taxRateValue = parseFloat(taxRate) ?? existing.taxRate;
    const labourCostsValue = parseFloat(labourCosts) ?? existing.labourCosts;
    
    const taxAmount = (grossIncomeValue * taxRateValue) / 100;
    const netProfit = grossIncomeValue - taxAmount - labourCostsValue;

    // Update record
    const [updated] = await db
      .update(vendorFinances)
      .set({
        grossIncome: grossIncomeValue,
        taxRate: taxRateValue,
        taxAmount,
        labourCosts: labourCostsValue,
        netProfit,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(vendorFinances.id, id))
      .returning();

    return NextResponse.json({ finance: updated });
  } catch (error) {
    console.error('PUT /api/vendor/finances error:', error);
    return NextResponse.json({ error: 'Failed to update finance record' }, { status: 500 });
  }
}

// DELETE: Remove a financial record
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a vendor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access finances' }, { status: 403 });
    }

    // Get vendor record
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Finance record ID is required' }, { status: 400 });
    }

    // Verify the record belongs to this vendor
    const [existing] = await db
      .select()
      .from(vendorFinances)
      .where(
        and(
          eq(vendorFinances.id, id),
          eq(vendorFinances.vendorId, vendor.id)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Finance record not found' }, { status: 404 });
    }

    // Delete record
    await db.delete(vendorFinances).where(eq(vendorFinances.id, id));

    return NextResponse.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/vendor/finances error:', error);
    return NextResponse.json({ error: 'Failed to delete finance record' }, { status: 500 });
  }
}
