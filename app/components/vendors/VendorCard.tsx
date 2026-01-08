import Link from 'next/link';
// import { createPageUrl } from '../../utils';
import { MapPin, Star, Heart, ExternalLink } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";

export default function VendorCard({ vendor }: any) {
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
          {vendor.featured && (
            <Badge className="absolute top-3 left-3 bg-burgundy text-white border-0">
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
            <h3 className="font-semibold text-charcoal text-lg group-hover:text-burgundy transition-colors">
              {vendor.name}
            </h3>
            <span className="text-burgundy font-semibold">{vendor.price_range}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {vendor.location}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {vendor.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-sand text-charcoal border-0">
              {vendor.category}
            </Badge>
            <span className="text-burgundy text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}