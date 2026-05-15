"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Star, ArrowLeft, Heart, BadgeCheck, Share2, Briefcase, Heart as HeartIcon, Users, Globe, Award, Package, CheckCircle, Camera, Video, Utensils, Music, Car, Palette, Sparkles, Shirt, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import VendorDetailsSidebar from '@/app/components/vendors/VendorDetailsSidebar';

const TYPE_COLORS: Record<string, string> = {
    Photography:  "bg-blue-100 text-blue-700",
    Videography:  "bg-purple-100 text-purple-700",
    Catering:     "bg-orange-100 text-orange-700",
    Decoration:   "bg-pink-100 text-pink-700",
    Music:        "bg-indigo-100 text-indigo-700",
    Planning:     "bg-yellow-100 text-yellow-700",
    Makeup:       "bg-rose-100 text-rose-700",
    Attire:       "bg-teal-100 text-teal-700",
    Transport:    "bg-slate-100 text-slate-700",
    Venue:        "bg-green-100 text-green-700",
};

export default function VendorDetailPage() {
    const params = useParams();
    const vendorId = params.id as string;
    const { data: session } = useSession();

    const [vendor, setVendor] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [calendarPublished, setCalendarPublished] = useState(false);

    useEffect(() => {
        fetch(`/api/vendors/${vendorId}`)
            .then((r) => r.json())
            .then((d) => {
                console.log('Vendor data:', d.vendor);
                console.log('Calendar published:', d.vendor?.calendarPublished);
                setVendor(d.vendor);
                setServices(d.services || []);
                setCalendarPublished(d.vendor?.calendarPublished === 1 || d.vendor?.calendarPublished === true);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
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
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4" />
                    <p className="text-gray-600">Loading vendor...</p>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-charcoal mb-4">Vendor not found</h2>
                    <Link href="/vendors">
                        <Button className="bg-burgundy hover:bg-burgundy-light text-white">Back to Vendors</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
    const categories = vendor.categories ? JSON.parse(vendor.categories) : [];
    const activeServices = services.filter((s) => s.active !== false);
    const minPrice = activeServices.length > 0 ? Math.min(...activeServices.map((s) => s.price)) : null;

    // Hero image: first service image → first portfolio image → fallback
    const heroImage =
        activeServices.find((s) => s.image)?.image ||
        (portfolio[0]?.url || portfolio[0]) ||
        'https://images.unsplash.com/photo-1519228621490-a633b619bd3b?w=1400&h=800&fit=crop';

    return (
        <div className="min-h-screen bg-cream">

            {/* ── HERO ── */}
            <div className="relative h-[480px] md:h-[580px]">
                <img src={heroImage} alt={vendor.businessName} className="absolute inset-0 w-full h-full object-cover" />
                {/* layered gradient: dark at top for bar, heavy at bottom for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

                {/* ── top bar ── */}
                <div className="absolute top-0 left-0 right-0 px-6 md:px-12 pt-6 flex items-center justify-between">
                    <Link
                        href="/vendors"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/20"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Vendors
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            title="Copy link"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleFavorite}
                            disabled={favLoading}
                            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                            className={`w-9 h-9 backdrop-blur-sm border rounded-full flex items-center justify-center transition-all ${
                                isFavorite
                                    ? 'bg-burgundy border-burgundy text-white'
                                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* ── bottom info + avatar overlap ── */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">

                        {/* badges row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {vendor.verified && (
                                <span className="inline-flex items-center gap-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                            )}
                            {vendor.featured && (
                                <span className="inline-flex items-center gap-1 bg-burgundy/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    <Star className="w-3.5 h-3.5 fill-current" /> Featured
                                </span>
                            )}
                            {categories.map((cat: string) => (
                                <span key={cat} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20">
                                    {cat}
                                </span>
                            ))}
                        </div>

                        {/* business name */}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
                            {vendor.businessName}
                        </h1>

                        {/* meta row */}
                        <div className="flex flex-wrap items-center gap-4 text-white/85 text-sm mb-0 pb-8">
                            {vendor.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 shrink-0 text-white/60" /> {vendor.location}
                                </span>
                            )}
                            {vendor.rating > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                                    <span className="font-semibold text-white">{vendor.rating}</span>
                                    {vendor.reviewCount > 0 && (
                                        <span className="text-white/60">({vendor.reviewCount} reviews)</span>
                                    )}
                                </span>
                            )}
                            {activeServices.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-4 h-4 shrink-0 text-white/60" />
                                    {activeServices.length} package{activeServices.length !== 1 ? 's' : ''}
                                </span>
                            )}
                            {minPrice && (
                                <span className="flex items-center gap-1.5 font-semibold text-white">
                                    <DollarSign className="w-4 h-4 shrink-0 text-white/60" />
                                    From {minPrice.toLocaleString()} RWF
                                </span>
                            )}
                        </div>

                        {/* avatar — sits on the hero/body boundary */}
                        <div className="flex items-end gap-5 translate-y-1/2">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden shrink-0 bg-white">
                                {vendor.profileImage ? (
                                    <img src={vendor.profileImage} alt={vendor.businessName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-burgundy/20 to-burgundy/40 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-burgundy">
                                            {vendor.businessName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PAGE BODY ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* ── STEP 2: ABOUT + STATS ── */}
                        <AboutSection vendor={vendor} services={activeServices} />
                        {/* ── STEP 3: SERVICES ── */}
                        <ServicesSection services={activeServices} vendorId={vendorId} vendorName={vendor.businessName} />
                        {/* ── STEP 4: PORTFOLIO ── */}
                        <PortfolioSection services={activeServices} vendorPortfolio={portfolio} />
                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <VendorDetailsSidebar vendorId={vendorId} vendorName={vendor.businessName} calendarPublished={calendarPublished} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

// ── STEP 2: About + Stats ────────────────────────────────────────────────────
function AboutSection({ vendor, services }: { vendor: any; services: any[] }) {
    // Pull stats from service metadata — use the first service that has them
    const meta = services.reduce((acc: any, s: any) => {
        try {
            const m = s.metadata ? JSON.parse(s.metadata) : {};
            return { ...m, ...acc };
        } catch { return acc; }
    }, {});

    const stats = [
        {
            icon: Briefcase,
            value: meta.yearsExperience ? `${meta.yearsExperience}+` : null,
            label: 'Years Experience',
        },
        {
            icon: HeartIcon,
            value: meta.weddingsPlanned ? `${meta.weddingsPlanned}+` : services.length > 0 ? `${services.length}` : null,
            label: meta.weddingsPlanned ? 'Weddings Done' : 'Services Offered',
        },
        {
            icon: Users,
            value: meta.teamSize || null,
            label: 'Team Size',
        },
        {
            icon: Globe,
            value: meta.languages || null,
            label: 'Languages',
        },
        {
            icon: Award,
            value: meta.certifications || null,
            label: 'Certifications',
        },
    ].filter((s) => s.value);

    const categories = vendor.categories ? JSON.parse(vendor.categories) : [];

    return (
        <>
            {/* Stats bar */}
            {stats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y divide-gray-100">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="flex flex-col items-center justify-center p-5 text-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-burgundy/8 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-burgundy" />
                                    </div>
                                    <span className="text-base font-bold text-charcoal leading-tight">{stat.value}</span>
                                    <span className="text-xs text-gray-400">{stat.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-charcoal mb-4">About {vendor.businessName}</h2>

                {vendor.description ? (
                    <p className="text-gray-600 leading-relaxed text-sm">{vendor.description}</p>
                ) : (
                    <p className="text-gray-400 italic text-sm">This vendor hasn't added a description yet.</p>
                )}

                {/* Extra metadata details */}
                {(meta.serviceArea || meta.serviceStyle || meta.planningType || meta.makeupType || meta.decorType || meta.transportType || meta.attireCategory || meta.entertainmentType || meta.cuisineType) && (
                    <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
                        {[
                            { label: 'Service Area',    value: meta.serviceArea },
                            { label: 'Service Style',   value: meta.serviceStyle },
                            { label: 'Planning Type',   value: meta.planningType },
                            { label: 'Makeup Type',     value: meta.makeupType },
                            { label: 'Decor Type',      value: meta.decorType },
                            { label: 'Transport Type',  value: meta.transportType },
                            { label: 'Attire Category', value: meta.attireCategory },
                            { label: 'Entertainment',   value: meta.entertainmentType },
                            { label: 'Cuisine',         value: meta.cuisineType },
                        ].filter((r) => r.value).map((row, i) => (
                            <div key={i}>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{row.label}</p>
                                <p className="text-sm text-charcoal capitalize mt-0.5">{row.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Category tags */}
                {categories.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-2">
                        {categories.map((cat: string) => (
                            <span key={cat} className={`text-xs font-medium px-3 py-1 rounded-full ${
                                TYPE_COLORS[cat] || 'bg-gray-100 text-gray-600'
                            }`}>{cat}</span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// ── STEP 3: Services ─────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ElementType> = {
    Photography: Camera, Videography: Video, Catering: Utensils,
    Music, Transport: Car, Planning: Package, Makeup: Sparkles,
    Decoration: Palette, Attire: Shirt,
};

function ServicesSection({ services, vendorId, vendorName }: { services: any[]; vendorId: string; vendorName: string }) {
    const [expanded, setExpanded] = useState<string | null>(null);

    if (!services.length) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-charcoal mb-5">Service Packages</h2>
            <div className="space-y-4">
                {services.map((svc) => {
                    const meta = (() => { try { return svc.metadata ? JSON.parse(svc.metadata) : {}; } catch { return {}; } })();
                    const features = (() => { try { return svc.features ? JSON.parse(svc.features) : {}; } catch { return {}; } })();
                    const items: string[] = features.items || [];
                    const isOpen = expanded === svc.id;
                    const Icon = TYPE_ICONS[svc.serviceType] || Package;
                    const colorCls = TYPE_COLORS[svc.serviceType] || 'bg-gray-100 text-gray-600';

                    // Build key highlights from metadata
                    const highlights: { label: string; value: string }[] = [
                        meta.duration         && { label: 'Duration',    value: meta.duration },
                        meta.photoCount       && { label: 'Photos',      value: meta.photoCount },
                        meta.shootingStyle    && { label: 'Style',       value: meta.shootingStyle },
                        meta.deliveryFormat   && { label: 'Delivery',    value: meta.deliveryFormat },
                        meta.cuisineType      && { label: 'Cuisine',     value: meta.cuisineType },
                        meta.serviceStyle     && { label: 'Style',       value: meta.serviceStyle },
                        meta.minGuests        && { label: 'Min Guests',  value: meta.minGuests },
                        meta.maxGuests        && { label: 'Max Guests',  value: meta.maxGuests },
                        meta.musicGenres      && { label: 'Genres',      value: meta.musicGenres },
                        meta.vehicleTypes     && { label: 'Vehicles',    value: meta.vehicleTypes },
                        meta.passengerCapacity && { label: 'Capacity',   value: meta.passengerCapacity },
                        meta.makeupStyle      && { label: 'Style',       value: meta.makeupStyle },
                        meta.peopleCovered    && { label: 'People',      value: meta.peopleCovered },
                        meta.decorStyle       && { label: 'Style',       value: meta.decorStyle },
                        meta.styleOptions     && { label: 'Style',       value: meta.styleOptions },
                        meta.leadTime         && { label: 'Lead Time',   value: meta.leadTime },
                    ].filter(Boolean) as { label: string; value: string }[];

                    return (
                        <div key={svc.id} className="border border-gray-100 rounded-xl overflow-hidden">
                            {/* Card header — always visible */}
                            <div className="flex items-start gap-4 p-4">
                                {svc.image ? (
                                    <img src={svc.image} alt={svc.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                                ) : (
                                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shrink-0 ${colorCls}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colorCls}`}>
                                                {svc.serviceType}
                                            </span>
                                            <h3 className="text-base font-bold text-charcoal mt-1">{svc.name}</h3>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-lg font-bold text-burgundy">{Number(svc.price).toLocaleString()}</p>
                                            <p className="text-[11px] text-gray-400">RWF</p>
                                        </div>
                                    </div>
                                    {svc.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{svc.description}</p>
                                    )}
                                    {features.duration && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Clock className="w-3 h-3" /> {features.duration}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Expand toggle */}
                            <button
                                onClick={() => setExpanded(isOpen ? null : svc.id)}
                                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 text-sm text-gray-500 hover:bg-gray-100 transition-colors border-t border-gray-100"
                            >
                                <span>{isOpen ? 'Hide details' : 'View details'}</span>
                                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Expanded details */}
                            {isOpen && (
                                <div className="px-4 pb-4 pt-3 space-y-4 border-t border-gray-100">
                                    {/* Highlights grid */}
                                    {highlights.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {highlights.map((h, i) => (
                                                <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h.label}</p>
                                                    <p className="text-sm text-charcoal capitalize mt-0.5">{h.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Included items */}
                                    {items.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">What's Included</p>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* CTA */}
                                    <Link href={`/vendors/${vendorId}/services/${svc.id}`}>
                                        <Button className="w-full bg-burgundy hover:bg-burgundy/90 text-white rounded-xl">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── STEP 4: Portfolio Gallery ─────────────────────────────────────────────────
function PortfolioSection({ services, vendorPortfolio }: { services: any[]; vendorPortfolio: any[] }) {
    const [activeService, setActiveService] = useState<string>('all');
    const [lightbox, setLightbox] = useState<string | null>(null);

    // Build per-service image lists
    const serviceImages: { serviceId: string; serviceName: string; serviceType: string; images: string[] }[] =
        services
            .map((svc) => {
                const imgs: string[] = [];
                if (svc.image) imgs.push(svc.image);
                try {
                    const m = svc.metadata ? JSON.parse(svc.metadata) : {};
                    if (Array.isArray(m.gallery)) imgs.push(...m.gallery);
                } catch { /* ignore */ }
                return { serviceId: svc.id, serviceName: svc.name, serviceType: svc.serviceType, images: imgs };
            })
            .filter((s) => s.images.length > 0);

    // Vendor-level portfolio images (not tied to a service)
    const vendorImgs: string[] = vendorPortfolio.map((p: any) => p.url || p).filter(Boolean);

    const allImages = [
        ...vendorImgs.map((url) => ({ url, serviceId: 'vendor', serviceName: 'General', serviceType: '' })),
        ...serviceImages.flatMap((s) => s.images.map((url) => ({ url, serviceId: s.serviceId, serviceName: s.serviceName, serviceType: s.serviceType }))),
    ];

    const filtered = activeService === 'all' ? allImages : allImages.filter((img) => img.serviceId === activeService);

    if (allImages.length === 0) return null;

    const tabs = [
        { id: 'all', label: `All (${allImages.length})` },
        ...(vendorImgs.length > 0 ? [{ id: 'vendor', label: 'General' }] : []),
        ...serviceImages.map((s) => ({ id: s.serviceId, label: s.serviceName })),
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-charcoal mb-4">Portfolio</h2>

            {/* Service filter tabs */}
            {tabs.length > 2 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveService(tab.id)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                                activeService === tab.id
                                    ? 'bg-burgundy text-white border-burgundy'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-burgundy hover:text-burgundy'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setLightbox(img.url)}
                        className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none"
                    >
                        <img
                            src={img.url}
                            alt={img.serviceName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {img.serviceType && (
                            <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[img.serviceType] || 'bg-white/80 text-gray-700'}`}>
                                {img.serviceType}
                            </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img
                        src={lightbox}
                        alt="Portfolio"
                        className="max-w-full max-h-full rounded-xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
