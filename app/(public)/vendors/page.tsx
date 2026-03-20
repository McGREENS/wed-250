import { db } from '@/lib/db';
import { servicePackages, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import VendorsClient from './VendorsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getServices() {
  const rows = await db
    .select({
      id: servicePackages.id,
      serviceType: servicePackages.serviceType,
      name: servicePackages.name,
      description: servicePackages.description,
      price: servicePackages.price,
      image: servicePackages.image,
      features: servicePackages.features,
      metadata: servicePackages.metadata,
      active: servicePackages.active,
      createdAt: servicePackages.createdAt,
      vendorId: vendors.id,
      vendorName: vendors.businessName,
      vendorLocation: vendors.location,
      vendorRating: vendors.rating,
      vendorVerified: vendors.verified,
      vendorFeatured: vendors.featured,
      vendorPortfolio: vendors.portfolio,
    })
    .from(servicePackages)
    .innerJoin(vendors, eq(servicePackages.vendorId, vendors.id))
    .where(eq(servicePackages.active, true));

  const services = rows
    .filter((r) => r.serviceType !== 'Venue')
    .map((r) => ({
      ...r,
      features: r.features ? JSON.parse(r.features) : {},
      metadata: r.metadata ? JSON.parse(r.metadata) : {},
      vendorPortfolio: r.vendorPortfolio ? JSON.parse(r.vendorPortfolio) : [],
    }));

  return services;
}

export default async function VendorsPage() {
  const services = await getServices();
  
  return <VendorsClient initialServices={services} />;
}
