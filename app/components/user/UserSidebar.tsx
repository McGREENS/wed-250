"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Heart, CheckSquare, DollarSign, Users, Settings, LogOut, ChevronLeft, ChevronRight, Building2, Store, UserCog } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUserSidebar } from './UserSidebarContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/wedding-settings', label: 'Wedding Settings', icon: UserCog },
  { href: '/venues', label: 'Browse Venues', icon: Building2 },
  { href: '/vendors', label: 'Browse Vendors', icon: Store },
  { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useUserSidebar();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && <h2 className="text-xl font-serif text-burgundy">Andiza</h2>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-sand/30 rounded-lg transition-colors">
            {collapsed ? <ChevronRight className="w-5 h-5 text-charcoal" /> : <ChevronLeft className="w-5 h-5 text-charcoal" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-burgundy text-white' : 'text-charcoal hover:bg-sand/30'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
