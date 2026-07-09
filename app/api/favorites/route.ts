import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { favorites, vendors, servicePackages } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));

    const favoriteVendors = [];
    const favoriteVenues = [];

    for (const fav of userFavorites) {
      if (fav.vendorId) {
        const [vendor] = await db
          .select()
          .from(vendors)
          .where(eq(vendors.id, fav.vendorId));
        if (vendor) {
          favoriteVendors.push({
            id: fav.id,
            vendorId: vendor.id,
            name: vendor.businessName,
            category: vendor.category,
            location: vendor.location,
            priceRange: vendor.priceRange,
            rating: vendor.rating,
            images: vendor.images,
            portfolio: vendor.portfolio,
            createdAt: fav.createdAt,
          });
        }
      }
      if (fav.venueId) {
        // Venues are stored as servicePackages
        const [venueService] = await db
          .select()
          .from(servicePackages)
          .where(eq(servicePackages.id, fav.venueId));
        if (venueService) {
          const metadata = venueService.metadata ? JSON.parse(venueService.metadata) : {};
          favoriteVenues.push({
            id: fav.id,
            venueId: venueService.id,
            name: venueService.name,
            location: metadata.location || 'Kigali, Rwanda',
            capacity: metadata.capacity || metadata.maxCapacity,
            pricePerDay: venueService.price,
            rating: 0,
            images: venueService.image ? JSON.stringify([venueService.image]) : '[]',
            venueType: metadata.venueType,
            createdAt: fav.createdAt,
          });
        }
      }
    }

    return NextResponse.json({ vendors: favoriteVendors, venues: favoriteVenues });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId, venueId } = await req.json();

    if (!vendorId && !venueId) {
      return NextResponse.json({ error: 'vendorId or venueId required' }, { status: 400 });
    }

    // Check if already exists
    const conditions = [eq(favorites.userId, await resolveOwnerUserId(session.user.id))];
    if (vendorId) conditions.push(eq(favorites.vendorId, vendorId));
    if (venueId) conditions.push(eq(favorites.venueId, venueId));

    const existing = await db
      .select()
      .from(favorites)
      .where(and(...conditions));

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
    }

    const [favorite] = await db.insert(favorites).values({
      userId: await resolveOwnerUserId(session.user.id),
      vendorId: vendorId || null,
      venueId: venueId || null,
    } as any).returning();

    return NextResponse.json({ favorite, success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const venueId = searchParams.get('venueId');

    if (!vendorId && !venueId) {
      return NextResponse.json({ error: 'vendorId or venueId required' }, { status: 400 });
    }

    const conditions = [eq(favorites.userId, await resolveOwnerUserId(session.user.id))];
    if (vendorId) conditions.push(eq(favorites.vendorId, vendorId));
    if (venueId) conditions.push(eq(favorites.venueId, venueId));

    await db.delete(favorites).where(and(...conditions));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
