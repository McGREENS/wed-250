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
    const userWeddings = await db.select().from(weddings).where(eq(weddings.userId, userId));

    return NextResponse.json({
      userId,
      weddings: userWeddings.map(w => ({
        ...w,
        weddingDate: w.weddingDate ? new Date(w.weddingDate).toISOString() : null,
        weddingDateReadable: w.weddingDate ? new Date(w.weddingDate).toLocaleDateString() : null
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 });
  }
}