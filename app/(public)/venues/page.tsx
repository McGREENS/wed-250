import { db } from '@/lib/db';
import { vendors, servicePackages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import VenuesClient from './VenuesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getVenues() {
    const venueServices = await db
        .select({
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

    const venuesWithVendor = await Promise.all(
        venueServices.map(async (venue) => {
            const [vendor] = await db
                .select()
                .from(vendors)
                .where(eq(vendors.id, venue.vendorId))
                .limit(1);

            let meta: Record<string, any> = {};
            try {
                if (venue.metadata) {
                    const parsed = JSON.parse(venue.metadata);
                    if (parsed.metadata && typeof parsed.metadata === 'string') {
                        meta = { ...JSON.parse(parsed.metadata), ...parsed };
                    } else {
                        meta = parsed;
                    }
                }
            } catch { /* ignore */ }

            const maxCap = parseInt(meta.maxCapacity) || null;
            const minCap = parseInt(meta.minCapacity) || null;

            const amenities: string[] = [];
            if (meta.parkingCapacity) amenities.push('Parking');
            if (meta.bridalSuite === 'yes') amenities.push('Bridal Suite');
            if (meta.barService && meta.barService !== 'none') amenities.push('Bar Service');
            if (meta.cateringOptions && meta.cateringOptions !== 'none') amenities.push('Catering Kitchen');
            if (meta.accommodation) amenities.push('Accommodation');
            if (meta.avEquipment) amenities.push('Audio/Visual Equipment');
            if (meta.furnitureIncluded === 'yes') amenities.push('Tables & Chairs');
            if (meta.accessibility) amenities.push('Wheelchair Accessible');
            if (meta.indoorOutdoor === 'outdoor' || meta.indoorOutdoor === 'both') amenities.push('Outdoor Space');

            return {
                id: venue.id,
                name: venue.name,
                description: venue.description,
                price: venue.price,
                image: venue.image,
                featured: vendor?.featured || false,
                location: meta.location || vendor?.location || 'Kigali, Rwanda',
                venueType: meta.venueType || null,
                indoorOutdoor: meta.indoorOutdoor || null,
                maxCapacity: maxCap,
                minCapacity: minCap,
                amenities,
            };
        })
    );

    return venuesWithVendor;
}

export default async function VenuesPage() {
    const venues = await getVenues();
    
    return <VenuesClient initialVenues={venues} />;
}
