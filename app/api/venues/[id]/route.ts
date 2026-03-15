import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors, servicePackages, users, bookings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get venue from service packages
    const [venueService] = await db.select().from(servicePackages).where(eq(servicePackages.id, id)).limit(1);

    if (!venueService) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Get vendor details
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, venueService.vendorId)).limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Get user details for vendor
    const [user] = await db.select().from(users).where(eq(users.id, vendor.userId)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Expose vendorId and vendorEmail for quote requests
    const vendorId = vendor.id;
    const vendorEmail = user.email;

    // Get similar venues (same service type, different id)
    const similarVenues = await db.select()
      .from(servicePackages)
      .where(eq(servicePackages.serviceType, 'Venue'))
      .limit(4);

    // Filter out current venue and limit to 3
    const filteredSimilar = similarVenues.filter(v => v.id !== id).slice(0, 3);

    // Combine venue service with vendor data
    const metadata = venueService.metadata ? JSON.parse(venueService.metadata) : {};
    const venue = {
      id: venueService.id,
      name: venueService.name,
      businessName: venueService.name,
      category: 'Venues',
      location: metadata.location || vendor.location || 'Kigali, Rwanda',
      priceRange: `${venueService.price.toLocaleString()} RWF`,
      price: venueService.price,
      description: venueService.description,
      image: venueService.image,
      images: venueService.image ? JSON.stringify([venueService.image]) : '[]',
      featured: vendor.featured || false,
      email: user.email,
      phone: user.phone,
      rating: vendor.rating || 0,
      reviewCount: vendor.reviewCount || 0,
      vendorName: user.name,
      vendorImage: user.image,
      // Metadata fields
      venueType: metadata.venueType,
      minCapacity: metadata.minCapacity,
      maxCapacity: metadata.maxCapacity,
      indoorOutdoor: metadata.indoorOutdoor,
      spaceSize: metadata.spaceSize,
      parkingCapacity: metadata.parkingCapacity,
      accessibility: metadata.accessibility,
      cateringOptions: metadata.cateringOptions,
      barService: metadata.barService,
      avEquipment: metadata.avEquipment,
      lightingOptions: metadata.lightingOptions,
      furnitureIncluded: metadata.furnitureIncluded,
      bridalSuite: metadata.bridalSuite,
      accommodation: metadata.accommodation,
      amenities: metadata.amenities,
      pricingStructure: metadata.pricingStructure,
      rentalDuration: metadata.rentalDuration,
      setupTime: metadata.setupTime,
      depositRequired: metadata.depositRequired,
      paymentSchedule: metadata.paymentSchedule,
      cancellationPolicy: metadata.cancellationPolicy,
      restrictions: metadata.restrictions,
      insuranceRequired: metadata.insuranceRequired,
      portfolio: (() => {
        try {
          const all = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
          if (!Array.isArray(all)) return [];
          const forThis = all.filter((i: any) => i.serviceId === venueService.id);
          return forThis.length > 0 ? forThis : all.filter((i: any) => i.category === 'Venue');
        } catch { return []; }
      })(),
    };

    // Get availability (blocked dates) and bookings for this vendor
    const availability = vendor.availability ? JSON.parse(vendor.availability) : { blocked: [] };
    const vendorBookings = await db.select({ eventDate: bookings.eventDate })
      .from(bookings)
      .where(eq(bookings.vendorId, vendor.id));

    const bookedDates = vendorBookings
      .filter(b => b.eventDate)
      .map(b => new Date(b.eventDate!).toISOString().split('T')[0]);

    return NextResponse.json({ venue, similarVenues: filteredSimilar, blockedDates: availability.blocked || [], bookedDates, vendorId, vendorEmail });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 });
  }
}
