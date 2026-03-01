import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '../utils';
import { Heart, Users, Award, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from "@/app/components/ui/button";

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'Passion for Perfection',
            description: 'We believe every wedding should be as unique and special as the love story it celebrates.'
        },
        {
            icon: Users,
            title: 'Personalized Service',
            description: 'Our dedicated team works closely with each couple to understand their vision and bring it to life.'
        },
        {
            icon: Award,
            title: 'Trusted Excellence',
            description: 'We partner only with the finest vendors who share our commitment to exceptional service.'
        },
        {
            icon: Sparkles,
            title: 'Stress-Free Planning',
            description: 'Our platform simplifies every step, letting you focus on what matters most - celebrating your love.'
        }
    ];

    const stats = [
        { number: '500+', label: 'Happy Couples' },
        { number: '200+', label: 'Trusted Vendors' },
        { number: '10+', label: 'Cities in Rwanda' },
        { number: '1000+', label: 'Successful Events' }
    ];

    const reasons = [
        'Curated selection of Rwanda\'s top-rated wedding professionals',
        'Personalized vendor matching based on your style and budget',
        'Real-time venue availability and instant booking',
        'Expert wedding planning guidance rooted in Rwandan traditions',
        'Transparent pricing in RWF with no hidden fees',
        'Dedicated support team available throughout your journey'
    ];

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-block bg-white/20 px-4 py-2 rounded-full mb-6">
                            <span className="text-white text-sm font-medium">About Andiza</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Turning Dream Weddings Into Reality
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            We're passionate about making wedding planning simple, enjoyable, and stress-free.
                            Your perfect day deserves perfect planning.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white bg-noise">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-serif text-charcoal mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Andiza was born from a simple observation: wedding planning in Rwanda shouldn't be overwhelming.
                                    Founded in 2024 by a team of wedding industry veterans and tech innovators, we set out
                                    to revolutionize how Rwandan couples plan their special day.
                                </p>
                                <p>
                                    We've been where you are - searching through countless vendor websites, juggling spreadsheets,
                                    and trying to coordinate dozens of moving pieces. That's why we created Rwanda's first
                                    comprehensive digital wedding platform that brings everything together in one beautiful, easy-to-use space.
                                </p>
                                <p>
                                    Today, we're proud to serve couples across Rwanda, from Kigali to Musanze, working
                                    with the country's most trusted wedding vendors. But our mission remains the same:
                                    to make every Rwandan couple's wedding planning journey as magical as their wedding day.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop"
                                alt="Wedding couple"
                                className="rounded-2xl shadow-xl"
                            />
                            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-sand rounded-full opacity-20 blur-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-cream bg-noise">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-serif text-burgundy mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white bg-noise">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-charcoal mb-4">
                            What We Stand For
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our values guide everything we do, from selecting vendors to designing our platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-burgundy" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#2C2C2C] mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-sand/20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"
                                alt="Wedding celebration"
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
                                Why Couples Choose Andiza
                            </h2>
                            <div className="space-y-4">
                                {reasons.map((reason, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
                                        <p className="text-gray-700">{reason}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Link href={createPageUrl('PlanBuilder')}>
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                        Start Planning Your Wedding
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-burgundy relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of couples who trusted us with their special day
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={createPageUrl('PlanBuilder')}>
                            <Button className="bg-white text-burgundy hover:bg-gray-50">
                                Create Your Wedding Plan
                            </Button>
                        </Link>
                        <Link href={createPageUrl('Contact')}>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
