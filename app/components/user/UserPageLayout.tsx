"use client";

import UserSidebar from './UserSidebar';
import { useUserSidebar } from './UserSidebarContext';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useUserSidebar();

  return (
    <>
      <UserSidebar />
      <main className={`min-h-screen bg-cream bg-noise py-8 px-6 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </>
  );
}
