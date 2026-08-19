"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, MessageSquare, Briefcase, Image as ImageIcon, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, UserPlus, FileText, DollarSign } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSidebar } from './SidebarContext';
import { useUnreadMessages } from '@/app/contexts/UnreadMessagesContext';
import { useState } from 'react';

export default function VendorSidebar() {
    const pathname = usePathname();
    const { collapsed, setCollapsed } = useSidebar();
    const [mobileOpen, setMobileOpen] = useState(false);
    const unreadCount = useUnreadMessages();

    const navItems = [
        { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', href: '/vendor/bookings', icon: Briefcase },
        { name: 'Calendar', href: '/vendor/calendar', icon: Calendar },
        { name: 'Messages', href: '/vendor/messages', icon: MessageSquare },
        { name: 'Finances', href: '/vendor/finances', icon: DollarSign },
        { name: 'Invoices', href: '/vendor/invoices', icon: FileText },
        { name: 'Services', href: '/vendor/services', icon: Briefcase },
        { name: 'Portfolio', href: '/vendor/portfolio', icon: ImageIcon },
        { name: 'Referrals', href: '/vendor/referrals', icon: UserPlus },
        { name: 'Settings', href: '/vendor/settings', icon: Settings },
    ];

    const isActive = (href: string) => pathname === href;

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
            <div className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50 ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 ${
                collapsed ? 'lg:w-20' : 'lg:w-64'
            } w-64`}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-center relative">
                    {!collapsed ? (
                        <Link href="/vendor/dashboard" className="flex items-center justify-center w-full" onClick={() => setMobileOpen(false)}>
                            <Image src="/logo-vendor.png" alt="Vendor Logo" width={120} height={120} className="object-contain" priority />
                        </Link>
                    ) : (
                        <Link href="/vendor/dashboard" className="mx-auto" onClick={() => setMobileOpen(false)}>
                            <Image src="/icon-vendor.png" alt="Vendor Icon" width={40} height={40} className="object-contain" priority />
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
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isMessagesLink = item.href === '/vendor/messages';
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors relative ${
                                    isActive(item.href)
                                        ? 'bg-burgundy text-white'
                                        : 'text-gray-700 hover:bg-sand/30'
                                }`}
                                title={collapsed ? item.name : ''}
                            >
                                <Icon className="w-5 h-5" />
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                                {isMessagesLink && unreadCount > 0 && (
                                    <span className={`absolute ${collapsed ? 'right-1 top-1' : 'right-2'} bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
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
                            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                            signOut({ callbackUrl: `${siteUrl}/login` });
                        }}
                        className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full`}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
