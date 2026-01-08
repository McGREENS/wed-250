"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import VendorCard from '@/app/components/vendors/VendorCard';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import EmptyState from '@/app/components/common/EmptyState';

export default function VendorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');

    // Fetch vendors from backend
    const { data: vendors = [], isLoading } = useQuery({
        queryKey: ['vendors'],
        queryFn: () => base44.entities.Vendor.list('-created_date', 100)
    });

    // Sample vendor data for fallback
    const sampleVendors = vendors.length > 0 ? vendors : [
        {
            id: 1,
            name: 'Grand Rose Gardens',
            category: 'Venues',
            location: 'Los Angeles, CA',
            price_range: '$$$',
            description: 'Elegant outdoor garden venue with stunning rose gardens and romantic atmosphere',
            images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'],
            featured: true
        },
        {
            id: 2,
            name: 'Capture the Moment Studio',
            category: 'Photographers',
            location: 'New York, NY',
            price_range: '$$',
            description: 'Award-winning photography with a focus on candid, emotional moments',
            images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'],
            featured: true
        },
        {
            id: 3,
            name: 'Bloom & Bliss Decor',
            category: 'Decor',
            location: 'Miami, FL',
            price_range: '$$',
            description: 'Exquisite floral arrangements and complete wedding decor services',
            images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop'],
            featured: false
        },
        {
            id: 4,
            name: 'Gourmet Celebrations Catering',
            category: 'Food & Beverages',
            location: 'Chicago, IL',
            price_range: '$$$',
            description: 'Farm-to-table cuisine with customizable menus for your special day',
            images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'],
            featured: false
        },
        {
            id: 5,
            name: 'Forever Memories Planners',
            category: 'Wedding Planners',
            location: 'San Francisco, CA',
            price_range: '$$$$',
            description: 'Full-service wedding planning with 15+ years of experience',
            images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'],
            featured: true
        },
        {
            id: 6,
            name: 'Rhythm & Soul Entertainment',
            category: 'Entertainment',
            location: 'Nashville, TN',
            price_range: '$$',
            description: 'Live bands, DJs, and entertainment packages to keep your guests dancing',
            images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'],
            featured: false
        }
    ];

    const categories = [
        'All Categories',
        'Venues',
        'Photographers',
        'Decor',
        'Food & Beverages',
        'Wedding Planners',
        'Entertainment',
        'Car Rental'
    ];

    const priceRanges = ['All Prices', '$', '$$', '$$$', '$$$$'];

    const allVendors = vendors.length > 0 ? vendors : sampleVendors;

    const filteredVendors = allVendors.filter((vendor: any) => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
        const matchesPrice = selectedPriceRange === 'all' || vendor.price_range === selectedPriceRange;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Discover Perfect Vendors
                        </h1>
                        <p className="text-xl text-white/90">
                            Browse our curated selection of trusted wedding professionals
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 shadow-xl">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Search vendors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-0 bg-gray-50 focus:ring-2 focus:ring-burgundy"
                                />
                            </div>
                            <button className="bg-burgundy text-white px-6 rounded-lg hover:bg-burgundy-light transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
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

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-charcoal mb-2 block">
                                        Category
                                    </label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.slice(1).map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-charcoal mb-2 block">
                                        Price Range
                                    </label>
                                    <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                                        <SelectTrigger className="border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Prices</SelectItem>
                                            {priceRanges.slice(1).map(price => (
                                                <SelectItem key={price} value={price}>{price}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedPriceRange('all');
                                        setSearchQuery('');
                                    }}
                                    className="w-full text-sm text-burgundy hover:text-burgundy-light font-medium"
                                >
                                    Clear all filters
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
                        </div>

                        {isLoading ? (
                            <LoadingSpinner size="lg" text="Loading vendors..." />
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {filteredVendors.map((vendor: any) => (
                                        <VendorCard key={vendor.id} vendor={vendor} />
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
                                            setSearchQuery('');
                                        }}
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
