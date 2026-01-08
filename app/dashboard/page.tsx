"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { Calendar, Users, DollarSign, Heart, CheckCircle, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import WeddingCountdown from '@/app/components/dashboard/WeddingCountDown';
import BudgetTracker from '@/app/components/dashboard/BudgetTracker';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch wedding plans
    const { data: weddingPlans = [], isLoading: plansLoading } = useQuery({
        queryKey: ['weddingPlans'],
        queryFn: () => base44.entities.WeddingPlan.list('-created_date', 10)
    });

    // Fetch bookings
    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => base44.entities.Booking.list('-created_date', 50)
    });

    // Get the most recent wedding plan
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif text-charcoal mb-2">
                        Welcome Back, {currentPlan.couple_names}! 💕
                    </h1>
                    <p className="text-gray-600">
                        {currentPlan.wedding_date && `Your big day is on ${new Date(currentPlan.wedding_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    </p>
                </div>

                {/* Stats Cards */}
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

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white border border-gray-100 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="vendors">Find Vendors</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Countdown */}
                        <WeddingCountdown
                            weddingDate={currentPlan.wedding_date}
                            coupleNames={currentPlan.couple_names}
                        />

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Budget Tracker */}
                            <BudgetTracker
                                totalBudget={currentPlan.budget}
                                bookings={bookings}
                            />

                            {/* Wedding Plan Details */}
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
                                        {currentPlan.notes && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Notes</p>
                                                <p className="text-sm text-gray-700">{currentPlan.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="outline" className="w-full mt-6 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Quick Actions */}
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <Link href={createPageUrl('Vendors')}>
                                            <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white justify-start">
                                                <Star className="w-4 h-4 mr-2" />
                                                Browse Vendors
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule Consultation
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            Track Budget
                                        </Button>
                                    </div>

                                    <div className="mt-6 p-4 bg-sand/20 rounded-xl">
                                        <h4 className="font-semibold text-charcoal mb-2">💡 Planning Tip</h4>
                                        <p className="text-sm text-gray-700">
                                            Start booking your key vendors (venue, photographer, caterer) 12-18 months before your wedding date for the best availability!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Bookings Tab */}
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

                    {/* Find Vendors Tab */}
                    <TabsContent value="vendors">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl">Recommended Vendors</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Star className="w-8 h-8 text-burgundy" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                                        Personalized Recommendations Coming Soon
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Our team is curating the perfect vendor matches for your wedding
                                    </p>
                                    <Link href={createPageUrl('Vendors')}>
                                        <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                            Browse All Vendors
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
