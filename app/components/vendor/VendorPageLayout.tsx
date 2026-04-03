"use client";

import { ReactNode } from 'react';
import VendorSidebar from './VendorSidebar';
import { useSidebar } from './SidebarContext';

export default function VendorPageLayout({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-cream overflow-x-hidden">
      <VendorSidebar />
      <div className={`flex-1 w-full p-4 sm:p-6 lg:p-8 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} overflow-x-hidden`}>
        {children}
      </div>
    </div>
  );
}
