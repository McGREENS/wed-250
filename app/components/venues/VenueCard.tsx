import Link from 'next/link';
// import { createPageUrl } from '../../utils';
import { MapPin, Users, Star, Heart, CheckCircle } from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export default function VenueCard({ venue, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <Link
        href={`/venues/${venue.id}`}
        className="group block"
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
                <Button variant="outline" size="icon" className="border-burgundy text-burgundy">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden">
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
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal text-lg group-hover:text-burgundy transition-colors mb-2">
                {venue.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                {venue.location}
              </div>
              {venue.capacity && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  Up to {venue.capacity} guests
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-burgundy">{venue.price_range}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {venue.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {venue.venue_type && (
              <Badge variant="secondary" className="bg-sand text-charcoal border-0">
                {venue.venue_type}
              </Badge>
            )}
            {venue.features?.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs text-gray-600">
                {feature}
              </Badge>
            ))}
          </div>

          <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
}