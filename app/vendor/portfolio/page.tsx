import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import PortfolioClient from './PortfolioClient';

export default async function VendorPortfolioPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    const portfolio = vendor?.portfolio ? JSON.parse(vendor.portfolio) : [];

    return (
        <VendorPageLayout>
            <PortfolioClient initialPortfolio={portfolio} />
        </VendorPageLayout>
    );
}
