"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { MapPin, Heart, Mail, Phone, CheckCircle, ArrowLeft, Star, Calendar } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { useParams } from 'next/navigation';

export default function VendorDetail() {
    const [activeImage, setActiveImage] = useState(0);
    const params = useParams();
    const vendorId = params.id;

    // Sample vendor data - replace with real data from backend using vendorId
    const vendor = {
        id: 1,
        name: 'Grand Rose Gardens',
        category: 'Venues',
        location: 'Los Angeles, CA',
        price_range: '$$$',
        description: 'Grand Rose Gardens is an elegant outdoor garden venue featuring stunning rose gardens and romantic atmosphere. Perfect for intimate ceremonies and grand celebrations alike. Our venue has hosted over 300 weddings and consistently receives 5-star reviews.',
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop'
        ],
        contact_email: 'info@grandrosegardens.com',
        contact_phone: '(555) 123-4567',
        availability: 'Available weekends through 2024',
        featured: true,
        features: [
            'Outdoor garden ceremony space',
            'Indoor reception hall (capacity 200)',
            'Bridal suite & groom\'s room',
            'Professional lighting & sound',
            'On-site parking for 150 cars',
            'Catering kitchen facilities'
        ]
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Back Button */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href={createPageUrl('Vendors')}
                        className="inline-flex items-center gap-2 text-charcoal hover:text-burgundy transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Vendors</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="relative h-96">
                                <img
                                    src={vendor.images[activeImage]}
                                    alt={vendor.name}
                                    className="w-full h-full object-cover"
                                />
                                {vendor.featured && (
                                    <Badge className="absolute top-4 left-4 bg-burgundy text-white border-0 text-sm">
                                        <Star className="w-4 h-4 mr-1 fill-current" />
                                        Featured Vendor
                                    </Badge>
                                )}
                            </div>
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {vendor.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index
                                            ? 'border-burgundy'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${vendor.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Vendor Details */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-charcoal mb-2">
                                            {vendor.name}
                                        </h1>
                                        <div className="flex items-center gap-4 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-5 h-5" />
                                                {vendor.location}
                                            </span>
                                            <Badge variant="secondary" className="bg-sand text-charcoal border-0">
                                                {vendor.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-burgundy mb-1">
                                            {vendor.price_range}
                                        </div>
                                        <div className="text-sm text-gray-600">Price Range</div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h2 className="text-lg font-semibold text-charcoal mb-3">About</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {vendor.description}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h2 className="text-lg font-semibold text-charcoal mb-4">Features & Amenities</h2>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {vendor.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-5 h-5 text-burgundy" />
                                        <span>{vendor.availability}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-semibold text-charcoal mb-6">
                                Contact Vendor
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Email</div>
                                        <a
                                            href={`mailto:${vendor.contact_email}`}
                                            className="text-charcoal hover:text-burgundy transition-colors"
                                        >
                                            {vendor.contact_email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Phone</div>
                                        <a
                                            href={`tel:${vendor.contact_phone}`}
                                            className="text-charcoal hover:text-burgundy transition-colors"
                                        >
                                            {vendor.contact_phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                                    Request Quote
                                </Button>
                                <Button variant="outline" className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Save to Favorites
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Schedule Consultation
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="bg-sand/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        💡 <strong>Tip:</strong> Book early to secure your preferred date! Popular vendors book up 12-18 months in advance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
