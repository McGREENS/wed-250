import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { vendors, servicePackages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ServicesClient from './ServicesClient';

export default async function VendorServicesPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    const services = vendor ? await db.select().from(servicePackages).where(eq(servicePackages.vendorId, vendor.id)) : [];

    return (
        <VendorPageLayout>
            <ServicesClient initialServices={services} />
        </VendorPageLayout>
    );
}
