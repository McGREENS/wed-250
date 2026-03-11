import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import VendorSettingsClient from './SettingsClient';

export default async function VendorSettingsPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);

    return (
        <VendorPageLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account and business preferences</p>
                </div>
                <VendorSettingsClient initialData={{ user, vendor }} />
            </div>
        </VendorPageLayout>
    );
}
