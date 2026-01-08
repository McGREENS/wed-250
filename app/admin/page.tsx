"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
    Users,
    Calendar,
    ShoppingBag,
    Mail,
    TrendingUp,
    Search,
    MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all data
    const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
        queryKey: ['vendors'],
        queryFn: () => base44.entities.Vendor.list('-created_date', 100)
    });

    const { data: weddingPlans = [], isLoading: plansLoading } = useQuery({
        queryKey: ['weddingPlans'],
        queryFn: () => base44.entities.WeddingPlan.list('-created_date', 100)
    });

    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => base44.entities.Booking.list('-created_date', 100)
    });

    const { data: messages = [], isLoading: messagesLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: () => base44.entities.ContactMessage.list('-created_date', 100)
    });

    // Calculate stats
    const stats = [
        {
            title: 'Total Vendors',
            value: vendors.length,
            icon: ShoppingBag,
            change: '+12%',
            color: 'from-burgundy to-burgundy/60'
        },
        {
            title: 'Active Plans',
            value: weddingPlans.filter((p: any) => p.status !== 'completed').length,
            icon: Calendar,
            change: '+8%',
            color: 'from-gold to-gold/60'
        },
        {
            title: 'Total Bookings',
            value: bookings.length,
            icon: Users,
            change: '+23%',
            color: 'from-burgundy to-burgundy/60'
        },
        {
            title: 'New Messages',
            value: messages.filter((m: any) => m.status === 'new').length,
            icon: Mail,
            change: '',
            color: 'from-gold to-gold/60'
        }
    ];

    const statusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        new: 'bg-red-100 text-red-800',
        read: 'bg-gray-100 text-gray-800',
        replied: 'bg-green-100 text-green-800'
    };

    return (
        <div className="min-h-screen bg-cream bg-noise">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif text-charcoal mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage vendors, wedding plans, and bookings
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        {stat.change && (
                                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <TrendingUp className="w-4 h-4" />
                                                {stat.change}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white border border-gray-100 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="vendors">Vendors</TabsTrigger>
                        <TabsTrigger value="plans">Wedding Plans</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Recent Plans */}
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Recent Wedding Plans</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {weddingPlans.slice(0, 5).map((plan: any) => (
                                            <div
                                                key={plan.id}
                                                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-semibold text-charcoal">{plan.couple_names}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(plan.wedding_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge className={statusColors[plan.status]}>
                                                    {plan.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Messages */}
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Recent Messages</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {messages.slice(0, 5).map((message: any) => (
                                            <div
                                                key={message.id}
                                                className="p-3 border border-gray-100 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className="font-semibold text-charcoal">{message.name}</p>
                                                    <Badge className={statusColors[message.status]}>
                                                        {message.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {message.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Vendors Tab */}
                    <TabsContent value="vendors">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">All Vendors</CardTitle>
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                        Add Vendor
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            placeholder="Search vendors..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Price Range</TableHead>
                                                <TableHead>Featured</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vendors
                                                .filter((v: any) =>
                                                    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    v.category?.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((vendor: any) => (
                                                    <TableRow key={vendor.id}>
                                                        <TableCell className="font-medium">{vendor.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="bg-sand text-charcoal border-0">
                                                                {vendor.category}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{vendor.location}</TableCell>
                                                        <TableCell>{vendor.price_range}</TableCell>
                                                        <TableCell>
                                                            {vendor.featured && (
                                                                <Badge className="bg-burgundy text-white">Featured</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Wedding Plans Tab */}
                    <TabsContent value="plans">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">All Wedding Plans</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Couple</TableHead>
                                                <TableHead>Wedding Date</TableHead>
                                                <TableHead>Guest Count</TableHead>
                                                <TableHead>Budget</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {weddingPlans.map((plan: any) => (
                                                <TableRow key={plan.id}>
                                                    <TableCell className="font-medium">{plan.couple_names}</TableCell>
                                                    <TableCell>
                                                        {new Date(plan.wedding_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>{plan.guest_count}</TableCell>
                                                    <TableCell>${plan.budget?.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge className={statusColors[plan.status]}>
                                                            {plan.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">All Bookings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Vendor</TableHead>
                                                <TableHead>Service</TableHead>
                                                <TableHead>Quote</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Payment</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.map((booking: any) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell className="font-medium">{booking.vendor_name}</TableCell>
                                                    <TableCell>{booking.service_category}</TableCell>
                                                    <TableCell>${booking.quote_amount?.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge className={statusColors[booking.booking_status]}>
                                                            {booking.booking_status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={statusColors[booking.payment_status]}>
                                                            {booking.payment_status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Messages Tab */}
                    <TabsContent value="messages">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Contact Messages</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {messages.map((message: any) => (
                                        <div
                                            key={message.id}
                                            className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-charcoal">{message.name}</h4>
                                                    <p className="text-sm text-gray-600">{message.email}</p>
                                                </div>
                                                <Badge className={statusColors[message.status]}>
                                                    {message.status}
                                                </Badge>
                                            </div>
                                            {message.subject && (
                                                <p className="font-medium text-charcoal mb-2">{message.subject}</p>
                                            )}
                                            <p className="text-gray-700">{message.message}</p>
                                            <div className="flex gap-2 mt-4">
                                                <Button size="sm" className="bg-burgundy hover:bg-burgundy-light text-white">
                                                    Reply
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Mark as Read
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
