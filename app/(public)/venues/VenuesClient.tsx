"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, ChevronUp, Grid, List, Map, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import VenueCard from '@/app/components/venues/VenueCard';
import EmptyState from '@/app/components/common/EmptyState';
import { useSession } from 'next-auth/react';

interface VenuesClientProps {
    initialVenues: any[];
}

export default function VenuesClient({ initialVenues }: VenuesClientProps) {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVenueType, setSelectedVenueType] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [selectedCapacity, setSelectedCapacity] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all-kigali');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedSections, setExpandedSections] = useState({
        type: true,
        price: true,
        capacity: true,
        features: true
    });
    const [favoriteVenueIds, setFavoriteVenueIds] = useState<string[]>([]);

    const venues = initialVenues.map((venue: any) => ({
        ...venue,
        name: venue.name,
        images: venue.image ? [venue.image] : [],
        price_range: venue.price,
        venue_type: venue.venueType,
        features: venue.amenities || [],
    }));

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!session?.user) return;
            try {
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    setFavoriteVenueIds(data.venues.map((v: any) => v.venueId));
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        fetchFavorites();
    }, [session]);

    const handleFavoriteToggle = async () => {
        if (!session?.user) return;
        try {
            const res = await fetch('/api/favorites');
            if (res.ok) {
                const data = await res.json();
                setFavoriteVenueIds(data.venues.map((v: any) => v.venueId));
            }
        } catch (error) {
            console.error('Error refreshing favorites:', error);
        }
    };

    const venueTypes = [
        { id: 'hotel', name: 'Hotel' },
        { id: 'ballroom', name: 'Ballroom' },
        { id: 'outdoor', name: 'Outdoor' },
        { id: 'garden', name: 'Garden' },
        { id: 'restaurant', name: 'Restaurant' },
        { id: 'modern', name: 'Modern' },
        { id: 'historic', name: 'Historic' }
    ];

    const priceRanges = [
        { id: 'under-500k', name: 'Under RWF 500,000', min: 0, max: 500000 },
        { id: '500k-1m', name: 'RWF 500,000 - 1,000,000', min: 500000, max: 1000000 },
        { id: '1m-2m', name: 'RWF 1,000,000 - 2,000,000', min: 1000000, max: 2000000 },
        { id: '2m-5m', name: 'RWF 2,000,000 - 5,000,000', min: 2000000, max: 5000000 },
        { id: 'above-5m', name: 'Above RWF 5,000,000', min: 5000000, max: Infinity }
    ];

    const capacityOptions = [
        { id: 'under-50', name: 'Under 50 guests', min: 0, max: 50 },
        { id: '50-100', name: '50 - 100 guests', min: 50, max: 100 },
        { id: '100-200', name: '100 - 200 guests', min: 100, max: 200 },
        { id: '200-500', name: '200 - 500 guests', min: 200, max: 500 },
        { id: 'above-500', name: 'Above 500 guests', min: 500, max: Infinity }
    ];

    const featuresList = [
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

    const filteredVenues = venues.filter((venue: any) => {
        const matchesSearch = venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedVenueType === 'all' || venue.venue_type?.toLowerCase() === selectedVenueType.toLowerCase();
        
        const matchesPrice = selectedPriceRange === 'all' || (() => {
            const range = priceRanges.find(r => r.id === selectedPriceRange);
            if (!range) return true;
            const price = parseFloat(venue.price) || 0;
            return price >= range.min && price <= range.max;
        })();
        
        const matchesCapacity = selectedCapacity === 'all' || (() => {
            const option = capacityOptions.find(o => o.id === selectedCapacity);
            if (!option) return true;
            const capacity = venue.maxCapacity || 0;
            return capacity >= option.min && capacity <= option.max;
        })();
        
        const matchesFeatures = selectedFeatures.length === 0 ||
            selectedFeatures.every(f => venue.features?.includes(f));
        
        return matchesSearch && matchesType && matchesPrice && matchesCapacity && matchesFeatures;
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section as keyof typeof expandedSections]
        }));
    };

    const venuesPerPage = 12;
    const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
    const paginatedVenues = filteredVenues.slice(
        (currentPage - 1) * venuesPerPage,
        currentPage * venuesPerPage
    );

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-burgundy text-sm font-semibold uppercase tracking-wider">Find Your Perfect Setting</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
                    Dream Wedding Venues in Rwanda
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                    From elegant ballrooms in Kigali to stunning lakeside venues, discover the perfect
                    backdrop for your special day.
                </p>

                <div className="mt-10 flex justify-center">
                    <div className="flex items-center space-x-4 p-2 bg-white rounded-full shadow-lg max-w-2xl w-full">
                        <div className="flex items-center flex-grow">
                            <Search className="h-5 w-5 text-gray-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search for venues by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow border-none focus:ring-0 px-3 py-2 text-gray-700 rounded-full"
                            />
                        </div>
                        <div className="flex items-center border-l border-gray-200 pl-4">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <select 
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="border-none focus:ring-0 pr-3 py-2 text-gray-700 bg-transparent"
                            >
                                <option value="all-kigali">All Kigali</option>
                                <option value="nyarutarama">Nyarutarama</option>
                                <option value="kacyiru">Kacyiru</option>
                                <option value="kimihurura">Kimihurura</option>
                                <option value="remera">Remera</option>
                                <option value="musanze">Musanze</option>
                                <option value="rubavu">Rubavu</option>
                            </select>
                        </div>
                        <button 
                            className="bg-burgundy text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-burgundy-light transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-gray-600">
                    <span className="font-semibold">Popular:</span>
                    <button 
                        onClick={() => setSelectedVenueType('hotel')}
                        className="ml-2 text-burgundy hover:underline"
                    >
                        Hotels
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedVenueType('ballroom')}
                        className="text-burgundy hover:underline"
                    >
                        Ballrooms
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedVenueType('outdoor')}
                        className="text-burgundy hover:underline"
                    >
                        Outdoor
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedVenueType('garden')}
                        className="text-burgundy hover:underline"
                    >
                        Gardens
                    </button>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="w-5 h-5 text-burgundy" />
                                <h2 className="text-lg font-semibold text-charcoal">Filters</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Venue Type Filter */}
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('type')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Venue Type
                                        {expandedSections.type ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.type && (
                                        <div className="space-y-2">
                                            {venueTypes.map(type => (
                                                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="venueType"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        checked={selectedVenueType === type.name}
                                                        onChange={() => setSelectedVenueType(type.name)}
                                                    />
                                                    <span className="text-sm text-gray-700">{type.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Price Range Filter */}
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Price Range (RWF)
                                        {expandedSections.price ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.price && (
                                        <div className="space-y-2">
                                            {priceRanges.map(range => (
                                                <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="priceRange"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        checked={selectedPriceRange === range.id}
                                                        onChange={() => setSelectedPriceRange(range.id)}
                                                    />
                                                    <span className="text-sm text-gray-700">{range.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Capacity Filter */}
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('capacity')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Guest Capacity
                                        </div>
                                        {expandedSections.capacity ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.capacity && (
                                        <div className="space-y-2">
                                            {capacityOptions.map(option => (
                                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="capacity"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        checked={selectedCapacity === option.id}
                                                        onChange={() => setSelectedCapacity(option.id)}
                                                    />
                                                    <span className="text-sm text-gray-700">{option.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Features Filter */}
                                <div className="pb-4">
                                    <button
                                        onClick={() => toggleSection('features')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Amenities & Features
                                        {expandedSections.features ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.features && (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {featuresList.map(feature => (
                                                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        checked={selectedFeatures.includes(feature)}
                                                        onChange={() => toggleFeature(feature)}
                                                    />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedVenueType('all');
                                        setSelectedPriceRange('all');
                                        setSelectedCapacity('all');
                                        setSelectedFeatures([]);
                                        setSearchQuery('');
                                    }}
                                    className="w-full text-sm text-burgundy hover:text-burgundy-light font-medium py-2 border border-burgundy rounded-lg hover:bg-burgundy hover:text-white transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Venues Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-charcoal">
                                <span className="font-semibold">{filteredVenues.length}</span> venues found
                            </p>
                            <div className="flex items-center gap-4">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-32 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="capacity">Capacity</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-burgundy text-white' : 'text-gray-600 hover:text-burgundy'}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-burgundy text-white' : 'text-gray-600 hover:text-burgundy'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('map')}
                                        className={`p-2 ${viewMode === 'map' ? 'bg-burgundy text-white' : 'text-gray-600 hover:text-burgundy'}`}
                                    >
                                        <Map className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
                            {paginatedVenues.map((venue: any) => (
                                <VenueCard 
                                    key={venue.id} 
                                    venue={venue} 
                                    viewMode={viewMode}
                                    isFavorite={favoriteVenueIds.includes(venue.id)}
                                    onFavoriteToggle={handleFavoriteToggle}
                                />
                            ))}
                        </div>

                        {filteredVenues.length === 0 && (
                            <EmptyState
                                icon={Search}
                                title="No venues found"
                                description="Try adjusting your filters or search query to find the perfect venue for your wedding."
                                actionLabel="Clear Filters"
                                onAction={() => {
                                    setSelectedVenueType('all');
                                    setSelectedPriceRange('all');
                                    setSelectedCapacity('all');
                                    setSelectedFeatures([]);
                                    setSearchQuery('');
                                }}
                            />
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                                    
                                    if (!showPage) {
                                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                            return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                        }
                                        return null;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-2 text-sm border rounded-lg ${
                                                currentPage === pageNum
                                                    ? 'bg-burgundy text-white border-burgundy'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
