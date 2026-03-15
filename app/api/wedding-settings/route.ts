import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { weddings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userWedding = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);

    return NextResponse.json(userWedding[0] || null);
  } catch (error) {
    console.error('Wedding fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch wedding details' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { coupleNames, weddingDate, budget, guestCount, notes } = await request.json();
    
    if (!coupleNames || !weddingDate) {
      return NextResponse.json({ error: 'Couple names and wedding date are required' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if wedding already exists
    const existingWedding = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);

    if (existingWedding.length > 0) {
      // Update existing wedding
      const updatedWedding = await db.update(weddings)
        .set({
          coupleNames,
          weddingDate: new Date(weddingDate),
          budget: budget || 0,
          guestCount: guestCount || 0,
          notes: notes || null,
          updatedAt: new Date(),
        } as any)
        .where(eq(weddings.userId, userId))
        .returning();

      return NextResponse.json(updatedWedding[0]);
    } else {
      // Create new wedding
      const newWedding = await db.insert(weddings).values({
        userId,
        coupleNames,
        weddingDate: new Date(weddingDate),
        budget: budget || 0,
        guestCount: guestCount || 0,
        notes: notes || null,
        status: 'PLANNING',
      } as any).returning();

      return NextResponse.json(newWedding[0]);
    }
  } catch (error) {
    console.error('Wedding save error:', error);
    return NextResponse.json({ error: 'Failed to save wedding details' }, { status: 500 });
  }
}