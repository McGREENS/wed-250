"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Grid, List, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import ServiceCard from '@/app/components/vendors/VendorCard';
import EmptyState from '@/app/components/common/EmptyState';
import { useSession } from 'next-auth/react';

const SERVICE_TYPES = [
  "Photography", "Videography", "Catering", "Decoration",
  "Music", "Planning", "Makeup", "Attire", "Transport",
];

const PRICE_RANGES = [
  { id: 'under-200k',  label: 'Under RWF 200,000',           min: 0,       max: 200000 },
  { id: '200k-500k',   label: 'RWF 200,000 – 500,000',       min: 200000,  max: 500000 },
  { id: '500k-1m',     label: 'RWF 500,000 – 1,000,000',     min: 500000,  max: 1000000 },
  { id: '1m-2m',       label: 'RWF 1,000,000 – 2,000,000',   min: 1000000, max: 2000000 },
  { id: 'above-2m',    label: 'Above RWF 2,000,000',          min: 2000000, max: Infinity },
];

interface VendorsClientProps {
  initialServices: any[];
}

export default function VendorsClient({ initialServices }: VendorsClientProps) {
  const { data: session } = useSession();
  const [services] = useState<any[]>(initialServices);
  const [favoriteVendorIds, setFavoriteVendorIds] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({ type: true, price: true });

  useEffect(() => {
    if (!session?.user) return;
    
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          setFavoriteVendorIds(data.vendors.map((v: any) => v.vendorId));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    
    fetchFavorites();
  }, [session?.user?.id]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const priceRange = PRICE_RANGES.find((r) => r.id === selectedPriceRange);

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.vendorName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(s.serviceType);
      const matchPrice = !priceRange || (s.price >= priceRange.min && s.price <= priceRange.max);
      return matchSearch && matchType && matchPrice;
    });

    if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => (b.vendorRating || 0) - (a.vendorRating || 0));
    else if (sortBy === 'featured') list = [...list].sort((a, b) => (b.vendorFeatured ? 1 : 0) - (a.vendorFeatured ? 1 : 0));

    return list;
  }, [services, searchQuery, selectedTypes, priceRange, sortBy]);

  const PER_PAGE = 12;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedPriceRange('all');
    setSearchQuery('');
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const toggle = (section: 'type' | 'price') =>
    setExpandedSections((p) => ({ ...p, [section]: !p[section] }));

  const handleFavoriteToggle = async () => {
    if (!session?.user) return;
    
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavoriteVendorIds(data.vendors.map((v: any) => v.vendorId));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cream bg-noise">
      {/* Hero */}
      <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-burgundy text-sm font-semibold uppercase tracking-wider">Verified Wedding Vendors</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
          Meet Rwanda's Wedding Vendors
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          From photographers to caterers, decorators to planners — browse real packages with real prices from Rwanda's top wedding professionals.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center p-2 bg-white rounded-full shadow-lg max-w-2xl w-full">
            <Search className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search services, vendors, descriptions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="flex-grow border-none focus:ring-0 px-3 py-2 text-gray-700 rounded-full bg-transparent outline-none"
            />
            <button className="bg-burgundy text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-burgundy-light transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { toggleType(type); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedTypes.includes(type)
                  ? 'bg-burgundy text-white border-burgundy'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-burgundy hover:text-burgundy'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-burgundy text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>

        {/* Mobile Filter Backdrop */}
        {showMobileFilters && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${
            showMobileFilters ? 'fixed inset-y-0 left-0 z-50 w-80 transform translate-x-0' : 'hidden lg:block'
          }`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-burgundy" />
                  <h2 className="text-lg font-semibold text-charcoal">Filters</h2>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Service Type */}
                <div className="border-b border-gray-100 pb-4">
                  <button onClick={() => toggle('type')} className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3">
                    Service Type
                    {expandedSections.type ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.type && (
                    <div className="space-y-2">
                      {SERVICE_TYPES.map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="border-b border-gray-100 pb-4">
                  <button onClick={() => toggle('price')} className="flex items-center justify-between w-full text-left font-medium text-charcoal mb-3">
                    Price Range (RWF)
                    {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.price && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="price" checked={selectedPriceRange === 'all'} onChange={() => { setSelectedPriceRange('all'); setCurrentPage(1); }} className="text-burgundy focus:ring-burgundy" />
                        <span className="text-sm text-gray-700">Any price</span>
                      </label>
                      {PRICE_RANGES.map((r) => (
                        <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="price" checked={selectedPriceRange === r.id} onChange={() => { setSelectedPriceRange(r.id); setCurrentPage(1); }} className="text-burgundy focus:ring-burgundy" />
                          <span className="text-sm text-gray-700">{r.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={clearFilters} className="w-full text-sm text-burgundy font-medium py-2 border border-burgundy rounded-lg hover:bg-burgundy hover:text-white transition-colors">
                  Clear All Filters
                </button>
                
                {/* Apply button for mobile */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden w-full mt-2 bg-burgundy text-white py-2 rounded-lg font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <p className="text-charcoal">
                <span className="font-semibold">{filtered.length}</span> service{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-burgundy text-white' : 'text-gray-600 hover:text-burgundy'}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-burgundy text-white' : 'text-gray-600 hover:text-burgundy'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No services found"
                description="Try adjusting your filters or search query."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {paginated.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      viewMode={viewMode}
                      isFavorite={favoriteVendorIds.includes(service.vendorId)}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 space-x-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const n = i + 1;
                      if (n !== 1 && n !== totalPages && (n < currentPage - 1 || n > currentPage + 1)) {
                        return n === currentPage - 2 || n === currentPage + 2
                          ? <span key={n} className="px-2 text-gray-400">...</span>
                          : null;
                      }
                      return (
                        <button key={n} onClick={() => setCurrentPage(n)}
                          className={`px-3 py-2 text-sm border rounded-lg ${currentPage === n ? 'bg-burgundy text-white border-burgundy' : 'border-gray-300 hover:bg-gray-50'}`}>
                          {n}
                        </button>
                      );
                    })}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
