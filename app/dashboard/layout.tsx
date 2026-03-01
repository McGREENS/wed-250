import Providers from '@/app/components/providers';
import { UserSidebarProvider } from '@/app/components/user/UserSidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <UserSidebarProvider>
        {children}
      </UserSidebarProvider>
    </Providers>
  );
}
