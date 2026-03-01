"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Heart, MapPin, Star, Phone, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function FavoritesPage() {
    const [venues, setVenues] = useState([
        { id: 1, name: 'Kigali Serena Hotel', location: 'KN 3 Ave, Kigali', capacity: '200 guests', price: 'RWF 5,000,000', rating: 4.9 },
        { id: 2, name: 'Heaven Restaurant', location: 'Kiyovu, Kigali', capacity: '150 guests', price: 'RWF 3,500,000', rating: 4.8 },
    ]);

    const [vendors, setVendors] = useState([
        { id: 1, name: 'Pixel Perfect Photography', service: 'Photography', location: 'Kigali', price: 'RWF 800,000', rating: 4.9, phone: '+250 788 234 567', email: 'info@pixelperfect.rw' },
        { id: 2, name: 'Bloom & Bliss Decor', service: 'Decoration', location: 'Kimihurura', price: 'RWF 1,200,000', rating: 4.7, phone: '+250 788 345 678', email: 'hello@bloomandblis.rw' },
    ]);

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
                        {venues.map(venue => (
                            <Card key={venue.id} className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-charcoal text-lg mb-2">{venue.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{venue.location}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>Capacity: {venue.capacity}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-gold fill-gold" />
                                                    <span>{venue.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-burgundy text-lg mb-2">{venue.price}</p>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setVenues(venues.filter(v => v.id !== venue.id))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 border-burgundy text-burgundy">View Details</Button>
                                        <Button className="flex-1 bg-burgundy text-white">Book Now</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="vendors" className="space-y-4">
                        {vendors.map(vendor => (
                            <Card key={vendor.id} className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-charcoal text-lg mb-1">{vendor.name}</h3>
                                            <p className="text-sm text-burgundy mb-2">{vendor.service}</p>
                                            <div className="flex items-center gap-4 text-sm mb-3">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">{vendor.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-gold fill-gold" />
                                                    <span>{vendor.rating}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">{vendor.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">{vendor.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-burgundy text-lg mb-2">{vendor.price}</p>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setVendors(vendors.filter(v => v.id !== vendor.id))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 border-burgundy text-burgundy">View Profile</Button>
                                        <Button className="flex-1 bg-burgundy text-white">Contact Vendor</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </UserPageLayout>
    );
}
