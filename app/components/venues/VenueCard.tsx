"use client";

import { MapPin, Users, Star, Heart, CheckCircle } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VenueCard({ venue, viewMode = 'grid', isFavorite = false, onFavoriteToggle }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleCardClick = () => {
    if (!session?.user) {
      toast.error('Please login to view venue details');
      router.push('/login');
      return;
    }
    router.push(`/venues/${venue.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const method = favorite ? 'DELETE' : 'POST';
      const url = favorite 
        ? `/api/favorites?venueId=${venue.id}`
        : '/api/favorites';
      
      console.log('Favorite action:', { method, url, venueId: venue.id, favorite });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ venueId: venue.id }) : undefined,
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
      <div
        onClick={handleCardClick}
        className="group block cursor-pointer"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex gap-6 p-6">
            <div className="relative w-64 h-48 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {venue.featured && (
                <Badge className="absolute top-3 left-3 bg-burgundy text-white border-0">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-charcoal group-hover:text-burgundy transition-colors mb-2">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {venue.location}
                      </span>
                      {venue.capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Up to {venue.capacity} guests
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-burgundy mb-1">
                      {venue.price_range}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {venue.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.venue_type && (
                    <Badge variant="secondary" className="bg-sand text-charcoal border-0">
                      {venue.venue_type}
                    </Badge>
                  )}
                  {venue.features?.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                  {venue.features?.length > 3 && (
                    <Badge variant="outline" className="text-gray-600">
                      +{venue.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-burgundy hover:bg-burgundy-light text-white flex-1">
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`border-burgundy ${favorite ? 'bg-burgundy text-white' : 'text-burgundy'}`}
                  onClick={handleFavoriteClick}
                  disabled={isLoading}
                >
                  <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="group block cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {venue.featured && (
            <Badge className="absolute top-3 left-3 bg-burgundy text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-3 right-3 w-9 h-9 backdrop-blur rounded-full flex items-center justify-center transition-colors ${
              favorite ? 'bg-burgundy text-white' : 'bg-white/90 hover:bg-white text-burgundy'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal text-base group-hover:text-burgundy transition-colors mb-1.5 line-clamp-1">
                {venue.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                {venue.location}
              </div>
              {venue.capacity && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5" />
                  Up to {venue.capacity} guests
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-burgundy">{venue.price_range}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {venue.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {venue.venue_type && (
              <Badge variant="secondary" className="bg-sand text-charcoal border-0 text-xs py-0 px-2">
                {venue.venue_type}
              </Badge>
            )}
            {venue.features?.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs text-gray-600 py-0 px-2">
                {feature}
              </Badge>
            ))}
          </div>

          <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white text-sm py-2">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}