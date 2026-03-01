import Providers from '@/app/components/providers';
import { SidebarProvider } from '@/app/components/vendor/SidebarContext';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </Providers>
  );
}
