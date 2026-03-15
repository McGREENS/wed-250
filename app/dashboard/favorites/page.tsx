"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Heart, MapPin, Star, Users, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

export default function FavoritesPage() {
    const router = useRouter();
    const [venues, setVenues] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch('/api/favorites');
                const data = await res.json();
                setVendors(data.vendors || []);
                setVenues(data.venues || []);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const VenueCard = ({ venue }: { venue: any }) => {
        const images = venue.images ? JSON.parse(venue.images) : [];
        
        return (
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    {images[0] && (
                        <img src={images[0]} alt={venue.name} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-charcoal text-lg mb-2">{venue.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{venue.location}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{venue.capacity} guests</span>
                                    </div>
                                    {venue.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-gold fill-gold" />
                                            <span>{venue.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Heart className="w-5 h-5 text-burgundy fill-burgundy flex-shrink-0" />
                        </div>
                        {venue.pricePerDay && (
                            <p className="font-bold text-burgundy text-lg mb-4">{venue.pricePerDay.toLocaleString()} RWF/day</p>
                        )}
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                                onClick={() => router.push(`/venues/${venue.venueId}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const VendorCard = ({ vendor }: { vendor: any }) => {
        const images = vendor.images ? JSON.parse(vendor.images) : [];
        const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
        const categories = vendor.categories ? JSON.parse(vendor.categories) : [];
        const displayImage = portfolio[portfolio.length - 1]?.url || images[0];
        
        return (
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    {displayImage && (
                        <img src={displayImage} alt={vendor.name} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-charcoal text-lg mb-1">{vendor.name}</h3>
                                <p className="text-sm text-burgundy mb-2">{categories.join(', ')}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">{vendor.location}</span>
                                    </div>
                                    {vendor.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-gold fill-gold" />
                                            <span>{vendor.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Heart className="w-5 h-5 text-burgundy fill-burgundy flex-shrink-0" />
                        </div>
                        {vendor.priceRange && (
                            <p className="font-bold text-burgundy mb-4">{vendor.priceRange}</p>
                        )}
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                                onClick={() => router.push(`/vendors/${vendor.vendorId}`)}
                            >
                                View Profile
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <UserPageLayout>
                <LoadingSpinner size="lg" text="Loading your favorites..." />
            </UserPageLayout>
        );
    }

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">My Favorites</h1>
                    <p className="text-gray-600">Your saved venues and vendors</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Saved Venues</p>
                            <p className="text-2xl font-bold text-charcoal">{venues.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Saved Vendors</p>
                            <p className="text-2xl font-bold text-charcoal">{vendors.length}</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="venues" className="space-y-6">
                    <TabsList className="bg-white border border-gray-100">
                        <TabsTrigger value="venues">Venues ({venues.length})</TabsTrigger>
                        <TabsTrigger value="vendors">Vendors ({vendors.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="venues" className="space-y-4">
                        {venues.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {venues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
                            </div>
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No saved venues yet</p>
                                    <Button 
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        onClick={() => router.push('/venues')}
                                    >
                                        Browse Venues
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="vendors" className="space-y-4">
                        {vendors.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {vendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)}
                            </div>
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No saved vendors yet</p>
                                    <Button 
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        onClick={() => router.push('/vendors')}
                                    >
                                        Browse Vendors
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </UserPageLayout>
    );
}
