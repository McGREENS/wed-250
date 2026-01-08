"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { MapPin, Users, Heart, Mail, Phone, CheckCircle, ArrowLeft, Star, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { useParams } from 'next/navigation';

export default function VenueDetailPage() {
    const [activeImage, setActiveImage] = useState(0);
    const params = useParams();
    const venueId = params.id as string;

    // Fetch venue data
    const { data: venues = [], isLoading } = useQuery({
        queryKey: ['venue', venueId],
        queryFn: () => base44.entities.Vendor.filter({ category: 'Venues' }, '-created_date', 100)
    });

    const venue = venues.find((v: any) => v.id === venueId) || venues[0];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <LoadingSpinner size="xl" text="Loading venue details..." />
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-charcoal mb-4">Venue not found</h2>
                    <Link href={createPageUrl('Venues')}>
                        <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                            Back to Venues
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Back Button */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href={createPageUrl('Venues')}
                        className="inline-flex items-center gap-2 text-charcoal hover:text-burgundy transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Venues</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="relative h-96 lg:h-[500px]">
                                <img
                                    src={venue.images?.[activeImage] || venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=1200&h=800&fit=crop'}
                                    alt={venue.name}
                                    className="w-full h-full object-cover"
                                />
                                {venue.featured && (
                                    <Badge className="absolute top-4 left-4 bg-burgundy text-white border-0 text-sm">
                                        <Star className="w-4 h-4 mr-1 fill-current" />
                                        Featured Venue
                                    </Badge>
                                )}
                            </div>
                            {venue.images?.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {venue.images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index
                                                ? 'border-burgundy'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${venue.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Venue Details */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-charcoal mb-3">
                                            {venue.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-5 h-5 text-burgundy" />
                                                {venue.location}
                                            </span>
                                            {venue.capacity && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-5 h-5 text-burgundy" />
                                                    Up to {venue.capacity} guests
                                                </span>
                                            )}
                                            {venue.venue_type && (
                                                <Badge className="bg-sand text-charcoal border-0">
                                                    {venue.venue_type}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-burgundy mb-1">
                                            {venue.price_range}
                                        </div>
                                        <div className="text-sm text-gray-600">Price Range</div>
                                    </div>
                                </div>

                                <Tabs defaultValue="overview" className="mt-6">
                                    <TabsList className="w-full border-b border-gray-200 bg-transparent">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="features">Features</TabsTrigger>
                                        <TabsTrigger value="availability">Availability</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="mt-6">
                                        <h2 className="text-lg font-semibold text-charcoal mb-3">About This Venue</h2>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            {venue.description}
                                        </p>

                                        {venue.capacity && (
                                            <div className="bg-sand/30 rounded-xl p-4 mb-4">
                                                <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-gold" />
                                                    Guest Capacity
                                                </h3>
                                                <p className="text-gray-700">
                                                    This venue can comfortably accommodate up to <strong>{venue.capacity} guests</strong> for your event.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="features" className="mt-6">
                                        <h2 className="text-lg font-semibold text-charcoal mb-4">Amenities & Features</h2>
                                        {venue.features?.length > 0 ? (
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {venue.features.map((feature: string, index: number) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">Contact venue for feature details.</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="availability" className="mt-6">
                                        <div className="flex items-center gap-2 text-gray-700 bg-burgundy/10 rounded-xl p-4">
                                            <Calendar className="w-5 h-5 text-burgundy" />
                                            <span>{venue.availability || 'Contact venue for availability'}</span>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-semibold text-charcoal mb-6">
                                Contact Venue
                            </h3>

                            <div className="space-y-4 mb-6">
                                {venue.contact_email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Email</div>
                                            <a
                                                href={`mailto:${venue.contact_email}`}
                                                className="text-charcoal hover:text-burgundy transition-colors break-all"
                                            >
                                                {venue.contact_email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {venue.contact_phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Phone</div>
                                            <a
                                                href={`tel:${venue.contact_phone}`}
                                                className="text-charcoal hover:text-burgundy transition-colors"
                                            >
                                                {venue.contact_phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Request Quote
                                </Button>
                                <Button variant="outline" className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Save to Favorites
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule Tour
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="bg-sand/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        💡 <strong>Pro Tip:</strong> Book a venue tour to experience the space in person and discuss your vision with the team!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
