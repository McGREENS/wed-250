"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { Calendar, Users, DollarSign, Heart, CheckCircle, Edit, Star, LogOut, Settings, FileText, MessageSquare, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import WeddingCountdown from '@/app/components/dashboard/WeddingCountDown';
import BudgetTracker from '@/app/components/dashboard/BudgetTracker';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Book venue', completed: true, category: 'Venue', dueDate: '2024-03-01' },
        { id: 2, title: 'Hire photographer', completed: false, category: 'Photography', dueDate: '2024-04-15' },
        { id: 3, title: 'Send invitations', completed: false, category: 'Planning', dueDate: '2024-05-01' },
        { id: 4, title: 'Book caterer', completed: false, category: 'Catering', dueDate: '2024-04-01' },
        { id: 5, title: 'Choose wedding dress', completed: false, category: 'Attire', dueDate: '2024-04-20' },
    ]);
    const [guests, setGuests] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', rsvp: 'confirmed', dietary: 'None', plusOne: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', rsvp: 'pending', dietary: 'Vegetarian', plusOne: false },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', rsvp: 'confirmed', dietary: 'Gluten-free', plusOne: true },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', rsvp: 'declined', dietary: 'None', plusOne: false },
    ]);

    const { data: weddingPlans = [], isLoading: plansLoading } = useQuery({
        queryKey: ['weddingPlans'],
        queryFn: () => base44.entities.WeddingPlan.list('-created_date', 10)
    });

    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => base44.entities.Booking.list('-created_date', 50)
    });

    const currentPlan = weddingPlans[0];

    const statusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-green-100 text-green-800 border-green-200'
    };

    const bookingStatusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const paymentStatusColors: any = {
        unpaid: 'bg-red-100 text-red-800',
        deposit_paid: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800'
    };

    if (plansLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <LoadingSpinner size="xl" text="Loading your dashboard..." />
            </div>
        );
    }

    if (!currentPlan) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-burgundy" />
                    </div>
                    <h2 className="text-2xl font-serif text-charcoal mb-4">
                        Welcome to Your Dashboard!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You haven't created a wedding plan yet. Let's get started on planning your dream wedding!
                    </p>
                    <Link href={createPageUrl('PlanBuilder')}>
                        <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                            Create Your Wedding Plan
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream bg-noise py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-serif text-charcoal mb-2">
                            Welcome Back, {currentPlan.couple_names}! 
                        </h1>
                        <p className="text-gray-600">
                            {currentPlan.wedding_date && `Your big day is on ${new Date(currentPlan.wedding_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-200">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Days Until Wedding</p>
                                    <p className="text-3xl font-bold text-burgundy">
                                        {Math.max(0, Math.ceil((new Date(currentPlan.wedding_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-burgundy" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Guest Count</p>
                                    <p className="text-3xl font-bold text-charcoal">
                                        {currentPlan.guest_count}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-sand/20 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-charcoal" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                                    <p className="text-3xl font-bold text-burgundy">
                                        ${currentPlan.budget?.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-burgundy" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Bookings</p>
                                    <p className="text-3xl font-bold text-charcoal">
                                        {bookings.filter((b: any) => b.booking_status === 'confirmed').length}/{bookings.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-sand/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-charcoal" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white border border-gray-100 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="checklist">Checklist</TabsTrigger>
                        <TabsTrigger value="guests">Guests</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <WeddingCountdown
                            weddingDate={currentPlan.wedding_date}
                            coupleNames={currentPlan.couple_names}
                        />

                        <div className="grid lg:grid-cols-2 gap-6">
                            <BudgetTracker
                                totalBudget={currentPlan.budget}
                                bookings={bookings}
                            />

                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">Your Wedding Plan</CardTitle>
                                        <Badge className={statusColors[currentPlan.status]}>
                                            {currentPlan.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Couple</p>
                                            <p className="font-semibold text-charcoal">{currentPlan.couple_names}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Wedding Date</p>
                                            <p className="font-semibold text-charcoal">
                                                {new Date(currentPlan.wedding_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Venue Preference</p>
                                            <p className="font-semibold text-charcoal">{currentPlan.venue_preference || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Services Needed</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {currentPlan.services_needed?.map((service: string, idx: number) => (
                                                    <Badge key={idx} variant="secondary" className="bg-sand text-charcoal">
                                                        {service}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full mt-6 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-3">
                                    <Link href={createPageUrl('Vendors')}>
                                        <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white justify-start">
                                            <Star className="w-4 h-4 mr-2" />
                                            Browse Vendors
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('checklist')}>
                                        <ClipboardList className="w-4 h-4 mr-2" />
                                        View Checklist
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('guests')}>
                                        <Users className="w-4 h-4 mr-2" />
                                        Manage Guests
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="checklist">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">Wedding Planning Checklist</CardTitle>
                                    <Badge className="bg-burgundy text-white">
                                        {tasks.filter(t => t.completed).length}/{tasks.length} Complete
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => {
                                                    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                                                }}
                                                className="w-5 h-5 text-burgundy rounded"
                                            />
                                            <div className="flex-1">
                                                <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-charcoal'}`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">{task.category}</Badge>
                                                    <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full mt-4 border-burgundy text-burgundy" variant="outline">
                                    <ClipboardList className="w-4 h-4 mr-2" />
                                    Add New Task
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="guests">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">Guest List Management</CardTitle>
                                    <div className="flex gap-2">
                                        <Badge className="bg-green-100 text-green-800">
                                            {guests.filter(g => g.rsvp === 'confirmed').length} Confirmed
                                        </Badge>
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            {guests.filter(g => g.rsvp === 'pending').length} Pending
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Name</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">RSVP</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Dietary</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">+1</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guests.map((guest) => (
                                                <tr key={guest.id} className="border-b border-gray-100 hover:bg-sand/20">
                                                    <td className="py-3 px-4 text-sm text-charcoal">{guest.name}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{guest.email}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={
                                                            guest.rsvp === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            guest.rsvp === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }>
                                                            {guest.rsvp}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{guest.dietary}</td>
                                                    <td className="py-3 px-4 text-sm">{guest.plusOne ? '✓' : '✗'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Button className="w-full mt-4 border-burgundy text-burgundy" variant="outline">
                                    <Users className="w-4 h-4 mr-2" />
                                    Add Guest
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl">Your Bookings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Heart className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-charcoal mb-2">
                                            No bookings yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Start browsing vendors and create your first booking
                                        </p>
                                        <Link href={createPageUrl('Vendors')}>
                                            <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                                Browse Vendors
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking: any) => (
                                            <div
                                                key={booking.id}
                                                className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-charcoal mb-1">
                                                            {booking.vendor_name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{booking.service_category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-burgundy">
                                                            ${booking.quote_amount?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge className={bookingStatusColors[booking.booking_status]}>
                                                        {booking.booking_status}
                                                    </Badge>
                                                    <Badge className={paymentStatusColors[booking.payment_status]}>
                                                        {booking.payment_status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="messages">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl">Vendor Messages</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { vendor: 'Kigali Serena Hotel', message: 'Your booking is confirmed for June 15th', time: '2 hours ago', unread: true },
                                        { vendor: 'Pixel Perfect Photography', message: 'Can we schedule a consultation call?', time: '1 day ago', unread: true },
                                        { vendor: 'Bloom & Bliss Decor', message: 'Here are the flower arrangement options', time: '3 days ago', unread: false },
                                    ].map((msg, idx) => (
                                        <div key={idx} className={`p-4 border rounded-lg ${msg.unread ? 'border-burgundy bg-burgundy/5' : 'border-gray-100'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="w-5 h-5 text-burgundy" />
                                                    <h4 className="font-semibold text-charcoal">{msg.vendor}</h4>
                                                </div>
                                                <span className="text-xs text-gray-500">{msg.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{msg.message}</p>
                                            <Button size="sm" variant="outline" className="mt-3 border-burgundy text-burgundy">
                                                Reply
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl">Documents & Contracts</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {[
                                        { name: 'Venue Contract - Kigali Serena', type: 'PDF', size: '2.4 MB', date: '2024-02-15' },
                                        { name: 'Photography Agreement', type: 'PDF', size: '1.8 MB', date: '2024-02-20' },
                                        { name: 'Catering Invoice', type: 'PDF', size: '856 KB', date: '2024-03-01' },
                                        { name: 'Guest List Spreadsheet', type: 'XLSX', size: '124 KB', date: '2024-03-05' },
                                    ].map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-burgundy" />
                                                <div>
                                                    <p className="font-medium text-charcoal">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full mt-4 border-burgundy text-burgundy" variant="outline">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Document
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
