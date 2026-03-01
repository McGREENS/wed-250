import Link from 'next/link';
// import { createPageUrl } from '../../utils';
import { MapPin, Star, Heart, ExternalLink } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            {hasHalfStar && (
                <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating})</span>
        </div>
    );
};

export default function VendorCard({ vendor, viewMode = 'grid' }: { vendor: any; viewMode?: string }) {
  if (viewMode === 'list') {
    return (
      <Link
        href={`/vendors/${vendor.id}`}
        className="group block"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all p-6">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
                alt={vendor.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              {vendor.available && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Available
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-charcoal text-xl group-hover:text-burgundy transition-colors">
                    {vendor.name}
                  </h3>
                  <Badge variant="secondary" className="bg-sand text-charcoal border-0 mt-1">
                    {vendor.category}
                  </Badge>
                </div>
                <span className="text-burgundy font-semibold">{vendor.price_range}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {vendor.location}
                </span>
              </div>

              {vendor.rating && (
                <div className="mb-3">
                  {renderStars(vendor.rating)}
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4">
                {vendor.description}
              </p>

              <button className="bg-burgundy text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-burgundy-light transition-colors">
                Detail
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
            src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=800&h=600&fit=crop'}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {vendor.available && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Available
            </div>
          )}
          {vendor.featured && (
            <Badge className="absolute top-12 left-3 bg-burgundy text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className="w-4 h-4 text-burgundy" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-charcoal text-lg group-hover:text-burgundy transition-colors">
                {vendor.name}
              </h3>
              <Badge variant="secondary" className="bg-sand text-charcoal border-0 mt-1">
                {vendor.category}
              </Badge>
            </div>
            <span className="text-burgundy font-semibold text-sm">{vendor.price_range}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {vendor.location}
            </span>
          </div>

          {vendor.rating && (
            <div className="mb-3">
              {renderStars(vendor.rating)}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {vendor.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              STARTS FROM {vendor.price_range}
            </div>
            <button className="bg-burgundy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-burgundy-light transition-colors">
              Detail
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}