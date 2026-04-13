import { db } from '@/lib/db';
import { servicePackages, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import VendorsClient from './VendorsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getServices() {
  try {
    const rows = await db
      .select({
        id: servicePackages.id,
        serviceType: servicePackages.serviceType,
        name: servicePackages.name,
        description: servicePackages.description,
        price: servicePackages.price,
        image: servicePackages.image,
        active: servicePackages.active,
        createdAt: servicePackages.createdAt,
        vendorId: vendors.id,
        vendorName: vendors.businessName,
        vendorLocation: vendors.location,
        vendorRating: vendors.rating,
        vendorVerified: vendors.verified,
        vendorFeatured: vendors.featured,
      })
      .from(servicePackages)
      .innerJoin(vendors, eq(servicePackages.vendorId, vendors.id));

    const services = rows.filter((r) => r.serviceType !== 'Venue');

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function VendorsPage() {
  const services = await getServices();
  
  return <VendorsClient initialServices={services} />;
}
