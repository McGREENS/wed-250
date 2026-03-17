import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors, servicePackages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params;

    const [service] = await db.select().from(servicePackages).where(eq(servicePackages.id, serviceId)).limit(1);
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    const [vendorRow] = await db
      .select({
        id: vendors.id, userId: vendors.userId, businessName: vendors.businessName,
        categories: vendors.categories, description: vendors.description, location: vendors.location,
        priceRange: vendors.priceRange, rating: vendors.rating, reviewCount: vendors.reviewCount,
        featured: vendors.featured, verified: vendors.verified, images: vendors.images,
        portfolio: vendors.portfolio, availability: vendors.availability,
        createdAt: vendors.createdAt, updatedAt: vendors.updatedAt,
        profileImage: users.image,
      })
      .from(vendors)
      .leftJoin(users, eq(vendors.userId, users.id))
      .where(eq(vendors.id, service.vendorId))
      .limit(1);

    if (!vendorRow) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const allVendorServices = await db.select().from(servicePackages).where(eq(servicePackages.vendorId, service.vendorId));
    const otherServices = allVendorServices.filter((s) => s.id !== serviceId && s.active !== false);

    return NextResponse.json({ service, vendor: vendorRow, otherServices });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
