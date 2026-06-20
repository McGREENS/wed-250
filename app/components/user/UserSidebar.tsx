import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Heart, CheckSquare, DollarSign, Users, Settings, LogOut, ChevronLeft, ChevronRight, Building2, Store, UserCog, Menu, X, MessageSquare, UserPlus, ListChecks } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUserSidebar } from './UserSidebarContext';
import { useUnreadMessages } from '@/app/contexts/UnreadMessagesContext';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/budget', label: 'Budget', icon: DollarSign },
  { href: '/dashboard/checklist', label: 'Checklist', icon: ListChecks },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/wedding-settings', label: 'Wedding Settings', icon: UserCog },
  { href: '/dashboard/referrals', label: 'Referrals', icon: UserPlus },
  { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useUserSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = useUnreadMessages();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-6 h-6 text-charcoal" />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      } w-64`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-center relative">
            {!collapsed ? (
              <Link href="/dashboard" className="flex items-center justify-center w-full" onClick={() => setMobileOpen(false)}>
                <Image src="/logo-couple.png" alt="Andiza Logo" width={120} height={120} className="object-contain" priority />
              </Link>
            ) : (
              <Link href="/dashboard" className="mx-auto" onClick={() => setMobileOpen(false)}>
                <Image src="/icon-couple.png" alt="Andiza Icon" width={40} height={40} className="object-contain" priority />
              </Link>
            )}
            {/* Close button for mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden absolute right-2 p-2 hover:bg-sand/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Collapse button for desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block absolute right-2 p-2 hover:bg-sand/30 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight className="w-5 h-5 text-charcoal" /> : <ChevronLeft className="w-5 h-5 text-charcoal" />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isMessagesLink = item.href === '/dashboard/messages';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center ${collapsed ? 'lg:justify-center' : 'gap-3'} gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive ? 'bg-burgundy text-white' : 'text-charcoal hover:bg-sand/30'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`text-sm font-medium ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  {isMessagesLink && unreadCount > 0 && (
                    <span className={`absolute ${collapsed ? 'lg:right-1 lg:top-1' : 'right-2'} bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                const returnUrl = `${window.location.origin}/login`;
                signOut({ callbackUrl: returnUrl });
              }}
              className={`flex items-center ${collapsed ? 'lg:justify-center' : 'gap-3'} gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full`}
              title={collapsed ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium ${collapsed ? 'lg:hidden' : ''}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
