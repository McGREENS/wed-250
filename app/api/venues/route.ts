import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = db.select().from(vendors);
    
    const conditions = [];
    if (category) {
      conditions.push(eq(vendors.category, category));
    }
    if (search) {
      conditions.push(like(vendors.businessName, `%${search}%`));
    }

    const allVendors = conditions.length > 0 
      ? await query.where(and(...conditions))
      : await query;

    return NextResponse.json({ venues: allVendors });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}
