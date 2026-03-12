import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let allVendors = await db.select().from(vendors);

    // Filter by search if provided
    if (search) {
      allVendors = allVendors.filter((v: any) => 
        v.businessName.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter out vendors that only have Venues category
    allVendors = allVendors.filter((v: any) => {
      const categories = v.categories ? JSON.parse(v.categories) : [];
      return categories.length === 0 || !categories.every((cat: string) => cat === 'Venues');
    });

    // Parse portfolio for each vendor
    const vendorsWithPortfolio = allVendors.map((v: any) => {
      const portfolioImages = v.portfolio ? JSON.parse(v.portfolio) : [];
      return {
        ...v,
        portfolioImages: portfolioImages
      };
    });

    return NextResponse.json({ vendors: vendorsWithPortfolio });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}
