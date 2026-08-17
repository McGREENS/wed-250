"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    MapPin, Star, ArrowLeft, Heart, BadgeCheck, Share2,
    CheckCircle, Clock, Package, Camera, Video, Utensils,
    Music, Car, Palette, Sparkles, Shirt, ChevronDown, ChevronUp,
    Users, Globe, Award, Briefcase, ImageIcon, Layers, Truck,
    Mic2, Flower2, Scissors, CalendarClock, Ban, Wand2,
    UtensilsCrossed, PersonStanding, Gauge, Lightbulb, Ruler,
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const TYPE_COLORS: Record<string, string> = {
    Photography: "bg-blue-100 text-blue-700",
    Videography: "bg-purple-100 text-purple-700",
    Catering:    "bg-orange-100 text-orange-700",
    Decoration:  "bg-pink-100 text-pink-700",
    Music:       "bg-indigo-100 text-indigo-700",
    Planning:    "bg-yellow-100 text-yellow-700",
    Makeup:      "bg-rose-100 text-rose-700",
    Attire:      "bg-teal-100 text-teal-700",
    Transport:   "bg-slate-100 text-slate-700",
    Venue:       "bg-green-100 text-green-700",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
    Photography: Camera, Videography: Video, Catering: Utensils,
    Music, Transport: Car, Planning: Package, Makeup: Sparkles,
    Decoration: Palette, Attire: Shirt,
};

const FALLBACK_IMAGES: Record<string, string> = {
    Photography: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400&h=800&fit=crop",
    Videography: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&h=800&fit=crop",
    Catering:    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&h=800&fit=crop",
    Decoration:  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1400&h=800&fit=crop",
    Music:       "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=800&fit=crop",
    Planning:    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&h=800&fit=crop",
    Makeup:      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&h=800&fit=crop",
    Attire:      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=800&fit=crop",
    Transport:   "https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=1400&h=800&fit=crop",
};

export default function ServiceDetailPage() {
    const params = useParams();
    const vendorId = params.id as string;
    const serviceId = params.serviceId as string;
    const { data: session } = useSession();

    const [service, setService] = useState<any>(null);
    const [vendor, setVendor] = useState<any>(null);
    const [otherServices, setOtherServices] = useState<any[]>([]);
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingDone, setBookingDone] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingForm, setBookingForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', eventDate: '', notes: '' });
    const [bookingError, setBookingError] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingError('');
        setBookingLoading(true);
        try {
            const res = await fetch('/api/bookings/service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId,
                    serviceId,
                    userId: session?.user?.id || null,
                    ...bookingForm,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setBookingError(data.error || 'Failed to submit booking'); return; }
            setBookingDone(true);
            toast.success('Booking request sent!');
            // Clear the form after successful submission
            setBookingForm({ 
                clientName: session?.user?.name || '', 
                clientEmail: session?.user?.email || '', 
                clientPhone: '', 
                eventDate: '', 
                notes: '' 
            });
        } catch {
            setBookingError('Something went wrong. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        if (!session?.user) {
            toast.error('Please login to send messages');
            return;
        }

        setSendingMessage(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId,
                    content: messageText.trim(),
                }),
            });

            if (res.ok) {
                toast.success('Message sent successfully!');
                setMessageText('');
                setShowMessageModal(false);
            } else {
                toast.error('Failed to send message');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        fetch(`/api/vendors/services/${serviceId}`)
            .then((r) => r.json())
            .then((d) => {
                setService(d.service);
                setVendor(d.vendor);
                setOtherServices(d.otherServices || []);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [serviceId]);

    // Fetch vendor's booked dates
    useEffect(() => {
        if (!vendorId) return;
        fetch(`/api/vendors/booked-dates?vendorId=${vendorId}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.bookedDates) {
                    setBookedDates(d.bookedDates);
                }
            })
            .catch(console.error);
    }, [vendorId]);

    useEffect(() => {
        if (!session?.user) return;
        fetch('/api/favorites')
            .then((r) => r.json())
            .then((d) => {
                const ids = d.vendors?.map((v: any) => v.vendorId) || [];
                setIsFavorite(ids.includes(vendorId));
            })
            .catch(console.error);
    }, [session, vendorId]);

    // Pre-fill booking form with session user data
    useEffect(() => {
        if (session?.user) {
            setBookingForm((prev) => ({
                ...prev,
                clientName: prev.clientName || session.user.name || '',
                clientEmail: prev.clientEmail || session.user.email || '',
            }));
        }
    }, [session]);

    const handleFavorite = async () => {
        if (!session?.user) { toast.error('Please login to save favorites'); return; }
        setFavLoading(true);
        try {
            const method = isFavorite ? 'DELETE' : 'POST';
            const url = isFavorite ? `/api/favorites?vendorId=${vendorId}` : '/api/favorites';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' ? JSON.stringify({ vendorId }) : undefined,
            });
            if (res.ok) {
                setIsFavorite(!isFavorite);
                toast.success(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setFavLoading(false); }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy" />
            </div>
        );
    }

    if (!service || !vendor) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-charcoal mb-4">Service not found</h2>
                    <Link href="/vendors"><Button className="bg-burgundy text-white">Back to Vendors</Button></Link>
                </div>
            </div>
        );
    }

    const meta = (() => { try { return service.metadata ? JSON.parse(service.metadata) : {}; } catch { return {}; } })();
    const features = (() => { try { return service.features ? JSON.parse(service.features) : {}; } catch { return {}; } })();
    const items: string[] = features.items || [];
    const colorCls = TYPE_COLORS[service.serviceType] || 'bg-gray-100 text-gray-600';
    const Icon = TYPE_ICONS[service.serviceType] || Package;
    const heroImage = service.image;

    // Portfolio images scoped to this service
    const galleryImages: string[] = [
        ...(service.image ? [service.image] : []),
        ...(Array.isArray(meta.gallery) ? meta.gallery : []),
    ];

    // Key highlights from metadata — each with a dedicated icon
    const highlights: { label: string; value: string; icon: React.ElementType }[] = [
        (meta.duration || features.duration) && { label: 'Duration',       value: meta.duration || features.duration, icon: Clock },
        meta.photoCount        && { label: 'Photos Delivered', value: meta.photoCount,        icon: ImageIcon },
        meta.shootingStyle     && { label: 'Shooting Style',   value: meta.shootingStyle,     icon: Camera },
        meta.deliveryFormat    && { label: 'Delivery Format',  value: meta.deliveryFormat,    icon: Layers },
        meta.cancellationPolicy && { label: 'Cancellation',    value: meta.cancellationPolicy, icon: Ban },
        meta.cuisineType       && { label: 'Cuisine Type',     value: meta.cuisineType,       icon: UtensilsCrossed },
        meta.serviceStyle      && { label: 'Service Style',    value: meta.serviceStyle,      icon: Wand2 },
        meta.minGuests         && { label: 'Min Guests',       value: meta.minGuests,         icon: Users },
        meta.maxGuests         && { label: 'Max Guests',       value: meta.maxGuests,         icon: Users },
        meta.staffProvided     && { label: 'Staff Provided',   value: meta.staffProvided,     icon: PersonStanding },
        meta.musicGenres       && { label: 'Music Genres',     value: meta.musicGenres,       icon: Mic2 },
        meta.soundSystem       && { label: 'Sound System',     value: meta.soundSystem,       icon: Gauge },
        meta.lightingEffects   && { label: 'Lighting Effects', value: meta.lightingEffects,   icon: Lightbulb },
        meta.vehicleTypes      && { label: 'Vehicle Types',    value: meta.vehicleTypes,      icon: Truck },
        meta.vehicleCount      && { label: 'Vehicle Count',    value: meta.vehicleCount,      icon: Car },
        meta.passengerCapacity && { label: 'Capacity',         value: meta.passengerCapacity, icon: Users },
        meta.serviceHours      && { label: 'Service Hours',    value: meta.serviceHours,      icon: Clock },
        meta.makeupStyle       && { label: 'Makeup Style',     value: meta.makeupStyle,       icon: Sparkles },
        meta.peopleCovered     && { label: 'People Covered',   value: meta.peopleCovered,     icon: Users },
        meta.airbrush          && { label: 'Airbrush',         value: meta.airbrush,          icon: Wand2 },
        meta.productBrands     && { label: 'Product Brands',   value: meta.productBrands,     icon: Award },
        meta.trialIncluded     && { label: 'Trial Session',    value: meta.trialIncluded,     icon: CalendarClock },
        meta.decorStyle        && { label: 'Decor Style',      value: meta.decorStyle,        icon: Palette },
        meta.flowerTypes       && { label: 'Flower Types',     value: meta.flowerTypes,       icon: Flower2 },
        meta.setupTeardown     && { label: 'Setup & Teardown', value: meta.setupTeardown,     icon: Layers },
        meta.styleOptions      && { label: 'Style Options',    value: meta.styleOptions,      icon: Scissors },
        meta.designType        && { label: 'Design Type',      value: meta.designType,        icon: Ruler },
        meta.fittingsIncluded  && { label: 'Fittings',         value: meta.fittingsIncluded,  icon: Scissors },
        meta.leadTime          && { label: 'Lead Time',        value: meta.leadTime,          icon: CalendarClock },
        meta.planningType      && { label: 'Planning Type',    value: meta.planningType,      icon: Briefcase },
        meta.meetingsIncluded  && { label: 'Meetings',         value: meta.meetingsIncluded,  icon: Users },
    ].filter(Boolean) as { label: string; value: string; icon: React.ElementType }[];

    const vendorPortfolio = vendor.portfolio ? (() => { try { return JSON.parse(vendor.portfolio); } catch { return []; } })() : [];

    return (
        <div className="min-h-screen bg-cream">

            {/* ── HERO ── */}
            <div className="relative h-[420px] md:h-[520px]">
                {heroImage ? (
                    <>
                        <img src={heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">No Image Available</span>
                    </div>
                )}

                {/* top bar */}
                <div className="absolute top-0 left-0 right-0 px-6 md:px-12 pt-6 flex items-center justify-between">
                    <Link href={`/vendors/${vendorId}`} className={`inline-flex items-center gap-2 hover:text-burgundy backdrop-blur px-4 py-2 rounded-full text-sm font-medium transition-colors ${heroImage ? 'text-white/90 hover:text-white bg-black/20' : 'text-charcoal bg-white/80'}`}>
                        <ArrowLeft className="w-4 h-4" /> {vendor.businessName}
                    </Link>
                    <div className="flex items-center gap-2">
                        <button onClick={handleShare} className={`w-9 h-9 backdrop-blur rounded-full flex items-center justify-center transition-colors ${heroImage ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-white/80 text-charcoal hover:bg-white'}`}>
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button onClick={handleFavorite} disabled={favLoading}
                            className={`w-9 h-9 backdrop-blur rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-burgundy text-white' : heroImage ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-white/80 text-charcoal hover:bg-white'}`}>
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* bottom info */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorCls}`}>
                                {service.serviceType}
                            </span>
                            {vendor.verified && (
                                <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                            )}
                        </div>
                        <h1 className={`text-3xl md:text-5xl font-bold mb-3 drop-shadow ${heroImage ? 'text-white' : 'text-charcoal'}`}>{service.name}</h1>
                        <div className={`flex flex-wrap items-center gap-5 text-sm ${heroImage ? 'text-white/90' : 'text-gray-700'}`}>
                            <Link href={`/vendors/${vendorId}`} className={`flex items-center gap-1.5 transition-colors ${heroImage ? 'hover:text-white' : 'hover:text-burgundy'}`}>
                                <Icon className="w-4 h-4 shrink-0" /> {vendor.businessName}
                            </Link>
                            {vendor.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 shrink-0" /> {vendor.location}
                                </span>
                            )}
                            {vendor.rating > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                                    <span className="font-semibold">{vendor.rating}</span>
                                    {vendor.reviewCount > 0 && <span className={heroImage ? 'text-white/70' : 'text-gray-500'}>({vendor.reviewCount} reviews)</span>}
                                </span>
                            )}
                            <span className={`text-xl font-bold ${heroImage ? 'text-white' : 'text-burgundy'}`}>
                                {Number(service.price).toLocaleString()} RWF
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── LEFT: main content ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description + Highlights combined */}
                        {(service.description || highlights.length > 0) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                                {/* About header strip */}
                                {service.description && (
                                    <div className="px-6 pt-6 pb-5">
                                        <h2 className="text-xl font-bold text-charcoal mb-3">About This Package</h2>
                                        <p className="text-gray-500 leading-relaxed text-sm">{service.description}</p>
                                    </div>
                                )}

                                {/* Package Details */}
                                {highlights.length > 0 && (
                                    <div className={service.description ? 'border-t border-gray-100' : ''}>
                                        <div className="px-6 pt-5 pb-2">
                                            <h2 className="text-base font-bold text-charcoal">Package Details</h2>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {highlights.map((h, i) => {
                                                const HIcon = h.icon;
                                                return (
                                                    <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                                                        <div className="w-8 h-8 rounded-lg bg-burgundy/8 flex items-center justify-center shrink-0">
                                                            <HIcon className="w-4 h-4 text-burgundy" />
                                                        </div>
                                                        <span className="text-sm text-gray-400 w-36 shrink-0">{h.label}</span>
                                                        <span className="text-sm font-semibold text-charcoal capitalize">{h.value}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="h-4" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* What's Included */}
                        {items.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-charcoal mb-4">What's Included</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(showAllFeatures ? items : items.slice(0, 8)).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                {items.length > 8 && (
                                    <button
                                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                                        className="mt-4 flex items-center gap-1 text-sm text-burgundy font-medium hover:underline"
                                    >
                                        {showAllFeatures ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show all {items.length} items</>}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Portfolio Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-charcoal mb-4">Portfolio</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {galleryImages.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setLightbox(url)}
                                            className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none"
                                        >
                                            <img src={url} alt={service.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Services by this Vendor */}
                        {otherServices.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-bold text-charcoal">More from {vendor.businessName}</h2>
                                    <Link href={`/vendors/${vendorId}`} className="text-sm text-burgundy font-medium hover:underline">
                                        View all →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {otherServices.map((svc) => {
                                        const svcMeta = (() => { try { return svc.metadata ? JSON.parse(svc.metadata) : {}; } catch { return {}; } })();
                                        const svcFeatures = (() => { try { return svc.features ? JSON.parse(svc.features) : {}; } catch { return {}; } })();
                                        const SvcIcon = TYPE_ICONS[svc.serviceType] || Package;
                                        const svcColor = TYPE_COLORS[svc.serviceType] || 'bg-gray-100 text-gray-600';
                                        return (
                                            <Link
                                                key={svc.id}
                                                href={`/vendors/${vendorId}/services/${svc.id}`}
                                                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-burgundy/30 hover:bg-gray-50 transition-all group"
                                            >
                                                {svc.image ? (
                                                    <img src={svc.image} alt={svc.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                                                ) : (
                                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${svcColor}`}>
                                                        <SvcIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${svcColor}`}>{svc.serviceType}</span>
                                                    <p className="text-sm font-semibold text-charcoal group-hover:text-burgundy transition-colors mt-0.5 line-clamp-1">{svc.name}</p>
                                                    {(svcFeatures.duration || svcMeta.duration) && (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <Clock className="w-3 h-3" /> {svcFeatures.duration || svcMeta.duration}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-burgundy shrink-0">{Number(svc.price).toLocaleString()} RWF</p>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: sticky booking sidebar ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">

                            {/* Price header */}
                            <div className="bg-gradient-to-br from-burgundy to-burgundy/80 px-6 py-5">
                                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">Starting from</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-white">{Number(service.price).toLocaleString()}</span>
                                    <span className="text-sm font-medium text-white/70">RWF</span>
                                </div>
                                {(features.duration || meta.duration) && (
                                    <div className="flex items-center gap-1.5 mt-2 text-white/70 text-sm">
                                        <Clock className="w-3.5 h-3.5" />
                                        {features.duration || meta.duration}
                                    </div>
                                )}
                            </div>

                            {/* Quick highlights strip */}
                            {highlights.slice(0, 3).length > 0 && (
                                <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                                    {highlights.slice(0, 3).map((h, i) => {
                                        const HIcon = h.icon;
                                        return (
                                            <div key={i} className="flex flex-col items-center justify-center py-3 px-2 text-center gap-1">
                                                <HIcon className="w-4 h-4 text-burgundy" />
                                                <span className="text-[10px] text-gray-400 leading-tight">{h.label}</span>
                                                <span className="text-xs font-semibold text-charcoal capitalize leading-tight line-clamp-1">{h.value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="px-6 py-5 space-y-3">
                                <Button
                                    onClick={() => { setShowBooking(true); setBookingDone(false); setBookingError(''); }}
                                    className="w-full bg-burgundy hover:bg-burgundy/90 text-white rounded-xl h-11 text-sm font-semibold shadow-sm"
                                >
                                    Book This Package
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (!session?.user) {
                                            toast.error('Please login to chat');
                                            return;
                                        }
                                        const messagesUrl = session.user.role === 'VENDOR' 
                                            ? `/vendor/messages?vendorId=${vendorId}`
                                            : `/dashboard/messages?vendorId=${vendorId}`;
                                        window.location.href = messagesUrl;
                                    }}
                                    variant="outline"
                                    className="w-full rounded-xl h-11 border-burgundy text-burgundy hover:bg-burgundy hover:text-white text-sm"
                                >
                                    Chat with Vendor
                                </Button>
                                <Link href={`/vendors/${vendorId}`}>
                                    <Button variant="outline" className="w-full rounded-xl h-11 border-gray-200 text-charcoal hover:border-burgundy hover:text-burgundy text-sm">
                                        View Vendor Profile
                                    </Button>
                                </Link>
                            </div>

                            {/* Vendor card */}
                            <div className="border-t border-gray-100 px-6 py-5">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Offered by</p>
                                <Link href={`/vendors/${vendorId}`} className="flex items-center gap-3 group">
                                    {vendor.profileImage ? (
                                        <img
                                            src={vendor.profileImage}
                                            alt={vendor.businessName}
                                            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-gray-100"
                                        />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-charcoal group-hover:text-burgundy transition-colors flex items-center gap-1 flex-wrap">
                                            {vendor.businessName}
                                            {vendor.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                        </p>
                                        {vendor.location && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 capitalize">
                                                <MapPin className="w-3 h-3 shrink-0" /> {vendor.location}
                                            </p>
                                        )}
                                    </div>
                                </Link>

                                {vendor.rating > 0 && (
                                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold text-charcoal">{vendor.rating}</span>
                                        {vendor.reviewCount > 0 && (
                                            <span className="text-xs text-gray-400">({vendor.reviewCount} reviews)</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                                <div className="space-y-2">
                                    {[{ icon: CheckCircle, text: 'Secure booking process' },
                                      { icon: BadgeCheck,  text: 'Verified vendor' },
                                      { icon: Clock,       text: 'Instant confirmation' },
                                    ].map(({ icon: TIcon, text }) => (
                                        <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                                            <TIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                    <img src={lightbox} alt="Portfolio" className="max-w-full max-h-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
                    <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-colors">✕</button>
                </div>
            )}

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                        {/* Modal header */}
                        <div className="bg-gradient-to-br from-burgundy to-burgundy/80 px-6 py-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Book This Package</p>
                                    <h2 className="text-white font-bold text-lg leading-tight">{service.name}</h2>
                                    <p className="text-white/70 text-sm mt-0.5">{vendor.businessName} &bull; {Number(service.price).toLocaleString()} RWF</p>
                                </div>
                                <button onClick={() => setShowBooking(false)} className="text-white/70 hover:text-white text-xl leading-none mt-0.5">✕</button>
                            </div>
                        </div>

                        {bookingDone ? (
                            /* Success state */
                            <div className="px-6 py-10 text-center overflow-y-auto">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-charcoal mb-2">Request Sent!</h3>
                                <p className="text-gray-500 text-sm mb-1">Your booking request has been submitted.</p>
                                <p className="text-gray-400 text-sm mb-6">Check your email for confirmation. The vendor will be in touch shortly.</p>
                                <Button onClick={() => setShowBooking(false)} className="bg-burgundy hover:bg-burgundy/90 text-white rounded-xl px-8">
                                    Done
                                </Button>
                            </div>
                        ) : (
                            /* Form */
                            <form onSubmit={handleBook} className="px-6 py-5 space-y-4 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                                        <input
                                            required
                                            type="text"
                                            value={bookingForm.clientName}
                                            onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                                            placeholder="Your full name"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                                        <input
                                            required
                                            type="email"
                                            value={bookingForm.clientEmail}
                                            onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                                            placeholder="you@email.com"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            value={bookingForm.clientPhone}
                                            onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                                            placeholder="+250 7XX XXX XXX"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Wedding / Event Date *</label>
                                        <input
                                            required
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={bookingForm.eventDate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                if (bookedDates.includes(selectedDate)) {
                                                    toast.error('This date is already booked. Please select another date.');
                                                    return;
                                                }
                                                setBookingForm({ ...bookingForm, eventDate: selectedDate });
                                            }}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                                        />
                                        {bookedDates.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-1.5">Some dates are unavailable (already booked)</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes <span className="text-gray-300 normal-case font-normal">optional</span></label>
                                        <textarea
                                            rows={3}
                                            value={bookingForm.notes}
                                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                            placeholder="Any special requests or questions for the vendor..."
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy resize-none"
                                        />
                                    </div>
                                </div>

                                {bookingError && (
                                    <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{bookingError}</p>
                                )}

                                <div className="flex gap-3 pt-1">
                                    <Button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="flex-1 bg-burgundy hover:bg-burgundy/90 text-white rounded-xl h-11 font-semibold"
                                    >
                                        {bookingLoading ? (
                                            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                                        ) : 'Send Booking Request'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowBooking(false)} className="rounded-xl h-11 border-gray-200 text-gray-600">
                                        Cancel
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-400 text-center">You&apos;ll receive a confirmation email. The vendor will contact you to finalise details.</p>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-br from-burgundy to-burgundy/80 px-6 py-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Contact Vendor</p>
                                    <h2 className="text-white font-bold text-lg leading-tight">{vendor.businessName}</h2>
                                    <p className="text-white/70 text-sm mt-0.5">{service.name}</p>
                                </div>
                                <button onClick={() => setShowMessageModal(false)} className="text-white/70 hover:text-white text-xl leading-none mt-0.5">✕</button>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Message *</label>
                            <textarea
                                rows={6}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Hi! I'm interested in your services. Can we discuss...?"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy resize-none"
                            />
                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim() || sendingMessage}
                                    className="flex-1 bg-burgundy hover:bg-burgundy/90 text-white rounded-xl h-11 font-semibold"
                                >
                                    {sendingMessage ? (
                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                                    ) : 'Send Message'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowMessageModal(false)} className="rounded-xl h-11 border-gray-200 text-gray-600">
                                    Cancel
                                </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">The vendor will receive your message and respond via the messaging system</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
