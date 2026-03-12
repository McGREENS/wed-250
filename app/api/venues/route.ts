import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors, servicePackages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // If category is Venues, get from service packages
    if (category === 'Venues') {
      const venueServices = await db.select({
        id: servicePackages.id,
        vendorId: servicePackages.vendorId,
        name: servicePackages.name,
        description: servicePackages.description,
        price: servicePackages.price,
        image: servicePackages.image,
        metadata: servicePackages.metadata,
        active: servicePackages.active,
      })
      .from(servicePackages)
      .where(eq(servicePackages.serviceType, 'Venue'));

      // Get vendor details for each venue
      const venuesWithVendor = await Promise.all(
        venueServices.map(async (venue: any) => {
          const [vendor] = await db.select().from(vendors).where(eq(vendors.id, venue.vendorId)).limit(1);
          const metadata = venue.metadata ? JSON.parse(venue.metadata) : {};
          
          return {
            id: venue.id,
            businessName: venue.name,
            category: 'Venues',
            location: vendor?.location || 'Kigali, Rwanda',
            priceRange: `${venue.price.toLocaleString()} RWF`,
            description: venue.description,
            images: venue.image ? JSON.stringify([venue.image]) : vendor?.images || '[]',
            featured: vendor?.featured || false,
            capacity: metadata.capacity,
            venueType: metadata.venueType,
            amenities: metadata.amenities,
          };
        })
      );

      // Filter by search if provided
      const filtered = search 
        ? venuesWithVendor.filter((v: any) => 
            v.businessName.toLowerCase().includes(search.toLowerCase()) ||
            v.description?.toLowerCase().includes(search.toLowerCase())
          )
        : venuesWithVendor;

      return NextResponse.json({ venues: filtered });
    }

    // For other categories, return empty for now
    return NextResponse.json({ venues: [] });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}
