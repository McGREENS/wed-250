"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Filter, Star, MapPin, ChevronDown, ChevronUp, Grid, List, Map } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import VendorCard from '@/app/components/vendors/VendorCard';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import EmptyState from '@/app/components/common/EmptyState';

export default function VendorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all-kigali');
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        rating: true,
        availability: true
    });

    // Fetch vendors from backend
    const { data: vendors = [], isLoading } = useQuery({
        queryKey: ['vendors'],
        queryFn: () => base44.entities.Vendor.list('-created_date', 100)
    });

    // Sample vendor data for fallback
    const sampleVendors = vendors.length > 0 ? vendors : [
        {
            id: 1,
            name: 'Kigali Bloom Florists',
            category: 'Florists',
            location: 'Kigali, Rwanda',
            price_range: 'RWF 150,000',
            rating: 4.8,
            description: 'Premium floral arrangements for weddings and events in Kigali',
            images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop'],
            featured: true,
            available: true
        },
        {
            id: 2,
            name: 'Rwanda Wedding Planners',
            category: 'Wedding Planners',
            location: 'Kigali, Rwanda',
            price_range: 'RWF 500,000',
            rating: 4.9,
            description: 'Professional wedding planning services with 10+ years experience',
            images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'],
            featured: true,
            available: true
        },
        {
            id: 3,
            name: 'Lake Kivu Venue',
            category: 'Venues',
            location: 'Rubavu, Rwanda',
            price_range: 'RWF 2,000,000',
            rating: 4.7,
            description: 'Beautiful lakeside venue with stunning views of Lake Kivu',
            images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'],
            featured: false,
            available: false
        },
        {
            id: 4,
            name: 'Kigali Photography Studio',
            category: 'Photographers',
            location: 'Kigali, Rwanda',
            price_range: 'RWF 300,000',
            rating: 4.6,
            description: 'Professional wedding photography and videography services',
            images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'],
            featured: false,
            available: true
        },
        {
            id: 5,
            name: 'Rwanda Catering Co.',
            category: 'Catering',
            location: 'Kigali, Rwanda',
            price_range: 'RWF 800,000',
            rating: 4.8,
            description: 'Traditional Rwandan cuisine and international dishes for weddings',
            images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'],
            featured: true,
            available: true
        },
        {
            id: 6,
            name: 'Inkuru Entertainment',
            category: 'Entertainment',
            location: 'Kigali, Rwanda',
            price_range: 'RWF 200,000',
            rating: 4.5,
            description: 'Live bands, DJs, and traditional Rwandan dance performances',
            images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'],
            featured: false,
            available: false
        }
    ];

    const categories = [
        { id: 'photography', name: 'Photography', checked: false },
        { id: 'catering', name: 'Catering', checked: false },
        { id: 'florist', name: 'Florist', checked: false },
        { id: 'decor', name: 'Decor & Lighting', checked: false },
        { id: 'entertainment', name: 'Entertainment', checked: false },
        { id: 'hair-makeup', name: 'Hair & Makeup', checked: false },
        { id: 'planning', name: 'Planning', checked: false },
        { id: 'attire', name: 'Attire', checked: false }
    ];

    const priceRanges = [
        { id: 'under-100k', name: 'Under RWF 100,000', min: 0, max: 100000 },
        { id: '100k-300k', name: 'RWF 100,000 - 300,000', min: 100000, max: 300000 },
        { id: '300k-600k', name: 'RWF 300,000 - 600,000', min: 300000, max: 600000 },
        { id: '600k-1m', name: 'RWF 600,000 - 1,000,000', min: 600000, max: 1000000 },
        { id: 'above-1m', name: 'Above RWF 1,000,000', min: 1000000, max: Infinity }
    ];

    const ratingOptions = [
        { id: '5-plus', name: '5+', value: 5 },
        { id: '4-plus', name: '4+', value: 4 },
        { id: '3-plus', name: '3+', value: 3 }
    ];

    const availabilityOptions = [
        { id: 'available', name: 'Available' },
        { id: 'busy', name: 'Busy' }
    ];

    const allVendors = vendors.length > 0 ? vendors : sampleVendors;

    const filteredVendors = allVendors.filter((vendor: any) => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || vendor.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesPrice = selectedPriceRange === 'all';
        const matchesRating = selectedRating === 'all' || 
            (selectedRating === '4+ Stars' && vendor.rating >= 4) ||
            (selectedRating === '4.5+ Stars' && vendor.rating >= 4.5) ||
            (selectedRating === '5 Stars' && vendor.rating === 5);
        const matchesAvailability = selectedAvailability === 'all' || 
            (selectedAvailability === 'available' && vendor.available) ||
            (selectedAvailability === 'busy' && !vendor.available);
        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability;
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section as keyof typeof expandedSections]
        }));
    };

    const vendorsPerPage = 12;
    const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
    const paginatedVendors = filteredVendors.slice(
        (currentPage - 1) * vendorsPerPage,
        currentPage * vendorsPerPage
    );

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-burgundy text-sm font-semibold uppercase tracking-wider">Discover Excellence</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
                    World-Class Vendors in Rwanda
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                    From the hills of Musanze to the heart of Kigali, find the perfect team to bring
                    your wedding vision to life.
                </p>

                <div className="mt-10 flex justify-center">
                    <div className="flex items-center space-x-4 p-2 bg-white rounded-full shadow-lg max-w-2xl w-full">
                        <div className="flex items-center flex-grow">
                            <Search className="h-5 w-5 text-gray-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search for photographers, florists, caterers..."
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
                            onClick={() => {}}
                            className="bg-burgundy text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-burgundy-light transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-gray-600">
                    <span className="font-semibold">Popular:</span>
                    <button 
                        onClick={() => setSelectedCategory('Photographers')}
                        className="ml-2 text-burgundy hover:underline"
                    >
                        Photography
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedCategory('Decor')}
                        className="text-burgundy hover:underline"
                    >
                        Decor
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedCategory('Catering')}
                        className="text-burgundy hover:underline"
                    >
                        Catering
                    </button>
                    <span className="mx-1">|</span>
                    <button 
                        onClick={() => setSelectedCategory('Wedding Planners')}
                        className="text-burgundy hover:underline"
                    >
                        Planners
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
                                {/* Category Filter */}
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('category')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Category
                                        {expandedSections.category ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.category && (
                                        <div className="space-y-2">
                                            {categories.map(cat => (
                                                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        checked={cat.checked}
                                                        onChange={(e) => {
                                                            cat.checked = e.target.checked;
                                                            setSelectedCategory(cat.checked ? cat.name : 'all');
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{cat.name}</span>
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
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        onChange={(e) => {
                                                            setSelectedPriceRange(e.target.checked ? range.id : 'all');
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{range.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rating Filter */}
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('rating')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Rating
                                        {expandedSections.rating ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.rating && (
                                        <div className="space-y-2">
                                            {ratingOptions.map(rating => (
                                                <label key={rating.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        onChange={(e) => {
                                                            setSelectedRating(e.target.checked ? `${rating.value}+ Stars` : 'all');
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{rating.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Availability Filter */}
                                <div className="pb-4">
                                    <button
                                        onClick={() => toggleSection('availability')}
                                        className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3"
                                    >
                                        Availability
                                        {expandedSections.availability ? 
                                            <ChevronUp className="w-4 h-4" /> : 
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                    {expandedSections.availability && (
                                        <div className="space-y-2">
                                            {availabilityOptions.map(option => (
                                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                        onChange={(e) => {
                                                            setSelectedAvailability(e.target.checked ? option.id : 'all');
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{option.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedPriceRange('all');
                                        setSelectedRating('all');
                                        setSelectedAvailability('all');
                                        setSearchQuery('');
                                    }}
                                    className="w-full text-sm text-burgundy hover:text-burgundy-light font-medium py-2 border border-burgundy rounded-lg hover:bg-burgundy hover:text-white transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vendors Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-charcoal">
                                <span className="font-semibold">{filteredVendors.length}</span> vendors found
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
                                        <SelectItem value="rating">Rating</SelectItem>
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

                        {isLoading ? (
                            <LoadingSpinner size="lg" text="Loading vendors..." />
                        ) : (
                            <>
                                <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
                                    {paginatedVendors.map((vendor: any) => (
                                        <VendorCard key={vendor.id} vendor={vendor} viewMode={viewMode} />
                                    ))}
                                </div>

                                {filteredVendors.length === 0 && (
                                    <EmptyState
                                        icon={Search}
                                        title="No vendors found"
                                        description="Try adjusting your filters or search query to find the perfect vendors for your wedding."
                                        actionLabel="Clear Filters"
                                        onAction={() => {
                                            setSelectedCategory('all');
                                            setSelectedPriceRange('all');
                                            setSelectedRating('all');
                                            setSelectedAvailability('all');
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
