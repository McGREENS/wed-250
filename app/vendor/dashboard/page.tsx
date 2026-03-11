import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { DollarSign, Calendar, MessageSquare, Star, Eye, Plus, TrendingUp, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function VendorDashboardPage() {
    const session = await auth();
    
    if (!session?.user) {
        redirect('/login');
    }
    
    if (session.user.role !== 'VENDOR') {
        redirect('/dashboard');
    }

    const businessName = session.user.name || 'Vendor';
    const stats = [
        { label: 'Total Revenue', value: 'RWF 12,450,000', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
        { label: 'Pending Bookings', value: '8', change: '+2 new', icon: Calendar, color: 'text-burgundy' },
        { label: 'Profile Views', value: '2,841', change: '+4.3%', icon: Eye, color: 'text-blue-600' },
        { label: 'Avg. Rating', value: '4.92', change: '+0.05', icon: Star, color: 'text-yellow-600' },
    ];

    const upcomingWeddings = [
        { date: 'OCT 24', couple: 'Sarah & Michael', venue: 'The Grand Rose Ballroom', service: 'Photography & Videography', daysLeft: 5 },
        { date: 'NOV 02', couple: 'Emma & David', venue: 'Skyline Garden', service: 'Full Wedding Planning', daysLeft: 14 },
        { date: 'NOV 15', couple: 'Jessica & Robert', venue: 'Oceanfront Resort', service: 'Catering Services', daysLeft: 27 },
    ];

    const recentMessages = [
        { name: 'John Doe', message: 'Hi, do you have availability for...', time: '10m ago' },
        { name: 'Linda Smith', message: 'Just wanted to confirm the floral...', time: '2h ago' },
        { name: 'Alex K.', message: 'Could you send the contract for...', time: '5h ago' },
    ];

    const quickActions = [
        { title: 'Add New Service', description: 'List a new wedding package', icon: Plus },
        { title: 'Update Portfolio', description: 'Add photos from recent events', icon: ImageIcon },
        { title: 'Broadcast Post', description: 'Share an update with followers', icon: FileText },
    ];

    return (
        <VendorPageLayout>
            <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-charcoal mb-2">Good morning, {businessName}!</h1>
                            <p className="text-gray-600">Here's what's happening with your business today.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Oct 2024</span>
                            <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Booking
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
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
                                        <p className="text-2xl font-bold text-charcoal mb-1">{stat.value}</p>
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {stat.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        {/* Earnings Summary */}
                        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-charcoal">Earnings Summary</h3>
                                        <p className="text-sm text-gray-500">Monthly revenue vs booking volume</p>
                                    </div>
                                    <Button variant="outline" size="sm">Monthly View</Button>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                                        const height = [40, 60, 45, 75, 55, 80][i];
                                        return (
                                            <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-full bg-burgundy rounded-t-lg" style={{ height: `${height}%` }}></div>
                                                <span className="text-xs text-gray-500">{month}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Strength */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-4">Profile Strength</h3>
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-burgundy mb-2">85%</div>
                                    <p className="text-sm text-gray-600">Your profile is almost complete!</p>
                                </div>
                                <Progress value={85} className="mb-4" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <p className="text-gray-600">Add 3 more high-resolution photos to your portfolio.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <p className="text-gray-600">Respond to 2 unread reviews to boost visibility.</p>
                                    </div>
                                </div>
                                <Button className="w-full mt-4 bg-burgundy hover:bg-burgundy-light text-white">
                                    Complete Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Upcoming Weddings */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-charcoal">Upcoming Weddings</h3>
                                        <p className="text-sm text-gray-500">Your next 3 scheduled events</p>
                                    </div>
                                    <Button variant="outline" size="sm">View Calendar</Button>
                                </div>
                                <div className="space-y-3">
                                    {upcomingWeddings.map((wedding, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-sand/20 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-xs font-semibold text-burgundy">{wedding.date.split(' ')[0]}</div>
                                                <div className="text-2xl font-bold text-charcoal">{wedding.date.split(' ')[1]}</div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-charcoal">{wedding.couple}</p>
                                                <p className="text-sm text-gray-600">{wedding.venue}</p>
                                                <p className="text-xs text-gray-500 mt-1">{wedding.service}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-burgundy">In {wedding.daysLeft} days</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Event Reminder
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions & Messages */}
                        <div className="space-y-6">
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        {quickActions.map((action, i) => {
                                            const Icon = action.icon;
                                            return (
                                                <button key={i} className="w-full flex items-center gap-3 p-3 bg-sand/20 rounded-lg hover:bg-sand/40 transition-colors text-left">
                                                    <div className="w-10 h-10 bg-burgundy/10 rounded-lg flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-burgundy" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-charcoal">{action.title}</p>
                                                        <p className="text-xs text-gray-500">{action.description}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-charcoal">Recent Messages</h3>
                                        <Button variant="ghost" size="sm" className="text-burgundy">View all</Button>
                                    </div>
                                    <div className="space-y-3">
                                        {recentMessages.map((msg, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 hover:bg-sand/20 rounded-lg cursor-pointer transition-colors">
                                                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-burgundy">{msg.name[0]}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-charcoal text-sm">{msg.name}</p>
                                                    <p className="text-xs text-gray-600 truncate">{msg.message}</p>
                                                </div>
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
        </VendorPageLayout>
    );
}
