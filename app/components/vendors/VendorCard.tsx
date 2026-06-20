"use client";

import { MapPin, Star, Heart, BadgeCheck } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
};

const FALLBACK_IMAGES: Record<string, string> = {
  Photography:  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
  Videography:  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
  Catering:     "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
  Decoration:   "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  Music:        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  Planning:     "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
  Makeup:       "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  Attire:       "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
  Transport:    "https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop",
};

export default function ServiceCard({ service, viewMode = 'grid', isFavorite = false, onFavoriteToggle }: {
  service: any; viewMode?: string; isFavorite?: boolean; onFavoriteToggle?: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const image = service.image || FALLBACK_IMAGES[service.serviceType] || FALLBACK_IMAGES.Photography;
  const typeCls = TYPE_COLORS[service.serviceType] || "bg-gray-100 text-gray-700";
  const rating = service.vendorRating || 0;

  const handleCardClick = () => {
    if (!session?.user) {
      toast.error('Please login to view service details');
      router.push('/login');
      return;
    }
    router.push(`/vendors/${service.vendorId}/services/${service.id}`);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const method = favorite ? 'DELETE' : 'POST';
      const url = favorite ? `/api/favorites?vendorId=${service.vendorId}` : '/api/favorites';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ vendorId: service.vendorId }) : undefined,
      });
      if (res.ok) {
        setFavorite(!favorite);
        toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
        onFavoriteToggle?.();
      } else {
        const d = await res.json();
        toast.error(res.status === 401 ? 'Please login to save favorites' : d.error || 'Failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div onClick={handleCardClick} className="group block cursor-pointer">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all p-3 sm:p-5">
          <div className="flex gap-3 sm:gap-5">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0">
              <img src={image} alt={service.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal text-sm sm:text-base group-hover:text-burgundy transition-colors line-clamp-1">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeCls}`}>{service.serviceType}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
                      {service.vendorVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      <span className="truncate">{service.vendorName}</span>
                    </span>
                  </div>
                </div>
                <button onClick={handleFavorite} disabled={isLoading}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${favorite ? 'bg-burgundy text-white' : 'bg-white border border-gray-200 text-burgundy hover:bg-gray-50'}`}>
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{service.vendorLocation || 'Kigali, Rwanda'}</span>
              </div>
              {rating > 0 && (
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({rating})</span>
                </div>
              )}
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{service.description}</p>
              <span className="text-burgundy font-bold text-sm sm:text-base">{service.price?.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleCardClick} className="group block cursor-pointer">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img src={image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${typeCls}`}>{service.serviceType}</span>
          {service.vendorFeatured && (
            <Badge className="absolute top-8 left-2 sm:top-10 sm:left-3 bg-burgundy text-white border-0 text-xs py-0 px-2">
              <Star className="w-3 h-3 mr-1 fill-current" />Featured
            </Badge>
          )}
          <button onClick={handleFavorite} disabled={isLoading}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors ${favorite ? 'bg-burgundy text-white' : 'bg-white/90 hover:bg-white text-burgundy'}`}>
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-charcoal text-sm sm:text-base group-hover:text-burgundy transition-colors line-clamp-1 mb-1">{service.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            {service.vendorVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
            <span className="line-clamp-1">by {service.vendorName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{service.vendorLocation || 'Kigali, Rwanda'}</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({rating})</span>
            </div>
          )}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-burgundy">{service.price?.toLocaleString()} RWF</span>
            <button className="bg-burgundy text-white px-2.5 py-1.5 sm:px-3 rounded-lg text-xs font-medium hover:bg-burgundy-light transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
