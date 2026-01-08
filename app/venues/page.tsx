"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, MapPin, Users, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Card, CardContent } from "@/app/components/ui/card";
import VenueCard from '@/app/components/venues/VenueCard';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import EmptyState from '@/app/components/common/EmptyState';

export default function VenueMarketplacePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [selectedVenueType, setSelectedVenueType] = useState('all');
    const [capacityRange, setCapacityRange] = useState([0, 500]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);

    // Fetch venues from backend
    const { data: allVendors = [], isLoading } = useQuery({
        queryKey: ['venues'],
        queryFn: () => base44.entities.Vendor.filter({ category: 'Venues' }, '-featured', 100)
    });

    const venues = allVendors;

    // Extract unique locations from venues
    const locations = ['All Locations', ...new Set(venues.map((v: any) => v.location)) as Set<string>];

    const venueTypes = [
        'All Types',
        'Indoor',
        'Outdoor',
        'Garden',
        'Beach',
        'Ballroom',
        'Barn',
        'Hotel',
        'Restaurant',
        'Historic',
        'Modern'
    ];

    const priceRanges = ['All Prices', '$', '$$', '$$$', '$$$$'];

    const allFeatures = [
        'Parking',
        'Catering Kitchen',
        'Bridal Suite',
        'Outdoor Space',
        'Dance Floor',
        'Stage',
        'Audio/Visual Equipment',
        'Tables & Chairs',
        'Wheelchair Accessible',
        'Accommodation',
        'Bar Service',
        'Garden/Lawn'
    ];

    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    // Filter venues
    const filteredVenues = venues.filter((venue: any) => {
        const matchesSearch = venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = selectedLocation === 'all' || venue.location === selectedLocation;
        const matchesPrice = selectedPriceRange === 'all' || venue.price_range === selectedPriceRange;
        const matchesType = selectedVenueType === 'all' || venue.venue_type === selectedVenueType;
        const matchesCapacity = !venue.capacity ||
            (venue.capacity >= capacityRange[0] && venue.capacity <= capacityRange[1]);
        const matchesFeatures = selectedFeatures.length === 0 ||
            selectedFeatures.every(f => venue.features?.includes(f));

        return matchesSearch && matchesLocation && matchesPrice && matchesType && matchesCapacity && matchesFeatures;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedLocation('all');
        setSelectedPriceRange('all');
        setSelectedVenueType('all');
        setCapacityRange([0, 500]);
        setSelectedFeatures([]);
    };

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Find Your Dream Venue
                        </h1>
                        <p className="text-xl text-white/90">
                            Discover the perfect setting for your special day
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-4 shadow-xl">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Search venues by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-0 bg-gray-50 focus:ring-2 focus:ring-burgundy"
                                />
                            </div>
                            <Button className="bg-burgundy text-white px-6 rounded-lg hover:bg-burgundy-light transition-colors">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-80 flex-shrink-0">
                            <Card className="border-gray-100 shadow-sm sticky top-24">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="w-5 h-5 text-burgundy" />
                                            <h2 className="text-lg font-semibold text-charcoal">Filters</h2>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-burgundy hover:text-burgundy-light text-sm"
                                        >
                                            Clear All
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Location Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Location
                                            </label>
                                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                                <SelectTrigger className="border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Locations</SelectItem>
                                                    {locations.slice(1).map((loc: any) => (
                                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Venue Type Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-charcoal mb-2 block">
                                                Venue Type
                                            </label>
                                            <Select value={selectedVenueType} onValueChange={setSelectedVenueType}>
                                                <SelectTrigger className="border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {venueTypes.map(type => (
                                                        <SelectItem key={type} value={type === 'All Types' ? 'all' : type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Price Range Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-charcoal mb-2 block">
                                                Price Range
                                            </label>
                                            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                                                <SelectTrigger className="border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {priceRanges.map(price => (
                                                        <SelectItem key={price} value={price === 'All Prices' ? 'all' : price}>
                                                            {price}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Capacity Range */}
                                        <div>
                                            <label className="text-sm font-medium text-charcoal mb-3 block flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Guest Capacity: {capacityRange[0]} - {capacityRange[1]}+
                                            </label>
                                            <Slider
                                                value={capacityRange}
                                                onValueChange={setCapacityRange}
                                                min={0}
                                                max={500}
                                                step={10}
                                                className="mb-2"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>0</span>
                                                <span>500+</span>
                                            </div>
                                        </div>

                                        {/* Features Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-charcoal mb-3 block">
                                                Amenities & Features
                                            </label>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {allFeatures.map((feature) => (
                                                    <div key={feature} className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={feature}
                                                            checked={selectedFeatures.includes(feature)}
                                                            onCheckedChange={() => toggleFeature(feature)}
                                                        />
                                                        <label
                                                            htmlFor={feature}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {feature}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Venues Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-charcoal">
                                    <span className="font-semibold">{filteredVenues.length}</span> venues found
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    {showFilters ? 'Hide' : 'Show'} Filters
                                </Button>
                                <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={viewMode === 'grid' ? 'bg-burgundy hover:bg-burgundy-light' : ''}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={viewMode === 'list' ? 'bg-burgundy hover:bg-burgundy-light' : ''}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <LoadingSpinner size="lg" text="Loading venues..." />
                        ) : (
                            <>
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                                    {filteredVenues.map((venue: any) => (
                                        <VenueCard key={venue.id} venue={venue} viewMode={viewMode} />
                                    ))}
                                </div>

                                {filteredVenues.length === 0 && (
                                    <EmptyState
                                        icon={Search}
                                        title="No venues found"
                                        description="Try adjusting your filters to find the perfect venue for your event."
                                        actionLabel="Clear Filters"
                                        onAction={clearFilters}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
