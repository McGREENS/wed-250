"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Calendar,
    Building2,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Star,
    FileText,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const dangerZone = [
        { name: 'Clear Data', href: '/admin/clear-data', icon: Trash2 },
    ];

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out ${
                    collapsed ? 'w-20' : 'w-64'
                } lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        {!collapsed ? (
                            <Link href="/admin" className="flex items-center justify-center w-full">
                                <Image src="/logo.png" alt="Andiza Logo" width={120} height={120} className="object-contain" priority />
                            </Link>
                        ) : (
                            <Link href="/admin" className="mx-auto">
                                <Image src="/logo.png" alt="Andiza Logo" width={50} height={50} className="object-contain" priority />
                            </Link>
                        )}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 absolute right-4"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                isActive
                                                    ? 'bg-burgundy text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            } ${collapsed ? 'justify-center' : ''}`}
                                            title={collapsed ? item.name : ''}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            {!collapsed && <span className="font-medium">{item.name}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Danger Zone */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            {!collapsed && <p className="text-xs font-semibold text-red-600 uppercase tracking-wider px-4 mb-2">Danger Zone</p>}
                            <ul className="space-y-1">
                                {dangerZone.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                    isActive
                                                        ? 'bg-red-600 text-white'
                                                        : 'text-red-600 hover:bg-red-50'
                                                } ${collapsed ? 'justify-center' : ''}`}
                                                title={collapsed ? item.name : ''}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                {!collapsed && <span className="font-medium">{item.name}</span>}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>

                    {/* User info & logout */}
                    <div className="p-4 border-t border-gray-200">
                        {!collapsed ? (
                            <>
                                <div className="flex items-center gap-3 mb-3 px-2">
                                    <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                        <span className="text-burgundy font-semibold">
                                            {session?.user?.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-charcoal truncate">
                                            {session?.user?.name || 'Admin'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-3">
                                    <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                        <span className="text-burgundy font-semibold">
                                            {session?.user?.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Collapse toggle button - Desktop only */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-600 hover:text-burgundy hover:border-burgundy transition-colors shadow-sm"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1" />
                    </div>
                </header>

                {/* Page content */}
                <main>{children}</main>
            </div>
        </div>
    );
}
