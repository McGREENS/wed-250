"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/app/utils';
import {
    Calendar,
    DollarSign,
    Users,
    CheckCircle,
    Heart,
    ArrowRight,
    Download,
    Sparkles,
    Clock,
    MapPin,
    Camera,
    Utensils,
    Music,
    Car,
    Shirt,
    Flower2,
    FileText,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Progress } from "@/app/components/ui/progress";

export default function PlanPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const budgetBreakdown = [
        { category: 'Venue', percentage: 40, amount: 4000, icon: MapPin, color: 'bg-burgundy' },
        { category: 'Catering', percentage: 20, amount: 2000, icon: Utensils, color: 'bg-gold' },
        { category: 'Photography', percentage: 15, amount: 1500, icon: Camera, color: 'bg-blue-500' },
        { category: 'Decor & Flowers', percentage: 10, amount: 1000, icon: Flower2, color: 'bg-pink-500' },
        { category: 'Entertainment', percentage: 8, amount: 800, icon: Music, color: 'bg-purple-500' },
        { category: 'Attire', percentage: 5, amount: 500, icon: Shirt, color: 'bg-green-500' },
        { category: 'Transport', percentage: 2, amount: 200, icon: Car, color: 'bg-orange-500' },
    ];

    const timeline = [
        {
            period: '12-18 Months Before',
            tasks: [
                'Set your budget and guest count',
                'Choose your wedding date',
                'Book your venue',
                'Hire wedding planner (optional)',
                'Start guest list'
            ]
        },
        {
            period: '9-11 Months Before',
            tasks: [
                'Book photographer and videographer',
                'Choose and book caterer',
                'Select wedding party',
                'Shop for wedding attire',
                'Book entertainment/DJ'
            ]
        },
        {
            period: '6-8 Months Before',
            tasks: [
                'Send save-the-dates',
                'Book florist and decorator',
                'Arrange transportation',
                'Book hair and makeup artists',
                'Plan honeymoon'
            ]
        },
        {
            period: '3-5 Months Before',
            tasks: [
                'Send wedding invitations',
                'Finalize menu and cake',
                'Purchase wedding rings',
                'Book accommodation for guests',
                'Confirm all vendor bookings'
            ]
        },
        {
            period: '1-2 Months Before',
            tasks: [
                'Final dress fitting',
                'Create seating chart',
                'Confirm final guest count',
                'Obtain marriage license',
                'Final vendor meetings'
            ]
        },
        {
            period: '1 Week Before',
            tasks: [
                'Pack for honeymoon',
                'Confirm timeline with vendors',
                'Rehearsal dinner',
                'Final payments',
                'Relax and enjoy!'
            ]
        }
    ];

    const resources = [
        { title: 'Wedding Budget Template', description: 'Excel spreadsheet to track all expenses', icon: FileText },
        { title: 'Guest List Manager', description: 'Organize RSVPs and dietary requirements', icon: Users },
        { title: 'Vendor Comparison Sheet', description: 'Compare quotes and services side-by-side', icon: TrendingUp },
        { title: 'Timeline Checklist', description: 'Month-by-month planning guide', icon: Calendar },
    ];

    const rwandanTraditions = [
        {
            title: 'Gusaba (Introduction Ceremony)',
            description: 'Traditional ceremony where the groom\'s family formally asks for the bride\'s hand'
        },
        {
            title: 'Inkwano (Dowry)',
            description: 'Exchange of gifts between families, symbolizing unity and respect'
        },
        {
            title: 'Traditional Attire',
            description: 'Couples often wear Imishanana (traditional Rwandan dress) during ceremonies'
        },
        {
            title: 'Umuganda Spirit',
            description: 'Community involvement in wedding preparations, reflecting Rwandan values'
        }
    ];

    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section */}
            <section className="relative bg-burgundy py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl" />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-block bg-white/10 px-4 py-2 rounded-full mb-6">
                            <span className="text-white text-sm font-medium">✨ Your Complete Planning Guide</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
                            Plan Your Dream Wedding
                        </h1>
                        <p className="text-xl text-white/90 mb-8">
                            Everything you need to plan the perfect Rwandan wedding, from budget to timeline
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={createPageUrl('PlanBuilder')}>
                                <Button className="bg-white text-burgundy hover:bg-gray-100 px-8 py-6 text-lg">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Planning Now
                                </Button>
                            </Link>
                            <Link href={createPageUrl('Dashboard')}>
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-white">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: Calendar, label: 'Planning Timeline', value: '12-18 Months', color: 'text-burgundy' },
                            { icon: DollarSign, label: 'Avg. Budget', value: '$10,000', color: 'text-gold' },
                            { icon: Users, label: 'Avg. Guest Count', value: '150-200', color: 'text-blue-600' },
                            { icon: CheckCircle, label: 'Tasks to Complete', value: '50+', color: 'text-green-600' },
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={idx} className="border-gray-100 shadow-lg">
                                    <CardContent className="p-6 text-center">
                                        <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                                        <p className="text-3xl font-bold text-charcoal mb-1">{stat.value}</p>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Tabs */}
            <section className="py-16">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="budget">Budget</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-8">
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif">Wedding Planning Essentials</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                title: 'Set Your Budget',
                                                description: 'Determine how much you can spend and allocate funds wisely',
                                                icon: DollarSign,
                                                link: '#budget'
                                            },
                                            {
                                                title: 'Create Timeline',
                                                description: 'Follow our month-by-month guide to stay organized',
                                                icon: Clock,
                                                link: '#timeline'
                                            },
                                            {
                                                title: 'Book Vendors',
                                                description: 'Secure your venue, photographer, and other key vendors',
                                                icon: CheckCircle,
                                                link: createPageUrl('Vendors')
                                            },
                                        ].map((item, idx) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={idx} className="p-6 bg-sand/20 rounded-xl hover:shadow-md transition-shadow">
                                                    <Icon className="w-10 h-10 text-burgundy mb-4" />
                                                    <h3 className="text-lg font-semibold text-charcoal mb-2">{item.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                                                    <a href={item.link} className="text-burgundy text-sm font-medium inline-flex items-center hover:underline">
                                                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Rwandan Traditions */}
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif">Rwandan Wedding Traditions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {rwandanTraditions.map((tradition, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <Heart className="w-6 h-6 text-burgundy flex-shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="font-semibold text-charcoal mb-1">{tradition.title}</h4>
                                                    <p className="text-sm text-gray-600">{tradition.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Budget Tab */}
                        <TabsContent value="budget" className="space-y-8">
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif">Recommended Budget Breakdown</CardTitle>
                                    <p className="text-gray-600">Based on a $10,000 wedding budget</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {budgetBreakdown.map((item, idx) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                                                                <Icon className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-medium text-charcoal">{item.category}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-charcoal">${item.amount.toLocaleString()}</p>
                                                            <p className="text-sm text-gray-500">{item.percentage}%</p>
                                                        </div>
                                                    </div>
                                                    <Progress value={item.percentage} className="h-2" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-8 p-6 bg-burgundy/5 rounded-xl">
                                        <h4 className="font-semibold text-charcoal mb-2">💡 Budget Tips</h4>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li>• Allocate 40-50% of budget to venue and catering</li>
                                            <li>• Set aside 10-15% for unexpected expenses</li>
                                            <li>• Book vendors early to secure better rates</li>
                                            <li>• Consider off-season dates for discounts</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Timeline Tab */}
                        <TabsContent value="timeline" className="space-y-6">
                            {timeline.map((phase, idx) => (
                                <Card key={idx} className="border-gray-100">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-serif flex items-center gap-3">
                                            <div className="w-10 h-10 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {idx + 1}
                                            </div>
                                            {phase.period}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {phase.tasks.map((task, taskIdx) => (
                                                <li key={taskIdx} className="flex items-start gap-3">
                                                    <CheckCircle className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        {/* Resources Tab */}
                        <TabsContent value="resources" className="space-y-8">
                            <Card className="border-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif">Downloadable Resources</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {resources.map((resource, idx) => {
                                            const Icon = resource.icon;
                                            return (
                                                <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                                                    <Icon className="w-10 h-10 text-burgundy mb-4" />
                                                    <h3 className="text-lg font-semibold text-charcoal mb-2">{resource.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                                                    <Button variant="outline" className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-100 bg-gradient-to-br from-burgundy to-burgundy-light text-white">
                                <CardContent className="p-8 text-center">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-2xl font-serif mb-3">Ready to Start Planning?</h3>
                                    <p className="text-white/90 mb-6">
                                        Create your personalized wedding plan and get matched with the best vendors
                                    </p>
                                    <Link href={createPageUrl('PlanBuilder')}>
                                        <Button className="bg-white text-burgundy hover:bg-gray-100 px-8 py-6">
                                            Create Your Wedding Plan
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
