"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Calendar, Heart, DollarSign, CheckCircle, TrendingUp, Plus, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const weddingDate = new Date('2024-12-15');
    const today = new Date();
    const daysUntil = Math.max(0, Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const stats = [
        { label: 'Days Until Wedding', value: daysUntil.toString(), icon: Calendar, color: 'text-burgundy' },
        { label: 'Planning Progress', value: '65%', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Budget Used', value: '45%', icon: DollarSign, color: 'text-blue-600' },
        { label: 'Tasks Complete', value: '12/24', icon: CheckCircle, color: 'text-purple-600' },
    ];

    const upcomingTasks = [
        { task: 'Finalize guest list', dueDate: 'Oct 30', priority: 'high' },
        { task: 'Book photographer', dueDate: 'Nov 5', priority: 'high' },
        { task: 'Order wedding cake', dueDate: 'Nov 15', priority: 'medium' },
        { task: 'Send invitations', dueDate: 'Nov 20', priority: 'medium' },
    ];

    const recentBookings = [
        { vendor: 'Kigali Serena Hotel', service: 'Venue', status: 'confirmed', amount: 'RWF 5,000,000' },
        { vendor: 'Pixel Perfect Photography', service: 'Photography', status: 'pending', amount: 'RWF 800,000' },
        { vendor: 'Bloom & Bliss Decor', service: 'Decoration', status: 'confirmed', amount: 'RWF 1,200,000' },
    ];

    const quickActions = [
        { title: 'Browse Venues', icon: MapPin, href: '/venues', color: 'bg-burgundy' },
        { title: 'Find Vendors', icon: Star, href: '/vendors', color: 'bg-gold' },
        { title: 'Add Task', icon: Plus, href: '/dashboard/checklist', color: 'bg-charcoal' },
    ];

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Welcome Back, Sarah & Michael!</h1>
                    <p className="text-gray-600">Your wedding is on December 15, 2024 - {daysUntil} days to go!</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                        <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center ${stat.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <Card className="lg:col-span-2 border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-charcoal mb-4">Wedding Countdown</h3>
                            <div className="text-center py-8 bg-gradient-to-br from-burgundy/10 to-gold/10 rounded-lg mb-6">
                                <div className="text-6xl font-bold text-burgundy mb-2">{daysUntil}</div>
                                <p className="text-gray-600">Days Until Your Big Day</p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Planning Progress</span>
                                        <span className="font-semibold text-charcoal">65%</span>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                </div>
                                <p className="text-sm text-gray-600">You're making great progress! Keep up the momentum.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-charcoal mb-4">Budget Summary</h3>
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-burgundy mb-1">RWF 7M</div>
                                <p className="text-sm text-gray-600">of RWF 15M spent</p>
                            </div>
                            <Progress value={45} className="mb-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Venue</span>
                                    <span className="font-semibold">RWF 5M</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Decoration</span>
                                    <span className="font-semibold">RWF 1.2M</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Photography</span>
                                    <span className="font-semibold">RWF 800K</span>
                                </div>
                            </div>
                            <Link href="/dashboard/budget">
                                <Button variant="outline" className="w-full mt-4 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                                    View Full Budget
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-charcoal">Upcoming Tasks</h3>
                                <Link href="/dashboard/checklist">
                                    <Button variant="ghost" size="sm" className="text-burgundy">View all</Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {upcomingTasks.map((task, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-sand/20 rounded-lg">
                                        <input type="checkbox" className="w-5 h-5 text-burgundy rounded" />
                                        <div className="flex-1">
                                            <p className="font-medium text-charcoal text-sm">{task.task}</p>
                                            <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/dashboard/checklist">
                                <Button variant="outline" className="w-full mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Task
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-charcoal">Recent Bookings</h3>
                                <Link href="/dashboard/bookings">
                                    <Button variant="ghost" size="sm" className="text-burgundy">View all</Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentBookings.map((booking, i) => (
                                    <div key={i} className="p-3 border border-gray-100 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-charcoal text-sm">{booking.vendor}</p>
                                                <p className="text-xs text-gray-600">{booking.service}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-burgundy">{booking.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-100 shadow-sm mt-6">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Actions</h3>
                        <div className="grid md:grid-cols-3 gap-3">
                            {quickActions.map((action, i) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={i} href={action.href}>
                                        <button className="w-full flex items-center gap-3 p-4 bg-sand/20 rounded-lg hover:bg-sand/40 transition-colors text-left">
                                            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-medium text-charcoal">{action.title}</span>
                                        </button>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserPageLayout>
    );
}
