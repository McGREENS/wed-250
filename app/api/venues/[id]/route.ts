import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [venue] = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Get similar venues (same category, different id)
    const similarVenues = await db.select()
      .from(vendors)
      .where(and(eq(vendors.category, venue.category), ne(vendors.id, id)))
      .limit(3);

    return NextResponse.json({ venue, similarVenues });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 });
  }
}
