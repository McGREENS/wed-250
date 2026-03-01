"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import { MapPin, Heart, Mail, Phone, CheckCircle, ArrowLeft, Star, Calendar, Images, Save, ChevronDown, ChevronUp, MessageCircle, Award, Users, Camera } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { useParams } from 'next/navigation';

export default function VendorDetail() {
    const [activeImage, setActiveImage] = useState(0);
    const [expandedService, setExpandedService] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const params = useParams();
    const vendorId = params.id;

    // Sample vendor data - replace with real data from backend using vendorId
    const vendor = {
        id: 1,
        name: 'Illume Photography Kigali',
        category: 'Photography & Cinematography',
        location: 'Nyarutarama, Kigali',
        price_range: '850,000 RWF',
        rating: 4.9,
        reviews: 128,
        description: 'At Illume Photography Kigali, we specialize in capturing the magic of your wedding day through our lens. Our team of 12 professional photographers and videographers are dedicated to telling your unique love story with artistic excellence and attention to detail. We use state-of-the-art 4K equipment to ensure every moment is preserved in stunning clarity.',
        images: [
            'https://images.unsplash.com/photo-1519228621490-a633b619bd3b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1469374946526-7d52a8f7a8c1?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1474551326746-e5e327584661?w=1200&h=800&fit=crop'
        ],
        contact_email: 'info@illumephotography.rw',
        contact_phone: '+250 788 123 456',
        availability: 'Available for 2024-2025 weddings',
        featured: true,
        premium_partner: true,
        years_experience: 8,
        weddings_done: 450,
        staff_members: 12,
        awards_won: 4,
        services: [
            {
                title: 'Full-Day Wedding Photography',
                description: 'Complete wedding day coverage from preparation to reception. Includes 8+ hours of photography, professional editing, and online gallery delivery.'
            },
            {
                title: 'Cinematic Videography & Film',
                description: 'Professional 4K videography services with cinematic editing. Includes drone footage, highlight reels, and full ceremony coverage.'
            },
            {
                title: 'Pre-Wedding & Engagement Shoots',
                description: 'Beautiful engagement sessions and pre-wedding photoshoots at locations of your choice. Includes props and styling assistance.'
            }
        ],
        portfolio_images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1469374946526-7d52a8f7a8c1?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop'
        ],
        pricing_tiers: [
            {
                name: 'Essential Memories',
                price: '850,000 RWF',
                features: [
                    '8 hours coverage',
                    '1 senior photographer',
                    '400 edited high-res photos',
                    'Digital delivery (4 weeks)',
                    'Basic retouching'
                ]
            },
            {
                name: 'Heritage Collection',
                price: '1,450,000 RWF',
                popular: true,
                features: [
                    'Full day coverage (12h)',
                    '2 photographers',
                    '800+ edited photos',
                    'Premium photo album (40 pages)',
                    'A3 framed print',
                    'Digital delivery (3 weeks)'
                ]
            },
            {
                name: 'Royal Cinematic',
                price: '2,200,000 RWF',
                features: [
                    'Multi-day coverage',
                    'Team of 4 (photo + video)',
                    'Drone cinematography',
                    '60-min feature film',
                    'Hand-crafted deluxe album',
                    'VIP express delivery (10 days)'
                ]
            }
        ],
        customer_reviews: [
            {
                id: 1,
                name: 'Sandrine Uwera',
                date: 'October 12, 2023',
                rating: 5,
                comment: 'Absolutely incredible work! The team captured our wedding day perfectly. The Heritage Collection album is stunning - every photo tells a story. Professional, creative, and so easy to work with. Highly recommend!',
                vendor_response: 'Thank you so much Sandrine! It was an honor to capture your special day. We\'re thrilled you love the Heritage Collection album - we put so much love into crafting it. Wishing you a lifetime of happiness!'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <div className="relative h-96 md:h-[500px]">
                <div className="absolute inset-0">
                    <img
                        src={vendor.images[activeImage]}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                
                {/* Vendor Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-3">
                                {vendor.premium_partner && (
                                    <Badge className="bg-burgundy text-white border-none w-fit">
                                        Premium Partner
                                    </Badge>
                                )}
                                <h1 className="text-3xl md:text-5xl font-bold text-white">
                                    {vendor.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                                        <span>{vendor.rating} ({vendor.reviews} Reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                        <span>{vendor.location}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur">
                                        {vendor.category}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="secondary"
                                    className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
                                    onClick={() => {}}
                                >
                                    <Images className="w-4 h-4 mr-2" />
                                    View Gallery
                                </Button>
                                <Button
                                    className="bg-burgundy hover:bg-burgundy-light text-white"
                                    onClick={() => {}}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Vendor
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/vendors"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-burgundy transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Vendors
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center justify-center p-4 text-center border-r border-gray-100 last:border-r-0">
                                <Calendar className="w-6 h-6 text-burgundy mb-2" />
                                <span className="text-xl font-bold text-charcoal">{vendor.years_experience}+</span>
                                <span className="text-sm text-gray-500">Years Experience</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 text-center border-r border-gray-100 last:border-r-0">
                                <Heart className="w-6 h-6 text-burgundy mb-2" />
                                <span className="text-xl font-bold text-charcoal">{vendor.weddings_done}+</span>
                                <span className="text-sm text-gray-500">Weddings Done</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 text-center border-r border-gray-100 last:border-r-0">
                                <Users className="w-6 h-6 text-burgundy mb-2" />
                                <span className="text-xl font-bold text-charcoal">{vendor.staff_members}</span>
                                <span className="text-sm text-gray-500">Staff Members</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                <Award className="w-6 h-6 text-burgundy mb-2" />
                                <span className="text-xl font-bold text-charcoal">{vendor.awards_won}</span>
                                <span className="text-sm text-gray-500">Awards Won</span>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-charcoal mb-4">About Illume Photography</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {vendor.description}
                            </p>
                        </div>

                        {/* Services Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-charcoal mb-6">Our Services</h2>
                            <div className="space-y-4">
                                {vendor.services.map((service, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedService(expandedService === index ? null : index)}
                                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="font-medium text-charcoal">{service.title}</span>
                                            {expandedService === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                        {expandedService === index && (
                                            <div className="px-4 py-3 bg-white border-t border-gray-200">
                                                <p className="text-gray-600">{service.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio Gallery */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-charcoal">Portfolio Gallery</h2>
                                <Link href="#" className="text-burgundy hover:text-burgundy-light font-medium flex items-center gap-1">
                                    View All {vendor.portfolio_images.length + 138} Images
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <img
                                        src={vendor.portfolio_images[0]}
                                        alt="Portfolio 1"
                                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                                    />
                                </div>
                                <div>
                                    <img
                                        src={vendor.portfolio_images[1]}
                                        alt="Portfolio 2"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                                <div>
                                    <img
                                        src={vendor.portfolio_images[2]}
                                        alt="Portfolio 3"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Tiers Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-charcoal mb-6">Pricing Tiers</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {vendor.pricing_tiers.map((tier, index) => (
                                    <div key={index} className={`border rounded-2xl p-6 ${tier.popular ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'}`}>
                                        {tier.popular && (
                                            <div className="bg-burgundy text-white text-sm font-medium py-1 px-3 rounded-full text-center mb-4">
                                                Most Popular
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-charcoal mb-2">{tier.name}</h3>
                                        <div className="text-2xl font-bold text-burgundy mb-4">{tier.price}</div>
                                        <ul className="space-y-3 mb-6">
                                            {tier.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                                            Select Package
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-sand/30 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    Prices are indicative. Final quotes depend on travel requirements and custom add-ons.
                                </p>
                            </div>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-xl font-semibold text-charcoal">{vendor.rating}</span>
                                    <span className="text-gray-600">Average Rating</span>
                                </div>
                                <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                    Write a Review
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {vendor.customer_reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="font-semibold text-charcoal">{review.name}</div>
                                                <div className="text-sm text-gray-500">{review.date}</div>
                                            </div>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{review.comment}</p>
                                        {review.vendor_response && (
                                            <div className="bg-sand/50 rounded-lg p-4 border-l-4 border-burgundy">
                                                <div className="text-sm font-semibold text-burgundy mb-1">Illume Photography Response</div>
                                                <p className="text-gray-700 text-sm">{review.vendor_response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            {/* Pricing & Availability */}
                            <div className="mb-6">
                                <div className="text-2xl font-bold text-charcoal mb-2">
                                    Starting from {vendor.price_range}
                                </div>
                                <div className="text-sm text-orange-600 font-medium mb-4">
                                    Availability is filling up fast for Dec 2024!
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-3">Select Event Date</h3>
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                        <div key={index} className="text-xs font-medium text-gray-500 py-2">
                                            {day}
                                        </div>
                                    ))}
                                    {[...Array(31)].map((_, index) => {
                                        const day = index + 1;
                                        const isBooked = [25, 26].includes(day);
                                        const isSelected = selectedDate === day;
                                        
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => !isBooked && setSelectedDate(isSelected ? null : day)}
                                                disabled={isBooked}
                                                className={`
                                                    py-2 text-sm rounded transition-colors
                                                    ${isBooked 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : isSelected 
                                                        ? 'bg-burgundy text-white' 
                                                        : 'hover:bg-burgundy hover:text-white'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-6">
                                <Button 
                                    className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                                    onClick={() => {}}
                                >
                                    Book Now
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                                    onClick={() => {}}
                                >
                                    Request Custom Quote
                                </Button>
                            </div>

                            {/* Response Time */}
                            <div className="text-center text-sm text-gray-600 mb-6">
                                Response time: ~2 hours
                            </div>

                            {/* Chat Section */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="text-center mb-4">
                                    <MessageCircle className="w-8 h-8 text-burgundy mx-auto mb-2" />
                                    <h3 className="text-lg font-semibold text-charcoal mb-2">Have Questions?</h3>
                                    <p className="text-sm text-gray-600">
                                        Chat directly with Illume team about your specific needs.
                                    </p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                                    onClick={() => {}}
                                >
                                    Message Vendor
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
