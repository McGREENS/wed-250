"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, MessageSquare, Briefcase, Image, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSidebar } from './SidebarContext';

export default function VendorSidebar() {
    const pathname = usePathname();
    const { collapsed, setCollapsed } = useSidebar();

    const navItems = [
        { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', href: '/vendor/bookings', icon: Briefcase },
        { name: 'Calendar', href: '/vendor/calendar', icon: Calendar },
        { name: 'Services', href: '/vendor/services', icon: Briefcase },
        { name: 'Portfolio', href: '/vendor/portfolio', icon: Image },
        { name: 'Settings', href: '/vendor/settings', icon: Settings },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300`}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                {!collapsed && (
                    <div>
                        <h2 className="text-xl font-bold text-charcoal">Vendor Portal</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your business</p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-sand/30 rounded-lg transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                                isActive(item.href)
                                    ? 'bg-burgundy text-white'
                                    : 'text-gray-700 hover:bg-sand/30'
                            }`}
                            title={collapsed ? item.name : ''}
                        >
                            <Icon className="w-5 h-5" />
                            {!collapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full`}
                    title={collapsed ? 'Logout' : ''}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
}
