"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from './AdminLayout';
import {
    Users,
    Calendar,
    ShoppingBag,
    TrendingUp,
    Building2,
    DollarSign,
    Star,
    FileText,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }

        fetchStats();
    }, [session, status, router]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `${stats.totalRevenue?.toLocaleString()} RWF`,
            icon: DollarSign,
            change: '+12.5%',
            trend: 'up',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            change: '+8.2%',
            trend: 'up',
            color: 'from-burgundy to-burgundy/60'
        },
        {
            title: 'Total Vendors',
            value: stats.totalVendors,
            icon: ShoppingBag,
            change: '+5.1%',
            trend: 'up',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: Calendar,
            change: '+15.3%',
            trend: 'up',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Total Services',
            value: stats.totalServices,
            icon: Building2,
            change: '+3.7%',
            trend: 'up',
            color: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Total Reviews',
            value: stats.totalReviews,
            icon: Star,
            change: '+9.4%',
            trend: 'up',
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            title: 'Pending Bookings',
            value: stats.pendingBookings,
            icon: FileText,
            change: '-2.1%',
            trend: 'down',
            color: 'from-red-500 to-red-600'
        },
        {
            title: 'Pending Tours',
            value: stats.pendingTours,
            icon: Building2,
            change: '+4.2%',
            trend: 'up',
            color: 'from-indigo-500 to-indigo-600'
        }
    ];

    const statusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        COUPLE: 'bg-pink-100 text-pink-800',
        VENDOR: 'bg-blue-100 text-blue-800',
        ADMIN: 'bg-purple-100 text-purple-800',
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-600">
                        Welcome back, {session?.user?.name}! Here's what's happening today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
                        return (
                            <Card key={index} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            <TrendIcon className="w-4 h-4" />
                                            {stat.change}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* User Distribution */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">User Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {stats.usersByRole && stats.usersByRole.length > 0 ? (
                                    stats.usersByRole.map((role: any) => (
                                        <div key={role.role} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge className={statusColors[role.role]}>
                                                    {role.role}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-burgundy h-2 rounded-full"
                                                        style={{ width: `${(role.count / stats.totalUsers) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-charcoal w-12 text-right">
                                                    {role.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Status */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Booking Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {stats.bookingsByStatus && stats.bookingsByStatus.length > 0 ? (
                                    stats.bookingsByStatus.map((booking: any) => (
                                        <div key={booking.status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge className={statusColors[booking.status]}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-burgundy h-2 rounded-full"
                                                        style={{ width: `${(booking.count / stats.totalBookings) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-charcoal w-12 text-right">
                                                    {booking.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Tables */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Users */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                                    stats.recentUsers.slice(0, 5).map((user: any) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-charcoal text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-sand text-charcoal border-0 text-xs">
                                                {user.role}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No users yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                                    stats.recentBookings.slice(0, 5).map((booking: any) => (
                                        <div
                                            key={booking.id}
                                            className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-charcoal text-sm truncate">{booking.clientName}</p>
                                                    <p className="text-xs text-gray-600">{booking.serviceType}</p>
                                                </div>
                                                <Badge className={`${statusColors[booking.status]} text-xs`}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-medium text-burgundy">
                                                {booking.totalAmount?.toLocaleString()} RWF
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No bookings yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Vendors */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Top Rated Vendors</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {stats.topVendors && stats.topVendors.length > 0 ? (
                                    stats.topVendors.map((vendor: any, index: number) => (
                                        <div
                                            key={vendor.id}
                                            className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                                        >
                                            <div className="w-8 h-8 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-burgundy font-bold text-sm">#{index + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-charcoal text-sm truncate">{vendor.businessName}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs text-gray-600">
                                                        {vendor.rating?.toFixed(1)} ({vendor.reviewCount} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No vendors yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
