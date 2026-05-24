"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Calendar, Heart, DollarSign, CheckCircle, TrendingUp, Plus, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  daysUntilWedding: number;
  planningProgress: number;
  budgetUsage: number;
  totalBookings: number;
  totalSpent: number;
  totalBudget: number;
  favoritesCount: number;
  venueToursCount: number;
  weddingDate: string | null;
  coupleNames: string | null;
  guestCount: number;
}

interface RecentBooking {
  id: string;
  serviceType: string;
  servicePackage: string;
  status: string;
  totalAmount: number;
  vendorName: string;
}

interface Task {
  id: string;
  title: string;
  timeline: string;
  completed: boolean;
  custom: boolean;
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes, tasksRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-bookings'),
          fetch('/api/dashboard/tasks')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          // Get only incomplete tasks, limit to 4
          const incompleteTasks = tasksData.filter((task: Task) => !task.completed).slice(0, 4);
          setUpcomingTasks(incompleteTasks);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </UserPageLayout>
    );
  }

  if (!stats) {
    return (
      <UserPageLayout>
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-600">Failed to load dashboard data. Please try again.</p>
        </div>
      </UserPageLayout>
    );
  }

  const dashboardStats = [
    { label: 'Days Until Wedding', value: stats.daysUntilWedding.toString(), icon: Calendar, color: 'text-burgundy' },
    { label: 'Planning Progress', value: `${stats.planningProgress}%`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Budget Used', value: `${stats.budgetUsage}%`, icon: DollarSign, color: 'text-blue-600' },
    { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: CheckCircle, color: 'text-purple-600' },
  ];

  const quickActions = [
    { title: 'Browse Venues', icon: MapPin, href: '/venues', color: 'bg-burgundy' },
    { title: 'Find Vendors', icon: Star, href: '/vendors', color: 'bg-gold' },
    { title: 'Wedding Settings', icon: Calendar, href: '/dashboard/wedding-settings', color: 'bg-purple-600' },
  ];

  return (
    <UserPageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal mb-2">
            Welcome Back{stats.coupleNames ? `, ${stats.coupleNames}` : ''}!
          </h1>
          {stats.weddingDate ? (
            <p className="text-sm sm:text-base text-gray-600">
              Your wedding is on {new Date(stats.weddingDate).toLocaleDateString()} - {stats.daysUntilWedding} days to go!
              <Link href="/dashboard/wedding-settings" className="ml-2 text-burgundy hover:underline text-sm">
                (Edit)
              </Link>
            </p>
          ) : (
            <p className="text-sm sm:text-base text-gray-600">
              <Link href="/dashboard/wedding-settings" className="text-burgundy hover:underline">
                Set your wedding date
              </Link> to see countdown and planning timeline.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-gray-100 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-charcoal">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Discover section — always visible ── */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          <Link href="/venues">
            <div className="group relative overflow-hidden rounded-xl border border-burgundy/20 bg-gradient-to-br from-burgundy/5 to-burgundy/10 hover:from-burgundy/10 hover:to-burgundy/20 transition-all duration-200 p-5 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-burgundy uppercase tracking-wide">Venues</span>
                  </div>
                  <p className="text-base font-bold text-charcoal mt-2">Browse Venues</p>
                  <p className="text-xs text-gray-500 mt-0.5">Find the perfect venue for your big day</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-burgundy/10 group-hover:bg-burgundy/20 flex items-center justify-center transition-colors flex-shrink-0">
                  <span className="text-burgundy text-lg font-bold leading-none">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/vendors">
            <div className="group relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 hover:from-gold/10 hover:to-gold/20 transition-all duration-200 p-5 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Vendors</span>
                  </div>
                  <p className="text-base font-bold text-charcoal mt-2">Find Vendors</p>
                  <p className="text-xs text-gray-500 mt-0.5">Photographers, caterers, decorators & more</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors flex-shrink-0">
                  <span className="text-yellow-700 text-lg font-bold leading-none">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-charcoal mb-4">Wedding Countdown</h3>
              <div className="text-center py-6 sm:py-8 bg-gradient-to-br from-burgundy/10 to-gold/10 rounded-lg mb-4 sm:mb-6">
                <div className="text-4xl sm:text-6xl font-bold text-burgundy mb-2">{stats.daysUntilWedding}</div>
                <p className="text-sm sm:text-base text-gray-600">Days Until Your Big Day</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Planning Progress</span>
                    <span className="font-semibold text-charcoal">{stats.planningProgress}%</span>
                  </div>
                  <Progress value={stats.planningProgress} className="h-2" />
                </div>
                <p className="text-sm text-gray-600">
                  {stats.planningProgress < 50 ? "You're getting started! Keep up the momentum." :
                   stats.planningProgress < 80 ? "Great progress! You're on track." :
                   "Almost there! Your wedding is well planned."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-charcoal mb-4">Budget Summary</h3>
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl font-bold text-burgundy mb-1">
                  RWF {(stats.totalSpent / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  of RWF {(stats.totalBudget / 1000000).toFixed(1)}M {stats.totalBudget > 0 ? 'budgeted' : 'spent'}
                </p>
              </div>
              {stats.totalBudget > 0 && (
                <Progress value={stats.budgetUsage} className="mb-4" />
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold">RWF {(stats.totalSpent / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-semibold">{stats.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-semibold">{stats.favoritesCount}</span>
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

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-charcoal">Upcoming Tasks</h3>
                <Link href="/dashboard/checklist">
                  <Button variant="ghost" size="sm" className="text-burgundy">View all</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-sand/20 rounded-lg">
                      <input type="checkbox" className="w-5 h-5 text-burgundy rounded" disabled />
                      <div className="flex-1">
                        <p className="font-medium text-charcoal text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.timeline}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">All tasks completed! 🎉</p>
                )}
              </div>
              <Link href="/dashboard/checklist">
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-charcoal">Recent Bookings</h3>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="text-burgundy">View all</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-charcoal text-sm">{booking.vendorName || 'Unknown Vendor'}</p>
                          <p className="text-xs text-gray-600">{booking.serviceType}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-burgundy">
                        RWF {booking.totalAmount?.toLocaleString() || '0'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No bookings yet. Start planning your wedding!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-100 shadow-sm mt-4 sm:mt-6">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-charcoal mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href}>
                    <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-sand/20 rounded-lg hover:bg-sand/40 transition-colors text-left">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-charcoal">{action.title}</span>
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