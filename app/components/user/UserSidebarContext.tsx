"use client";

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const UserSidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function UserSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <UserSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </UserSidebarContext.Provider>
  );
}

export function useUserSidebar() {
  const context = useContext(UserSidebarContext);
  if (!context) {
    throw new Error('useUserSidebar must be used within UserSidebarProvider');
  }
  return context;
}
