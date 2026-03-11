import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';
import { ne, like, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = db.select().from(vendors).where(ne(vendors.category, 'Venues'));

    if (search) {
      query = query.where(
        or(
          like(vendors.businessName, `%${search}%`),
          like(vendors.description, `%${search}%`)
        )
      ) as any;
    }

    const allVendors = await query;

    return NextResponse.json({ vendors: allVendors });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}
