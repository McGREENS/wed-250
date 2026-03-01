"use client";

import { ReactNode } from 'react';
import VendorSidebar from './VendorSidebar';
import { useSidebar } from './SidebarContext';

export default function VendorPageLayout({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-cream">
      <VendorSidebar />
      <div className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </div>
    </div>
  );
}
