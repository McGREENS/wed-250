"use client";

import Link from 'next/link';
import { MapPin, Star, Heart } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { useState } from 'react';
import { toast } from 'sonner';

export default function VendorCard({ vendor, viewMode = 'grid', isFavorite = false, onFavoriteToggle }: { vendor: any; viewMode?: string; isFavorite?: boolean; onFavoriteToggle?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const method = favorite ? 'DELETE' : 'POST';
      const url = favorite 
        ? `/api/favorites?vendorId=${vendor.id}`
        : '/api/favorites';
      
      console.log('Favorite action:', { method, url, vendorId: vendor.id, favorite });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ vendorId: vendor.id }) : undefined,
      });

      const data = await res.json();
      console.log('Response:', { status: res.status, data });

      if (res.ok) {
        setFavorite(!favorite);
        toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
        onFavoriteToggle?.();
      } else {
        if (res.status === 401) {
          toast.error('Please login to save favorites');
        } else {
          toast.error(data.error || 'Failed to update favorite');
        }
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link
        href={`/vendors/${vendor.id}`}
        className="group block"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all p-5">
          <div className="flex gap-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <img
                src={vendor.portfolioImages?.[vendor.portfolioImages.length - 1]?.url || vendor.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
                alt={vendor.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              {vendor.available && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Available
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal text-lg group-hover:text-burgundy transition-colors line-clamp-1">
                    {vendor.name}
                  </h3>
                  <Badge variant="secondary" className="bg-sand text-charcoal border-0 mt-1 text-xs py-0 px-2">
                    {vendor.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-burgundy font-bold text-sm">{vendor.price_range}</span>
                  <button
                    onClick={handleFavoriteClick}
                    disabled={isLoading}
                    className={`w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors ${
                      favorite ? 'bg-burgundy text-white' : 'bg-white/90 hover:bg-white text-burgundy border border-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {vendor.location}
              </div>

              {vendor.rating && (
                <div className="mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(Math.floor(vendor.rating))].map((_, i) => (
                      <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {vendor.rating % 1 !== 0 && (
                      <Star className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400" />
                    )}
                    {[...Array(5 - Math.ceil(vendor.rating))].map((_, i) => (
                      <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({vendor.rating})</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {vendor.description}
              </p>

              <button className="bg-burgundy text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-burgundy-light transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={vendor.portfolioImages?.[vendor.portfolioImages.length - 1]?.url || vendor.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {vendor.available && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Available
            </div>
          )}
          {vendor.featured && (
            <Badge className="absolute top-10 left-3 bg-burgundy text-white border-0 text-xs py-0 px-2">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-3 right-3 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors ${
              favorite ? 'bg-burgundy text-white' : 'bg-white/90 hover:bg-white text-burgundy'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-charcoal text-base group-hover:text-burgundy transition-colors line-clamp-1">
                {vendor.name}
              </h3>
              <Badge variant="secondary" className="bg-sand text-charcoal border-0 mt-1 text-xs py-0 px-2">
                {vendor.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            {vendor.location}
          </div>

          {vendor.rating && (
            <div className="mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(Math.floor(vendor.rating))].map((_, i) => (
                  <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                {vendor.rating % 1 !== 0 && (
                  <Star className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400" />
                )}
                {[...Array(5 - Math.ceil(vendor.rating))].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
                ))}
                <span className="text-xs text-gray-600 ml-1">({vendor.rating})</span>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {vendor.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-burgundy">{vendor.price_range}</span>
            <button className="bg-burgundy text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-burgundy-light transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}