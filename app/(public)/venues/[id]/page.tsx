"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { MapPin, Users, Heart, ArrowLeft, Star, Calendar, DollarSign, Car, Wifi, UtensilsCrossed, Music, Shield, MessageCircle, CalendarDays, Download, Info } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DEFAULT_AMENITIES = [
    { label: 'Up to 500 Guests', icon: Users },
    { label: 'Ample On-site Parking', icon: Car },
    { label: 'Complimentary Fiber Wifi', icon: Wifi },
    { label: 'Professional In-house Catering', icon: UtensilsCrossed },
    { label: 'Premium Sound System', icon: Music },
    { label: '24/7 Secure Venue', icon: Shield },
];

const VENUE_RENTAL_RWF = 1500000;
const SERVICE_TAX_RATE = 0.05;

export default function VenueDetailPage() {
    const [activeImage, setActiveImage] = useState(0);
    const [preferredDate, setPreferredDate] = useState<Date | undefined>();
    const [guestCount, setGuestCount] = useState<string>('');
    const params = useParams();
    const venueId = params.id as string;

    // Fetch venue data
    const { data: venues = [], isLoading } = useQuery({
        queryKey: ['venue', venueId],
        queryFn: () => base44.entities.Vendor.filter({ category: 'Venues' }, '-created_date', 100)
    });

    const venue = venues.find((v: any) => v.id === venueId) || venues[0];

    // Ensure venue has all required properties with fallbacks
    const venueWithDefaults = {
        ...venue,
        venue_type: (venue as any)?.venue_type || 'Indoor',
        capacity: (venue as any)?.capacity || 200,
        max_capacity: (venue as any)?.max_capacity || 500,
        contact_email: (venue as any)?.contact_email || 'info@venue.rw',
        contact_phone: (venue as any)?.contact_phone || '+250 788 123 456',
        availability: (venue as any)?.availability || 'Available for bookings',
        features: (venue as any)?.features || [],
        starting_price_rwf: (venue as any)?.starting_price_rwf ?? VENUE_RENTAL_RWF,
    };

    const capacityRange = `${venueWithDefaults.capacity || 200} - ${venueWithDefaults.max_capacity || 500} Guests`;
    const startingPriceFormatted = (venueWithDefaults as any).price_range || '1,500,000 RWF';
    const venueRentalRwf = venueWithDefaults.starting_price_rwf ?? VENUE_RENTAL_RWF;
    const serviceTaxRwf = Math.round(venueRentalRwf * SERVICE_TAX_RATE);
    const estimatedTotalRwf = venueRentalRwf + serviceTaxRwf;
    const serviceTaxFormatted = serviceTaxRwf.toLocaleString('en-US') + ' RWF';
    const totalFormatted = estimatedTotalRwf.toLocaleString('en-US') + ' RWF';
    const rentalFormatted = venueRentalRwf.toLocaleString('en-US') + ' RWF';

    // Sample booked dates for availability calendar
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const bookedDates = [
        new Date(today.getFullYear(), today.getMonth() + 1, 4),
        new Date(today.getFullYear(), today.getMonth() + 1, 5),
        new Date(today.getFullYear(), today.getMonth() + 1, 11),
        new Date(today.getFullYear(), today.getMonth() + 1, 18),
        new Date(today.getFullYear(), today.getMonth() + 1, 25),
    ];

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
            {/* Hero Section */}
            <div className="relative">
                {/* Hero Background Image */}
                <div className="relative h-[400px] md:h-[500px]">
                    <img
                        src={venueWithDefaults.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=1600&h=800&fit=crop'}
                        alt={venueWithDefaults.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Back Button */}
                    <div className="absolute top-6 left-6">
                        <Link
                            href={createPageUrl('Venues')}
                            className="inline-flex items-center gap-2 text-white hover:text-burgundy transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Venues</span>
                        </Link>
                    </div>

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className="bg-burgundy text-white border-0">
                                            {venueWithDefaults.venue_type || 'Venue'}
                                        </Badge>
                                        {venueWithDefaults.featured && (
                                            <Badge className="bg-gold text-charcoal border-0">
                                                <Star className="w-4 h-4 mr-1 fill-current" />
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                                        {venueWithDefaults.name}
                                    </h1>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            {venueWithDefaults.location}
                                        </span>
                                        {venueWithDefaults.capacity && (
                                            <span className="flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                Up to {venueWithDefaults.capacity} guests
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Hero Actions */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white px-6 py-3">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Save Venue
                                    </Button>
                                    <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-charcoal px-6 py-3">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Tour
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Left */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="border-gray-100 shadow-sm bg-white">
                                <CardContent className="p-5">
                                    <Users className="w-5 h-5 text-burgundy mb-2" />
                                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Capacity</div>
                                    <div className="text-lg font-semibold text-charcoal">{capacityRange}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-100 shadow-sm bg-white">
                                <CardContent className="p-5">
                                    <DollarSign className="w-5 h-5 text-burgundy mb-2" />
                                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Starting Price</div>
                                    <div className="text-lg font-semibold text-charcoal">{startingPriceFormatted}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-100 shadow-sm bg-white">
                                <CardContent className="p-5">
                                    <MapPin className="w-5 h-5 text-burgundy mb-2" />
                                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Location</div>
                                    <div className="text-lg font-semibold text-charcoal">{venueWithDefaults.location || 'Kacyiru, Kigali'}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* About the Venue */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-4">About the Venue</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {venueWithDefaults.description || "Located in the heart of Kigali's diplomatic quarter, the Akagera Grand Ballroom offers a perfect blend of modern luxury and traditional Rwandan hospitality. Our venue features a stunning double-height ballroom with floor-to-ceiling windows that offer panoramic views of the thousand hills. Whether you're planning an intimate ceremony or a grand celebration, our dedicated event team ensures every detail is executed with precision."}
                            </p>
                        </div>

                        {/* Key Amenities */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Key Amenities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {DEFAULT_AMENITIES.map(({ label, icon: Icon }, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Icon className="w-5 h-5 text-burgundy flex-shrink-0" />
                                        <span className="text-sm font-medium text-charcoal">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability Calendar */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-bold text-charcoal">Availability Calendar</h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300" />
                                        Available
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                                        Booked
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <CalendarComponent
                                    mode="single"
                                    defaultMonth={nextMonth}
                                    className="rounded-lg border border-gray-200 p-3"
                                    modifiers={{ booked: bookedDates }}
                                    modifiersClassNames={{ booked: "bg-red-100 text-red-900 hover:bg-red-200" }}
                                    disabled={(date) => date < today || bookedDates.some(d => d.toDateString() === date.toDateString())}
                                />
                            </div>
                        </div>

                        {/* Venue Layouts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Venue Layouts</h2>
                            <Card className="border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-24 h-24 bg-sand/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="w-12 h-12 bg-burgundy/20 rounded-full flex items-center justify-center">
                                                <Info className="w-6 h-6 text-burgundy" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-charcoal mb-1">Ballroom Configuration A</h3>
                                            <p className="text-sm text-gray-600 mb-3">Standard wedding banquet setup for 350 guests including dance floor and stage.</p>
                                        </div>
                                        <Button variant="outline" className="flex items-center gap-2 shrink-0">
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Guest Reviews */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-charcoal">Guest Reviews</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-charcoal">4.8</span>
                                    <span className="text-gray-600">(124 reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Review 1 */}
                                <div className="flex gap-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="Marie Uwase" />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">MU</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div>
                                                <div className="font-semibold text-charcoal">Marie Uwase</div>
                                                <div className="text-sm text-gray-500">October 12, 2024</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium text-charcoal">5.0</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">Absolutely breathtaking! The staff at Akagera went above and beyond to make our dream wedding a reality. The views of the city at sunset are unbeatable.</p>
                                    </div>
                                </div>

                                {/* Review 2 */}
                                <div className="flex gap-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="Jean Claude" />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">JC</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div>
                                                <div className="font-semibold text-charcoal">Jean Claude</div>
                                                <div className="text-sm text-gray-500">August 28, 2024</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium text-charcoal">4.5</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">Stunning venue. The acoustics in the ballroom are perfect for live music. Only suggestion is to book early as they fill up fast!</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-6 pt-6 border-t border-gray-100">
                                <Button variant="link" className="text-burgundy hover:text-burgundy-light font-medium">
                                    View All Reviews
                                </Button>
                            </div>
                        </div>

                        {/* Similar Venues */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-6">Similar Venues You Might Like</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {venues
                                    .filter((v: any) => v.id !== venueId)
                                    .slice(0, 3)
                                    .map((similarVenue: any) => (
                                        <Link
                                            key={similarVenue.id}
                                            href={`/venues/${similarVenue.id}`}
                                            className="group block"
                                        >
                                            <Card className="border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={similarVenue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=400&h=300&fit=crop'}
                                                        alt={similarVenue.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md">
                                                        <span className="text-white font-semibold text-sm">
                                                            {similarVenue.price_range || '1.2M RWF'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                                                        {similarVenue.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>• {similarVenue.location || 'Kigali'}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Check Availability */}
                        <div className="lg:sticky lg:top-24 space-y-6">
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-charcoal mb-1">Check Availability</h3>
                                <p className="text-sm text-gray-600 mb-6">Select your dates and get a quick quote</p>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="wedding-date" className="text-sm font-medium text-charcoal">Preferred Wedding Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="wedding-date"
                                                    variant="outline"
                                                    className={cn("w-full justify-start text-left font-normal h-10 mt-1.5", !preferredDate && "text-muted-foreground")}
                                                >
                                                    <CalendarDays className="mr-2 h-4 w-4" />
                                                    {preferredDate ? format(preferredDate, 'PPP') : 'Select Date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={preferredDate}
                                                    onSelect={setPreferredDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <Label htmlFor="guest-count" className="text-sm font-medium text-charcoal">Estimated Guest Count</Label>
                                        <div className="relative mt-1.5">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="guest-count"
                                                type="text"
                                                placeholder="e.g. 250"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(e.target.value)}
                                                className="pl-9 h-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Venue Rental Fee</span>
                                        <span className="font-medium text-charcoal">{rentalFormatted}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Service Tax (5%)</span>
                                        <span className="font-medium text-charcoal">{serviceTaxFormatted}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="font-semibold text-charcoal">Estimated Total</span>
                                        <span className="text-lg font-bold text-burgundy">{totalFormatted}</span>
                                    </div>
                                </div>

                                <Button className="w-full mt-6 bg-burgundy hover:bg-burgundy-light text-white h-11">
                                    Request Formal Quote
                                </Button>
                                <p className="text-xs text-gray-500 text-center mt-3">Requesting a quote does not commit you to a booking.</p>
                            </CardContent>
                        </Card>

                        {/* Venue Manager */}
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="David Munyaneza" />
                                        <AvatarFallback className="bg-burgundy/10 text-burgundy font-medium">DM</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-charcoal">David Munyaneza</div>
                                        <div className="text-sm text-gray-600">Venue Manager</div>
                                    </div>
                                    <Button variant="outline" size="icon" className="rounded-full shrink-0" aria-label="Message venue manager">
                                        <MessageCircle className="h-5 w-5 text-burgundy" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Venue Policies */}
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-0">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="catering" className="border-b border-gray-100 px-4">
                                        <AccordionTrigger className="text-left text-sm font-medium text-charcoal hover:no-underline py-4">
                                            Outside catering allowed?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-gray-600 pb-4">
                                            Yes, outside caterers are welcome. A nominal fee may apply for use of kitchen facilities.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="music" className="px-4">
                                        <AccordionTrigger className="text-left text-sm font-medium text-charcoal hover:no-underline py-4">
                                            Music & Sound restrictions?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-gray-600 pb-4">
                                            Live music and DJs are allowed. Sound must be kept at reasonable levels after 10 PM per local regulations.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
