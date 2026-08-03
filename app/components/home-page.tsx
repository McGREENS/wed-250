"use client";

import React, { useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createPageUrl } from "../utils";
import {
    Heart,
    ArrowRight,
    CheckCircle,
    LayoutDashboard
} from "lucide-react";

// Lazy-load animated icons (framer-motion is heavy — defer until after LCP)
const AnimatedIcons = lazy(() => import("./animated-icons-section"));

export default function HomePage() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const comingSoon = searchParams.get('coming-soon');
        if (comingSoon === 'venues') {
            toast.info('Venues marketplace coming soon! We\'re preparing amazing venues for you.', {
                duration: 5000,
            });
        } else if (comingSoon === 'vendors') {
            toast.info('Vendors marketplace coming soon! We\'re onboarding top vendors for you.', {
                duration: 5000,
            });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-cream bg-noise selection:bg-burgundy selection:text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:min-h-screen flex items-center overflow-hidden">

                {/* Background Static Blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold/10 rounded-full mix-blend-multiply blur-3xl opacity-70" />
                    <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-burgundy/5 rounded-full mix-blend-multiply blur-3xl opacity-70" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-sand/30 rounded-full mix-blend-multiply blur-3xl opacity-50" />
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Text Content */}
                        <div className="order-2 lg:order-1 relative z-20">
                            <div className="flex items-center gap-2 mb-8">
                                <span className="h-px w-8 bg-burgundy"></span>
                                <span className="text-burgundy text-sm font-bold tracking-[0.2em] uppercase">
                                    Rwanda's Premier Wedding Platform
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-charcoal leading-[1.05] mb-8">
                                <span className="block italic font-light">Plan Your</span>
                                <span className="block text-burgundy">Dream Wedding</span>
                                <span className="block font-light">With Ease</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-light">
                                Explore top venues, book trusted vendors, and manage your entire wedding plan in one place. Simple, stress-free, and purely magical.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link
                                    href="/signup"
                                    className="bg-burgundy text-white px-10 py-5 rounded-full font-medium hover:bg-burgundy-light transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm tracking-widest uppercase text-center relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        For Couples
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </Link>
                                <Link
                                    href="/signup"
                                    className="group bg-white border border-gray-200 text-charcoal px-10 py-5 rounded-full font-medium hover:border-burgundy/30 transition-all shadow-sm hover:shadow-md text-sm tracking-widest uppercase text-center flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-burgundy transition-colors relative z-10" />
                                    <span className="relative z-10">For Vendors</span>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image Composition — hidden on mobile so not the LCP candidate there.
                            priority ensures preload on desktop. */}
                        <div className="order-1 lg:order-2 relative h-[600px] w-full hidden md:block">
                            <div className="absolute right-0 top-10 w-[70%] z-20">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white">
                                    <Image
                                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop"
                                        alt="Wedding Couple"
                                        width={800}
                                        height={1000}
                                        priority
                                        className="w-full h-auto object-cover"
                                        sizes="(max-width: 1024px) 0px, 40vw"
                                    />
                                </div>
                            </div>

                            <div className="absolute left-0 bottom-20 w-[55%] z-30">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white">
                                    <Image
                                        src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop"
                                        alt="Wedding Details"
                                        width={600}
                                        height={800}
                                        priority
                                        className="w-full h-auto object-cover"
                                        sizes="(max-width: 1024px) 0px, 30vw"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section — animated icons lazy-loaded */}
            <section className="py-32 bg-white relative z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" aria-hidden="true"></div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative">
                    <div className="text-center mb-24">
                        <span className="text-burgundy text-xs font-bold tracking-[0.2em] uppercase bg-burgundy/5 px-4 py-2 rounded-full border border-burgundy/10">
                            The Process
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mt-8 mb-6">
                            Your Journey to Forever
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
                            We've simplified the complex task of wedding planning into four seamless steps.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
                            {[0,1,2,3].map(i => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg animate-pulse">
                                    <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-8" />
                                    <div className="h-6 bg-gray-100 rounded mx-auto w-24 mb-4" />
                                    <div className="h-4 bg-gray-50 rounded mx-auto w-40" />
                                </div>
                            ))}
                        </div>
                    }>
                        <AnimatedIcons />
                    </Suspense>
                </div>
            </section>

            {/* Vendor Categories Section */}
            <section className="py-24 bg-sand/20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
                        <div>
                            <span className="text-burgundy text-xs font-bold tracking-widest uppercase bg-white px-3 py-1 rounded-sm mb-6 inline-block">
                                Marketplace
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6 leading-tight">
                                Everything You Need <br />
                                <span className="italic text-gray-500">For Your Big Day</span>
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-8 max-w-lg">
                                From breathtaking venues to talented photographers, find all the professionals you need to bring your vision to life.
                            </p>
                            <Link href={createPageUrl("Vendors")} className="inline-flex items-center text-burgundy font-medium hover:text-burgundy-light transition-colors group">
                                View All Categories <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Venues", img: "/venues.jpg" },
                            { name: "Photographers", img: "/photography.jpg" },
                            { name: "Decor & Floral", img: "/decor.jpg" },
                            { name: "Catering", img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=500&fit=crop" },
                            { name: "Planners", img: "/planner.jpg" },
                            { name: "Entertainment", img: "/entertainment.jpg" },
                            { name: "Transport", img: "/traansport.jpg" },
                            { name: "Attire", img: "/attire.jpg" }
                        ].map((cat, idx) => (
                            <Link key={idx} href={createPageUrl(cat.name === 'Venues' ? 'VenueMarketplace' : 'Vendors')}>
                                <div className="group relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <Image
                                        src={cat.img}
                                        alt={cat.name}
                                        fill
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-serif text-lg font-medium">{cat.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-cream bg-noise">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative h-96 w-full -mt-8 rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=1000&fit=crop"
                                        alt="Wedding interior"
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 0px, 20vw"
                                    />
                                </div>
                                <div className="relative h-96 w-full mt-8 rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src="/wediing.jpg"
                                        alt="Wedding attire"
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 0px, 20vw"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div>
                                <span className="text-burgundy text-xs font-bold tracking-widest uppercase bg-burgundy/10 px-3 py-1 rounded-sm mb-6 inline-block">
                                    Why Weds360
                                </span>
                                <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
                                    Planning Made <br />
                                    <span className="italic text-gray-500">Simple & Beautiful</span>
                                </h2>

                                <div className="space-y-6">
                                    {[
                                        { title: "Filtered for Excellence", desc: "Every vendor on our platform is vetted for quality and reliability." },
                                        { title: "Budget Friendly", desc: "Transparent pricing and tools to help you stick to your financial plan." },
                                        { title: "One Dashboard", desc: "Manage quotes, messages, and bookings all in a single, easy-to-use interface." }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="mt-1">
                                                <CheckCircle className="w-6 h-6 text-burgundy" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-serif text-charcoal font-medium mb-1">{item.title}</h4>
                                                <p className="text-gray-600 font-light text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-burgundy relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" aria-hidden="true" />

                <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-white/80 mb-10 font-light text-lg">
                        Join thousands of couples who have planned their perfect Rwandan wedding with Andiza.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="bg-white text-burgundy px-10 py-4 rounded-md font-medium hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl text-sm tracking-widest uppercase inline-block hover:scale-105 active:scale-95 duration-300"
                        >
                            Get Started
                        </Link>
                        <Link
                            href={createPageUrl("Venues")}
                            className="bg-transparent border border-white text-white px-10 py-4 rounded-md font-medium hover:bg-white/10 transition-all shadow-xl text-sm tracking-widest uppercase inline-block hover:scale-105 active:scale-95 duration-300"
                        >
                            Explore Venues
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
