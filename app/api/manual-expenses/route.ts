import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { manualExpenses } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expenses = await db
      .select()
      .from(manualExpenses)
      .where(eq(manualExpenses.userId, session.user.id))
      .orderBy(desc(manualExpenses.paidAt));

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Get manual expenses error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, vendorName, amount, note, paidAt } = body;

    if (!category || !vendorName || !amount) {
      return NextResponse.json(
        { error: 'Category, vendor name, and amount are required' },
        { status: 400 }
      );
    }

    const expenseData: any = {
      id: crypto.randomUUID(),
      userId: session.user.id,
      category,
      vendorName,
      amount: parseFloat(amount),
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      createdAt: new Date(),
    };

    if (note) {
      expenseData.note = note;
    }

    const [expense] = await db
      .insert(manualExpenses)
      .values(expenseData)
      .returning();

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Add manual expense error:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const expenseId = searchParams.get('id');

    if (!expenseId) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    await db
      .delete(manualExpenses)
      .where(eq(manualExpenses.id, expenseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete manual expense error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
