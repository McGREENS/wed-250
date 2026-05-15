import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors, servicePackages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [row] = await db
      .select({
        vendor: vendors,
        profileImage: users.image,
      })
      .from(vendors)
      .leftJoin(users, eq(vendors.userId, users.id))
      .where(eq(vendors.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const services = await db.select().from(servicePackages).where(eq(servicePackages.vendorId, id));

    return NextResponse.json({
      vendor: { 
        ...row.vendor, 
        profileImage: row.profileImage,
        calendarPublished: !!row.vendor.calendarPublished
      },
      services,
    });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
  }
}
