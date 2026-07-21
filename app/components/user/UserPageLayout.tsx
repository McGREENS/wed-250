"use client";

import UserSidebar from './UserSidebar';
import { useUserSidebar } from './UserSidebarContext';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useUserSidebar();

  return (
    <div className="flex min-h-screen bg-cream bg-noise overflow-x-hidden">
      <UserSidebar />
      <main className={`flex-1 w-full py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8 transition-all duration-300 ${collapsed ? 'lg:ml-[5.5rem]' : 'lg:ml-[17rem]'} overflow-x-hidden`}>
        {children}
      </main>
    </div>
  );
}
