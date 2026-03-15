"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { MapPin, Users, Heart, ArrowLeft, Star, Calendar, DollarSign, Car, Wifi, UtensilsCrossed, Music, Shield, MessageCircle, CalendarDays, Clock, Info } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useSession } from 'next-auth/react';



const VENUE_RENTAL_RWF = 1500000;
const SERVICE_TAX_RATE = 0.05;

export default function VenueDetailPage() {
    const { data: session } = useSession();
    const [activeImage, setActiveImage] = useState(0);
    const [preferredDate, setPreferredDate] = useState<Date | undefined>();
    const [guestCount, setGuestCount] = useState<string>('');
    const [isRequestingQuote, setIsRequestingQuote] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showTourDialog, setShowTourDialog] = useState(false);
    const [tourDate, setTourDate] = useState<Date | undefined>();
    const [tourTime, setTourTime] = useState<string>('');
    const [tourName, setTourName] = useState<string>('');
    const [tourEmail, setTourEmail] = useState<string>('');
    const [tourPhone, setTourPhone] = useState<string>('');
    const [isSchedulingTour, setIsSchedulingTour] = useState(false);
    const params = useParams();
    const venueId = params.id as string;

    const [venue, setVenue] = useState<any>(null);
    const [similarVenues, setSimilarVenues] = useState<any[]>([]);
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [vendorId, setVendorId] = useState<string>('');

    // Quote modal state
    const [showQuoteDialog, setShowQuoteDialog] = useState(false);
    const [quoteName, setQuoteName] = useState('');
    const [quoteEmail, setQuoteEmail] = useState('');
    const [quotePhone, setQuotePhone] = useState('');
    const [quoteMessage, setQuoteMessage] = useState('');
    const [quoteContactMethod, setQuoteContactMethod] = useState('email');
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await fetch(`/api/venues/${venueId}`);
                const data = await res.json();
                setVenue(data.venue);
                setSimilarVenues(data.similarVenues || []);
                setBookedDates((data.bookedDates || []).map((d: string) => new Date(d + 'T00:00:00')));
                setBlockedDates((data.blockedDates || []).map((d: string) => new Date(d + 'T00:00:00')));
                setVendorId(data.vendorId || '');
            } catch (error) {
                console.error('Error fetching venue:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (venueId) fetchVenue();
    }, [venueId]);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!session?.user || !venueId) return;
            try {
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    setIsSaved(data.venues.some((v: any) => v.venueId === venueId));
                }
            } catch (error) {
                console.error('Error checking favorite:', error);
            }
        };
        checkFavorite();
    }, [session, venueId]);

    const handleSaveVenue = async () => {
        if (!session?.user) {
            toast.error('Please login to save favorites');
            return;
        }

        setIsSaving(true);
        try {
            const method = isSaved ? 'DELETE' : 'POST';
            const url = isSaved 
                ? `/api/favorites?venueId=${venueId}`
                : '/api/favorites';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' ? JSON.stringify({ venueId }) : undefined,
            });

            if (res.ok) {
                setIsSaved(!isSaved);
                toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update favorite');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    const handleScheduleTour = async () => {
        if (!tourDate || !tourTime || !tourName || !tourEmail || !tourPhone) {
            toast.error("Please fill in all tour details");
            return;
        }

        setIsSchedulingTour(true);
        try {
            const res = await fetch('/api/venue-tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venueId,
                    name: tourName,
                    email: tourEmail,
                    phone: tourPhone,
                    tourDate: tourDate.toISOString(),
                    tourTime,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Tour scheduled! The venue will contact you to confirm.");
                setShowTourDialog(false);
                setTourDate(undefined);
                setTourTime('');
                setTourName('');
                setTourEmail('');
                setTourPhone('');
            } else {
                toast.error(data.error || "Failed to schedule tour");
            }
        } catch (error) {
            console.error('Tour scheduling error:', error);
            toast.error("Failed to schedule tour");
        } finally {
            setIsSchedulingTour(false);
        }
    };

    const handleRequestQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!preferredDate || !guestCount || !quoteName || !quoteEmail || !quotePhone || !quoteContactMethod) {
            toast.error('Please fill in all required fields');
            return;
        }
        setIsSubmittingQuote(true);
        try {
            const res = await fetch(`/api/venues/${venueId}/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: quoteName,
                    clientEmail: quoteEmail,
                    clientPhone: quotePhone,
                    eventDate: preferredDate.toISOString(),
                    guestCount,
                    message: quoteMessage,
                    contactMethod: quoteContactMethod,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setQuoteSubmitted(true);
            } else {
                toast.error(data.error || 'Failed to send quote request');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmittingQuote(false);
        }
    };

    const resetQuoteDialog = () => {
        setShowQuoteDialog(false);
        setQuoteSubmitted(false);
        setQuoteName('');
        setQuoteEmail('');
        setQuotePhone('');
        setQuoteMessage('');
        setQuoteContactMethod('email');
        setPreferredDate(undefined);
        setGuestCount('');
    };

    const venueWithDefaults = venue ? {
        ...venue,
        name: venue.name || venue.businessName,
        venue_type: venue.venueType || venue.category || 'Venue',
        capacity: venue.minCapacity || 200,
        max_capacity: venue.maxCapacity || 500,
        contact_email: venue.email || 'info@venue.rw',
        contact_phone: venue.phone || '+250 788 123 456',
        availability: 'Available for bookings',
        features: [],
        starting_price_rwf: venue.price || VENUE_RENTAL_RWF,
        images: venue.image ? [venue.image] : [],
        portfolio: Array.isArray(venue.portfolio) ? venue.portfolio : [],
        amenities: venue.amenities ? venue.amenities.split(',').map((a: string) => a.trim()) : [],
    } : null;

    const capacityRange = venueWithDefaults ? `${venueWithDefaults.capacity || 200} - ${venueWithDefaults.max_capacity || 500} Guests` : '';
    const startingPriceFormatted = venueWithDefaults?.priceRange || '1,500,000 RWF';
    const venueRentalRwf = venueWithDefaults?.starting_price_rwf ?? VENUE_RENTAL_RWF;
    const serviceTaxRwf = Math.round(venueRentalRwf * SERVICE_TAX_RATE);
    const estimatedTotalRwf = venueRentalRwf + serviceTaxRwf;
    const serviceTaxFormatted = serviceTaxRwf.toLocaleString('en-US') + ' RWF';
    const totalFormatted = estimatedTotalRwf.toLocaleString('en-US') + ' RWF';
    const rentalFormatted = venueRentalRwf.toLocaleString('en-US') + ' RWF';

    // Sample booked dates for availability calendar
    const today = new Date();

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
                                        {venue.maxCapacity && (
                                            <span className="flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                Up to {venue.maxCapacity} guests
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Hero Actions */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        onClick={handleSaveVenue}
                                        disabled={isSaving}
                                        className="bg-burgundy hover:bg-burgundy-light text-white px-6 py-3 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                                        )}
                                        {isSaved ? 'Saved' : 'Save Venue'}
                                    </Button>
                                    <Button 
                                        onClick={() => setShowTourDialog(true)}
                                        variant="outline" 
                                        className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-charcoal px-6 py-3"
                                    >
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

                        {/* Capacity & Facilities */}
                        {(venue.maxCapacity || venue.minCapacity || venue.indoorOutdoor || venue.spaceSize || venue.parkingCapacity || venue.accessibility) && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-xl font-bold text-charcoal">Capacity &amp; Facilities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {venue.maxCapacity && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Users className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Max Capacity</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.maxCapacity} guests</div>
                                        </div>
                                    </div>
                                )}
                                {venue.minCapacity && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Users className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Min Capacity</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.minCapacity} guests</div>
                                        </div>
                                    </div>
                                )}
                                {venue.indoorOutdoor && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <MapPin className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Indoor / Outdoor</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.indoorOutdoor}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.spaceSize && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Info className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Space</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.spaceSize}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.parkingCapacity && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Car className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Parking</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.parkingCapacity}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.accessibility && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Wifi className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Accessibility</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.accessibility}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Services & Amenities */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                            <h2 className="text-xl font-bold text-charcoal">Services &amp; Amenities</h2>

                            {/* Structured fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {venue.cateringOptions && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <UtensilsCrossed className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Catering</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.cateringOptions}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.barService && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Shield className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bar / Alcohol</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.barService}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.avEquipment && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Music className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Audio / Visual</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.avEquipment}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.lightingOptions && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Star className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lighting</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.lightingOptions}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.furnitureIncluded && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Info className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tables &amp; Chairs</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.furnitureIncluded}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.bridalSuite && venue.bridalSuite !== 'no' && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Heart className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bridal Suite</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.bridalSuite}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.accommodation && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <MapPin className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Accommodation</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.accommodation}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional amenities (comma-separated free text) */}
                            {venue.amenities && venue.amenities.trim() && (
                                <div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Additional Amenities</div>
                                    <div className="flex flex-wrap gap-2">
                                        {venue.amenities.split(',').map((a: string) => a.trim()).filter(Boolean).map((a: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-burgundy/10 text-burgundy text-sm rounded-full font-medium">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pricing & Policies */}
                        {(venue.pricingStructure || venue.rentalDuration || venue.setupTime || venue.depositRequired || venue.paymentSchedule || venue.cancellationPolicy || venue.restrictions || venue.insuranceRequired) && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-xl font-bold text-charcoal">Pricing &amp; Policies</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {venue.pricingStructure && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <DollarSign className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pricing Structure</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.pricingStructure}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.rentalDuration && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Clock className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Rental Duration</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.rentalDuration}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.setupTime && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Clock className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Setup / Cleanup Time</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.setupTime}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.depositRequired && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <DollarSign className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Deposit Required</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.depositRequired}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.paymentSchedule && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <DollarSign className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Payment Schedule</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.paymentSchedule}</div>
                                        </div>
                                    </div>
                                )}
                                {venue.insuranceRequired && venue.insuranceRequired !== 'no' && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                        <Shield className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Insurance</div>
                                            <div className="text-sm font-medium text-charcoal">{venue.insuranceRequired}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {venue.cancellationPolicy && (
                                <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Cancellation Policy</div>
                                    <p className="text-sm text-charcoal leading-relaxed">{venue.cancellationPolicy}</p>
                                </div>
                            )}
                            {venue.restrictions && (
                                <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Venue Rules &amp; Restrictions</div>
                                    <p className="text-sm text-charcoal leading-relaxed">{venue.restrictions}</p>
                                </div>
                            )}
                        </div>
                        )}

                        {/* Availability Calendar */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-bold text-charcoal">Availability Calendar</h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-sm bg-white border border-gray-300 inline-block" />
                                        Available
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-sm bg-green-200 inline-block" />
                                        Booked
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-sm bg-red-200 inline-block" />
                                        Unavailable
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <CalendarComponent
                                    mode="single"
                                    defaultMonth={new Date(today.getFullYear(), today.getMonth() + 1, 1)}
                                    className="rounded-lg border border-gray-200 p-3"
                                    modifiers={{ booked: bookedDates, blocked: blockedDates }}
                                    disabled={(date) =>
                                        date < today ||
                                        bookedDates.some(d => d.toDateString() === date.toDateString()) ||
                                        blockedDates.some(d => d.toDateString() === date.toDateString())
                                    }
                                    components={{
                                        DayButton: ({ day, modifiers, className, ...props }) => (
                                            <button
                                                {...props}
                                                disabled={modifiers.disabled}
                                                className={cn(
                                                    "flex aspect-square w-full min-w-8 items-center justify-center rounded-md text-sm transition-colors",
                                                    modifiers.booked && "!bg-green-200 !text-green-900 cursor-not-allowed",
                                                    modifiers.blocked && "!bg-red-200 !text-red-900 cursor-not-allowed",
                                                    !modifiers.booked && !modifiers.blocked && modifiers.disabled && "text-gray-300 cursor-not-allowed",
                                                    !modifiers.booked && !modifiers.blocked && !modifiers.disabled && "hover:bg-burgundy/10 hover:text-burgundy cursor-pointer",
                                                    modifiers.today && !modifiers.booked && !modifiers.blocked && "font-bold underline",
                                                )}
                                            >
                                                {day.date.getDate()}
                                            </button>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        {/* Venue Portfolio */}
                        {venueWithDefaults.portfolio.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Venue Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {venueWithDefaults.portfolio.map((item: any, idx: number) => (
                                    <div
                                        key={item.id || idx}
                                        className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer group"
                                        onClick={() => setActiveImage(idx)}
                                    >
                                        {item.type === 'video' ? (
                                            <>
                                                <video src={item.url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-burgundy ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <img src={item.url} alt={item.title || 'Venue photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        )}
                                        {item.title && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-medium truncate">{item.title}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        )}

                        {/* Guest Reviews - Hidden until real reviews exist */}
                        {venue.reviewCount > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-charcoal">Guest Reviews</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-charcoal">{venue.rating || 0}</span>
                                    <span className="text-gray-600">({venue.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <div className="text-center py-8 text-gray-500">
                                <p>Reviews will appear here once customers leave feedback</p>
                            </div>
                        </div>
                        )}

                        {/* Similar Venues */}
                        {similarVenues.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-charcoal mb-6">Similar Venues You Might Like</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {similarVenues.map((similarVenue: any) => {
                                    const images = similarVenue.images ? JSON.parse(similarVenue.images) : [];
                                    return (
                                        <Link
                                            key={similarVenue.id}
                                            href={`/venues/${similarVenue.id}`}
                                            className="group block"
                                        >
                                            <Card className="border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={images[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=400&h=300&fit=crop'}
                                                        alt={similarVenue.businessName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md">
                                                        <span className="text-white font-semibold text-sm">
                                                            {similarVenue.priceRange || '1.2M RWF'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                                                        {similarVenue.businessName}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{similarVenue.location || 'Kigali'}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Sidebar - Right */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Check Availability */}
                        <div className="lg:sticky lg:top-24 space-y-6">
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-charcoal mb-1">Check Availability</h3>
                                <p className="text-sm text-gray-500 mb-5">Select your date and request a quote</p>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Wedding Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn("w-full justify-start text-left font-normal h-10 mt-1.5 border-gray-200", !preferredDate && "text-gray-400")}
                                                >
                                                    <CalendarDays className="mr-2 h-4 w-4 text-burgundy" />
                                                    {preferredDate ? format(preferredDate, 'PPP') : 'Select your date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-gray-200 rounded-xl" align="start" sideOffset={8}>
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={preferredDate}
                                                    onSelect={setPreferredDate}
                                                    disabled={(date) => date < today}
                                                    initialFocus
                                                    className="rounded-xl p-3"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Guest Count *</Label>
                                        <div className="relative mt-1.5">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="number"
                                                placeholder="e.g. 250"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(e.target.value)}
                                                className="pl-9 h-10"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Venue Rental Fee</span>
                                        <span className="font-medium text-charcoal">{rentalFormatted}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Service Tax (5%)</span>
                                        <span className="font-medium text-charcoal">{serviceTaxFormatted}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                                        <span className="font-semibold text-charcoal text-sm">Estimated Total</span>
                                        <span className="text-xl font-bold text-burgundy">{totalFormatted}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        if (!preferredDate || !guestCount) {
                                            toast.error('Please select a date and enter guest count first');
                                            return;
                                        }
                                        setShowQuoteDialog(true);
                                    }}
                                    disabled={!preferredDate || !guestCount}
                                    className="w-full mt-5 bg-burgundy hover:bg-burgundy/90 text-white h-11 font-semibold disabled:opacity-40"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Request a Quote
                                </Button>
                                <p className="text-xs text-gray-400 text-center mt-2">No commitment — the vendor will contact you.</p>
                            </CardContent>
                        </Card>

                        {/* Venue Manager */}
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        {venue.vendorImage && <AvatarImage src={venue.vendorImage} alt={venue.vendorName} />}
                                        <AvatarFallback className="bg-burgundy/10 text-burgundy font-medium">
                                            {venue.vendorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-charcoal">{venue.vendorName}</div>
                                        <div className="text-sm text-gray-600">Venue Manager</div>
                                    </div>
                                    <Button variant="outline" size="icon" className="rounded-full shrink-0" aria-label="Message venue manager">
                                        <MessageCircle className="h-5 w-5 text-burgundy" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>


                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Request Dialog */}
            <Dialog open={showQuoteDialog} onOpenChange={(open) => { if (!open) resetQuoteDialog(); }}>
                <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                    {quoteSubmitted ? (
                        // ── Success state ──
                        <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-charcoal mb-2">Quote Request Sent!</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                    Your request has been saved and the venue has been notified by email.
                                    They will contact you at <strong>{quoteEmail}</strong> shortly.
                                </p>
                            </div>
                            <div className="w-full bg-gray-50 rounded-xl p-4 text-left space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium text-charcoal">{preferredDate ? format(preferredDate, 'PPP') : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Guests</span>
                                    <span className="font-medium text-charcoal">{guestCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Venue</span>
                                    <span className="font-medium text-charcoal">{venueWithDefaults?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Contact via</span>
                                    <span className="font-medium text-charcoal capitalize">{quoteContactMethod}</span>
                                </div>
                            </div>
                            <Button onClick={resetQuoteDialog} className="w-full bg-burgundy hover:bg-burgundy/90 text-white h-10">
                                Done
                            </Button>
                        </div>
                    ) : (
                        // ── Form state ──
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-charcoal text-lg">Request a Quote</DialogTitle>
                                <DialogDescription className="text-gray-500">
                                    Fill in your details and we&apos;ll notify <strong>{venueWithDefaults?.name}</strong> immediately.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Selected date + guests summary */}
                            <div className="flex gap-3 my-1">
                                <div className="flex-1 bg-burgundy/5 rounded-xl p-3 text-center">
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Event Date</p>
                                    <p className="text-sm font-bold text-burgundy">{preferredDate ? format(preferredDate, 'MMM d, yyyy') : '—'}</p>
                                </div>
                                <div className="flex-1 bg-burgundy/5 rounded-xl p-3 text-center">
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Guests</p>
                                    <p className="text-sm font-bold text-burgundy">{guestCount || '—'}</p>
                                </div>
                                <div className="flex-1 bg-burgundy/5 rounded-xl p-3 text-center">
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Est. Total</p>
                                    <p className="text-sm font-bold text-burgundy">{totalFormatted}</p>
                                </div>
                            </div>

                            <form onSubmit={handleRequestQuote} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name *</Label>
                                        <Input
                                            value={quoteName}
                                            onChange={e => setQuoteName(e.target.value)}
                                            placeholder="Your full name"
                                            required className="mt-1.5 h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email *</Label>
                                        <Input
                                            type="email"
                                            value={quoteEmail}
                                            onChange={e => setQuoteEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required className="mt-1.5 h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone *</Label>
                                        <Input
                                            type="tel"
                                            value={quotePhone}
                                            onChange={e => setQuotePhone(e.target.value)}
                                            placeholder="+250 788 000 000"
                                            required className="mt-1.5 h-10"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Contact Method *</Label>
                                        <select
                                            value={quoteContactMethod}
                                            onChange={e => setQuoteContactMethod(e.target.value)}
                                            required
                                            className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="email">Email</option>
                                            <option value="phone">Phone Call</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message <span className="text-gray-300 normal-case font-normal">(optional)</span></Label>
                                        <textarea
                                            value={quoteMessage}
                                            onChange={e => setQuoteMessage(e.target.value)}
                                            placeholder="Tell the venue about your event, special requirements, or any questions..."
                                            rows={3}
                                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                        />
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-400 flex items-start gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Submitting this request does not commit you to a booking. The vendor will reach out to confirm details.
                                </p>

                                <DialogFooter className="gap-2">
                                    <Button type="button" variant="outline" onClick={resetQuoteDialog} disabled={isSubmittingQuote}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmittingQuote || !quoteName || !quoteEmail || !quotePhone || !quoteContactMethod}
                                        className="bg-burgundy hover:bg-burgundy/90 text-white gap-2 disabled:opacity-50"
                                    >
                                        {isSubmittingQuote ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                                        ) : (
                                            <><MessageCircle className="w-4 h-4" /> Send Quote Request</>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Schedule Tour Dialog */}
            <Dialog open={showTourDialog} onOpenChange={setShowTourDialog}>
                <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-charcoal">Schedule a Venue Tour</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Fill in your details and we'll arrange a tour of {venueWithDefaults?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="tour-name" className="text-sm font-medium text-charcoal">Full Name *</Label>
                            <Input
                                id="tour-name"
                                value={tourName}
                                onChange={(e) => setTourName(e.target.value)}
                                placeholder="Your name"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tour-email" className="text-sm font-medium text-charcoal">Email *</Label>
                            <Input
                                id="tour-email"
                                type="email"
                                value={tourEmail}
                                onChange={(e) => setTourEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tour-phone" className="text-sm font-medium text-charcoal">Phone Number *</Label>
                            <Input
                                id="tour-phone"
                                type="tel"
                                value={tourPhone}
                                onChange={(e) => setTourPhone(e.target.value)}
                                placeholder="+250 788 123 456"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tour-date" className="text-sm font-medium text-charcoal">Preferred Tour Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="tour-date"
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal h-10 mt-1.5 border-gray-300", !tourDate && "text-muted-foreground")}
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {tourDate ? format(tourDate, 'PPP') : 'Select Date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white shadow-xl border-2 border-gray-200 rounded-xl" align="start" sideOffset={8}>
                                    <CalendarComponent
                                        mode="single"
                                        selected={tourDate}
                                        onSelect={setTourDate}
                                        disabled={(date) => date < today}
                                        initialFocus
                                        className="rounded-xl p-4"
                                        classNames={{
                                            day_button: "hover:bg-burgundy/10 data-[selected-single=true]:bg-burgundy data-[selected-single=true]:text-white",
                                            today: "bg-sand text-charcoal font-semibold",
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label htmlFor="tour-time" className="text-sm font-medium text-charcoal">Preferred Time *</Label>
                            <div className="relative mt-1.5">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="tour-time"
                                    type="time"
                                    value={tourTime}
                                    onChange={(e) => setTourTime(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowTourDialog(false)}
                            disabled={isSchedulingTour}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleScheduleTour}
                            disabled={isSchedulingTour || !tourDate || !tourTime || !tourName || !tourEmail || !tourPhone}
                            className="bg-burgundy hover:bg-burgundy-light text-white disabled:opacity-50"
                        >
                            {isSchedulingTour ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule Tour'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
