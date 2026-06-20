import VenuesClient from './VenuesClient';
import { db } from '@/lib/db';
import { servicePackages, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function VenuesPage() {
    // Fetch all venue service packages
    const venueServices = await db
        .select({
            id: servicePackages.id,
            serviceType: servicePackages.serviceType,
            name: servicePackages.name,
            description: servicePackages.description,
            price: servicePackages.price,
            features: servicePackages.features,
            metadata: servicePackages.metadata,
            image: servicePackages.image,
            vendorId: servicePackages.vendorId,
            vendorName: vendors.businessName,
            vendorRating: vendors.rating,
            vendorReviewCount: vendors.reviewCount,
            vendorFeatured: vendors.featured,
            vendorLocation: vendors.location,
        })
        .from(servicePackages)
        .innerJoin(vendors, eq(servicePackages.vendorId, vendors.id))
        .where(eq(servicePackages.serviceType, 'Venue'));

    // Parse and serialize the data
    const serializedVenues = venueServices.map((v) => {
        const metadata = v.metadata ? JSON.parse(v.metadata) : {};
        return {
            id: v.id,
            name: v.name,
            description: v.description,
            price: Number(v.price),
            image: v.image,
            location: v.vendorLocation,
            vendorName: v.vendorName,
            vendorRating: v.vendorRating ? Number(v.vendorRating) : null,
            vendorReviewCount: v.vendorReviewCount,
            vendorFeatured: v.vendorFeatured,
            capacity: metadata.capacity || 0,
            maxCapacity: metadata.maxCapacity || metadata.capacity || 0,
            venueType: metadata.venueType || 'Modern',
            amenities: v.features ? JSON.parse(v.features) : [],
        };
    });

    return <VenuesClient initialVenues={serializedVenues} />;
}
