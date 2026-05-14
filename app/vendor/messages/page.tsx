import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import MessagesClient from './MessagesClient';

export default async function VendorMessagesPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    return (
        <VendorPageLayout>
            <div className="max-w-7xl mx-auto">
                <MessagesClient />
            </div>
        </VendorPageLayout>
    );
}
