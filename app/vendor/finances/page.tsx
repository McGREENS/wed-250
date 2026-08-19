import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FinancesClient from './FinancesClient';

export default async function VendorFinancesPage() {
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
        <FinancesClient />
      </div>
    </VendorPageLayout>
  );
}
