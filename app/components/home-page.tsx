"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createPageUrl } from "../utils";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import {
    Heart,
    Search,
    Calendar,
    Users,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Star,
    LayoutDashboard
} from "lucide-react";

import { ExploreIcon, PlanIcon, MatchIcon, ManageIcon } from "./animated-icons";

// Staggered letter animation variant
const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
};

const wordVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

export default function HomePage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const controls = useAnimation();

    useEffect(() => {
        let isMounted = true;

        const animateText = async () => {
            // Initial start
            if (isMounted) await controls.start("visible");

            // Loop
            while (isMounted) {
                // Wait for 5 seconds reading time
                await new Promise(resolve => setTimeout(resolve, 5000));

                if (!isMounted) break;

                // Fade out gently
                await controls.start("hidden");

                // Short pause before restart
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!isMounted) break;

                // Stagger reveal again
                await controls.start("visible");
            }
        };

        animateText();

        return () => {
            isMounted = false;
            controls.stop();
        };
    }, [controls]);

    return (
        <div className="min-h-screen bg-cream bg-noise selection:bg-burgundy selection:text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:min-h-screen flex items-center overflow-hidden">

                {/* Background Animated Blobs (Organic Feel) */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold/10 rounded-full mix-blend-multiply blur-3xl opacity-70"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-burgundy/5 rounded-full mix-blend-multiply blur-3xl opacity-70"
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -30, 0],
                            y: [0, 50, 0]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-sand/30 rounded-full mix-blend-multiply blur-3xl opacity-50"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Text Content */}
                        <motion.div
                            className="order-2 lg:order-1 relative z-20"
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="flex items-center gap-2 mb-8"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <span className="h-px w-8 bg-burgundy"></span>
                                <span className="text-burgundy text-sm font-bold tracking-[0.2em] uppercase">
                                    Rwanda's Premier Wedding Platform
                                </span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-charcoal leading-[1.05] mb-8 min-h-[300px] md:min-h-[auto]">
                                <motion.span className="block italic font-light" variants={wordVariants} initial="hidden" animate={controls}>
                                    {"Plan Your".split("").map((char, i) => (
                                        <motion.span key={i} variants={letterVariants} className="inline-block">{char === " " ? "\u00A0" : char}</motion.span>
                                    ))}
                                </motion.span>
                                <motion.span className="block text-burgundy" variants={wordVariants} initial="hidden" animate={controls}>
                                    {"Dream Wedding".split("").map((char, i) => (
                                        <motion.span key={i} variants={letterVariants} className="inline-block">{char === " " ? "\u00A0" : char}</motion.span>
                                    ))}
                                </motion.span>
                                <motion.span className="block font-light" variants={wordVariants} initial="hidden" animate={controls}>
                                    {"With Ease".split("").map((char, i) => (
                                        <motion.span key={i} variants={letterVariants} className="inline-block">{char === " " ? "\u00A0" : char}</motion.span>
                                    ))}
                                </motion.span>
                            </h1>

                            <motion.p
                                className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-light"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                Explore top venues, book trusted vendors, and manage your entire wedding plan in one place. Simple, stress-free, and purely magical.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                <Link
                                    href={createPageUrl("PlanBuilder")}
                                    className="bg-burgundy text-white px-10 py-5 rounded-full font-medium hover:bg-burgundy-light transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm tracking-widest uppercase text-center relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Start Planning</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </Link>
                                <Link
                                    href={createPageUrl("Venues")}
                                    className="group bg-white border border-gray-200 text-charcoal px-10 py-5 rounded-full font-medium hover:border-burgundy/30 transition-all shadow-sm hover:shadow-md text-sm tracking-widest uppercase text-center flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    <Search className="w-4 h-4 text-gray-400 group-hover:text-burgundy transition-colors relative z-10" />
                                    <span className="relative z-10">Browse Venues</span>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Animated Image Composition */}
                        <div className="order-1 lg:order-2 relative h-[600px] w-full hidden md:block perspective-1000">
                            {/* Floating Elements Animation Container */}
                            <motion.div style={{ y: y1 }} className="absolute right-0 top-10 w-[70%] z-20">
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop"
                                        alt="Wedding Couple"
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div style={{ y: y2 }} className="absolute left-0 bottom-20 w-[55%] z-30">
                                <motion.div
                                    animate={{
                                        y: [0, 30, 0],
                                        x: [0, 10, 0],
                                        rotate: [0, -2, 0]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                    className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop"
                                        alt="Wedding Details"
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Decorative Floating Icons */}
                            <motion.div
                                className="absolute right-[20%] top-[10%] text-gold z-10"
                                animate={{ y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-12 h-12" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 bg-white relative z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative">
                    <motion.div
                        className="text-center mb-24"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-burgundy text-xs font-bold tracking-[0.2em] uppercase bg-burgundy/5 px-4 py-2 rounded-full border border-burgundy/10">
                            The Process
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mt-8 mb-6">
                            Your Journey to Forever
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
                            We've simplified the complex task of wedding planning into four seamless steps.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8 lg:gap-12 relative">
                        {/* Connecting Line (Desktop) - Animated */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-[2px] bg-gray-100 -z-10 overflow-hidden">
                            <motion.div
                                className="w-full h-full bg-gradient-to-r from-transparent via-burgundy/30 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {[
                            {
                                Icon: ExploreIcon,
                                title: "Explore",
                                desc: "Discover Rwanda's finest venues and elite vendors.",
                                color: "text-blue-600",
                                bg: "bg-blue-50"
                            },
                            {
                                Icon: PlanIcon,
                                title: "Build Plan",
                                desc: "Set your budget, dates, and guest list in minutes.",
                                color: "text-purple-600",
                                bg: "bg-purple-50"
                            },
                            {
                                Icon: MatchIcon,
                                title: "Get Matched",
                                desc: "AI-powered recommendations tailored to your style.",
                                color: "text-amber-600",
                                bg: "bg-amber-50"
                            },
                            {
                                Icon: ManageIcon,
                                title: "Manage",
                                desc: "Track tasks, payments, and bookings in one dashboard.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-50"
                            }
                        ].map((step, idx) => {
                            const { Icon } = step;
                            return (
                                <motion.div
                                    key={idx}
                                    className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                                    whileHover={{ y: -12, scale: 1.02 }}
                                >
                                    {/* Hover Gradient Border Effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-burgundy/0 to-gold/0 group-hover:from-burgundy/5 group-hover:to-gold/5 transition-all duration-500 pointer-events-none" />

                                    {/* Step Number Badge */}
                                    <div className="absolute top-4 right-4 text-6xl font-serif text-gray-50 opacity-0 group-hover:opacity-100 group-hover:text-gray-100 transition-all duration-500 select-none pointer-events-none translate-y-4 group-hover:translate-y-0">
                                        0{idx + 1}
                                    </div>

                                    <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mb-8 mx-auto relative overflow-hidden group-hover:rotate-3 transition-transform duration-500`}>
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-current ${step.color}`} />
                                        <Icon className={`w-12 h-12 ${step.color} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
                                    </div>

                                    <div className="text-center relative z-10">
                                        <h3 className="text-2xl font-serif text-charcoal mb-4 group-hover:text-burgundy transition-colors duration-300">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-600">
                                            {step.desc}
                                        </p>
                                    </div>

                                    {/* Bottom color bar */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${step.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Vendor Categories Section */}
            <section className="py-24 bg-sand/20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
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
                        </motion.div>
                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Venues", img: "https://images.unsplash.com/photo-1519167758481-83f29da8c525?w=500&h=500&fit=crop" },
                            { name: "Photographers", img: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=500&h=500&fit=crop" },
                            { name: "Decor & Floral", img: "https://images.unsplash.com/photo-1505963507340-e554b3d8753d?w=500&h=500&fit=crop" },
                            { name: "Catering", img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=500&fit=crop" },
                            { name: "Planners", img: "https://images.unsplash.com/photo-1550995123-08092780655d?w=500&h=500&fit=crop" },
                            { name: "Entertainment", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop" },
                            { name: "Transport", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop" },
                            { name: "Attire", img: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&h=500&fit=crop" }
                        ].map((cat, idx) => (
                            <Link key={idx} href={createPageUrl(cat.name === 'Venues' ? 'VenueMarketplace' : 'Vendors')}>
                                <motion.div
                                    className="group relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-xl transition-all"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-serif text-lg font-medium">{cat.name}</h3>
                                    </div>
                                </motion.div>
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
                                <motion.img
                                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=1000&fit=crop"
                                    alt="Interior"
                                    className="rounded-lg object-cover h-96 w-full -mt-8 shadow-lg"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                />
                                <motion.img
                                    src="https://images.unsplash.com/photo-1532277627-2c9c749eb403?w=800&h=1000&fit=crop"
                                    alt="Flowers"
                                    className="rounded-lg object-cover h-96 w-full mt-8 shadow-lg"
                                    initial={{ opacity: 0, y: -30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
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
                                        <motion.div
                                            key={idx}
                                            className="flex gap-4"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (idx * 0.2) }}
                                        >
                                            <div className="mt-1">
                                                <CheckCircle className="w-6 h-6 text-burgundy" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-serif text-charcoal font-medium mb-1">{item.title}</h4>
                                                <p className="text-gray-600 font-light text-sm">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-burgundy relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl mix-blend-overlay" />

                <motion.div
                    className="max-w-3xl mx-auto px-4 text-center relative z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-white/80 mb-10 font-light text-lg">
                        Join thousands of couples who have planned their perfect Rwandan wedding with Weds360.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={createPageUrl("PlanBuilder")}
                            className="bg-white text-burgundy px-10 py-4 rounded-md font-medium hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl text-sm tracking-widest uppercase inline-block hover:scale-105 active:scale-95 duration-300"
                        >
                            Create Your Plan
                        </Link>
                        <Link
                            href={createPageUrl("Venues")}
                            className="bg-transparent border border-white text-white px-10 py-4 rounded-md font-medium hover:bg-white/10 transition-all shadow-xl text-sm tracking-widest uppercase inline-block hover:scale-105 active:scale-95 duration-300"
                        >
                            Explore Venues
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
