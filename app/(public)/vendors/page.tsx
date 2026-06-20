import VendorsClient from './VendorsClient';
import { db } from '@/lib/db';
import { servicePackages, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function VendorsPage() {
  // Fetch all active service packages with vendor information
  const services = await db
    .select({
      id: servicePackages.id,
      serviceType: servicePackages.serviceType,
      name: servicePackages.name,
      description: servicePackages.description,
      price: servicePackages.price,
      features: servicePackages.features,
      image: servicePackages.image,
      vendorId: servicePackages.vendorId,
      vendorName: vendors.businessName,
      vendorRating: vendors.rating,
      vendorReviewCount: vendors.reviewCount,
      vendorFeatured: vendors.featured,
      vendorVerified: vendors.verified,
      vendorLocation: vendors.location,
    })
    .from(servicePackages)
    .innerJoin(vendors, eq(servicePackages.vendorId, vendors.id))
    .where(eq(servicePackages.active, true));

  const serializedServices = services.map((s) => ({
    ...s,
    price: Number(s.price),
    vendorRating: s.vendorRating ? Number(s.vendorRating) : null,
    features: s.features ? JSON.parse(s.features) : [],
  }));

  return <VendorsClient initialServices={serializedServices} />;
}
