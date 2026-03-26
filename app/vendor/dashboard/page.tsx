'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import {
  DollarSign, Calendar, Star, TrendingUp, TrendingDown,
  Plus, CheckCircle, Clock, XCircle, Package,
  ArrowRight, Eye, AlertCircle, Loader2, CalendarDays,
} from 'lucide-react';

interface DashboardData {
  vendor: { businessName: string; rating: number; reviewCount: number; verified: boolean };
  stats: {
    totalRevenue: number; thisMonthRevenue: number; revenueChange: number | null;
    pendingBookings: number; confirmedBookings: number; bookingChange: number | null;
    totalBookings: number; activeServices: number; pendingTours: number; pendingQuotes: number;
    avgRating: number; reviewCount: number;
  };
  monthlyRevenue: { label: string; revenue: number; count: number }[];
  statusBreakdown: { pending: number; confirmed: number; completed: number; cancelled: number };
  upcomingBookings: any[];
  recentBookings: any[];
  profileScore: number;
  profileTips: string[];
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString();
}

function ChangeChip({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-gray-400">No prior data</span>;
  const up = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{value}% vs last month
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-500',
    pending: 'bg-yellow-400',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-gray-400'}`} />;
}

function RevenueChart({ months, max }: { months: { label: string; revenue: number; count: number }[]; max: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Compute 4 evenly-spaced Y-axis ticks from 0 to max
  const rawStep = max / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = Math.ceil(rawStep / magnitude) * magnitude;
  const ticks = Array.from({ length: 5 }, (_, i) => i * step); // 0, step, 2*step, 3*step, 4*step
  const chartMax = ticks[4];

  return (
    <div className="flex gap-3 mt-2">
      {/* Y-axis */}
      <div className="flex flex-col justify-between items-end pb-6" style={{ minWidth: 44 }}>
        {[...ticks].reverse().map(t => (
          <span key={t} className="text-[10px] text-gray-400 leading-none">{fmt(t)}</span>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 relative">
        {/* Horizontal gridlines */}
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
          {ticks.map(t => (
            <div key={t} className="w-full border-t border-gray-100" />
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1.5 h-full pb-6">
          {months.map((m, i) => {
            const pct = chartMax > 0 ? (m.revenue / chartMax) * 100 : 0;
            const isCurrent = i === months.length - 1;
            const isHovered = hovered === i;
            return (
              <div
                key={m.label}
                className="flex-1 flex flex-col items-center gap-1 relative group cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-charcoal text-white rounded-lg px-3 py-2 z-20 shadow-lg pointer-events-none" style={{ minWidth: 120 }}>
                    <p className="text-[11px] font-semibold whitespace-nowrap">{m.label}</p>
                    <p className="text-xs font-bold whitespace-nowrap mt-0.5">
                      {m.revenue > 0 ? `${fmt(m.revenue)} RWF` : 'No revenue'}
                    </p>
                    <p className="text-[10px] text-gray-300 whitespace-nowrap">
                      {m.count} booking{m.count !== 1 ? 's' : ''}
                    </p>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal" />
                  </div>
                )}

                {/* Bar */}
                <div className="w-full flex items-end" style={{ height: 160 }}>
                  {m.revenue > 0 ? (
                    <div
                      className={`w-full rounded-t-md transition-all duration-200 ${
                        isCurrent
                          ? isHovered ? 'bg-burgundy' : 'bg-burgundy/80'
                          : isHovered ? 'bg-burgundy/60' : 'bg-burgundy/25'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  ) : (
                    <div className="w-full rounded-t-sm bg-gray-100" style={{ height: 3 }} />
                  )}
                </div>

                <span className={`text-[11px] leading-none ${
                  isCurrent ? 'text-burgundy font-semibold' : 'text-gray-400'
                }`}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting('Good afternoon');
    else if (h >= 17) setGreeting('Good evening');

    fetch('/api/vendor/dashboard')
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          console.error('Dashboard error:', d.error);
          return;
        }
        setData(d);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <VendorPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
        </div>
      </VendorPageLayout>
    );
  }

  if (!data) {
    return (
      <VendorPageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500">Unable to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="bg-burgundy hover:bg-burgundy/90 text-white">
            Retry
          </Button>
        </div>
      </VendorPageLayout>
    );
  }

  const { vendor, stats, monthlyRevenue = [], statusBreakdown, upcomingBookings, recentBookings, profileScore, profileTips } = data;
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 0);
  const today = new Date();

  return (
    <VendorPageLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">
              {greeting}, {vendor.businessName}!
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {vendor.verified && (
              <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                <CheckCircle className="w-3 h-3" /> Verified
              </Badge>
            )}
            {stats.pendingTours > 0 && (
              <Link href="/vendor/bookings?tab=tours">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1 cursor-pointer">
                  <AlertCircle className="w-3 h-3" /> {stats.pendingTours} tour {stats.pendingTours === 1 ? 'request' : 'requests'}
                </Badge>
              </Link>
            )}
            <Link href="/vendor/bookings">
              <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Pending Quotes Alert */}
        {stats.pendingQuotes > 0 && (
          <Link href="/vendor/bookings?tab=quotes">
            <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800">
                  {stats.pendingQuotes} venue quote {stats.pendingQuotes === 1 ? 'request' : 'requests'} awaiting your response
                </p>
                <p className="text-xs text-yellow-600 mt-0.5">Review and accept or decline from the Quote Requests tab</p>
              </div>
              <ArrowRight className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-charcoal mb-1">
                {stats.totalRevenue > 0 ? `${fmt(stats.totalRevenue)} RWF` : '—'}
              </p>
              <ChangeChip value={stats.revenueChange} />
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <div className="w-9 h-9 bg-burgundy/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-burgundy" />
                </div>
              </div>
              <p className="text-2xl font-bold text-charcoal mb-1">{stats.totalBookings}</p>
              <span className="text-xs text-yellow-600 font-medium">{stats.pendingBookings} pending</span>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500">Active Services</p>
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-charcoal mb-1">{stats.activeServices}</p>
              <Link href="/vendor/services" className="text-xs text-blue-600 hover:underline">Manage services →</Link>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500">Avg. Rating</p>
                <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-charcoal mb-1">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
              </p>
              <span className="text-xs text-gray-400">{stats.reviewCount} review{stats.reviewCount !== 1 ? 's' : ''}</span>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Profile Score */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-gray-100 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-charcoal">Revenue Overview</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Last 6 months · confirmed &amp; completed bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-burgundy leading-none">
                    {stats.thisMonthRevenue > 0 ? `${fmt(stats.thisMonthRevenue)} RWF` : '—'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">this month</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-5 px-5">
              {maxRevenue === 0 ? (
                <div className="h-52 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <TrendingUp className="w-10 h-10 text-gray-200" />
                  <p className="text-sm">Revenue will appear once you have confirmed bookings</p>
                </div>
              ) : (
                <RevenueChart months={monthlyRevenue} max={maxRevenue} />
              )}

              {/* Status breakdown pills */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {[
                  { label: 'Pending', value: statusBreakdown.pending, color: 'bg-yellow-100 text-yellow-700' },
                  { label: 'Confirmed', value: statusBreakdown.confirmed, color: 'bg-green-100 text-green-700' },
                  { label: 'Completed', value: statusBreakdown.completed, color: 'bg-blue-100 text-blue-700' },
                  { label: 'Cancelled', value: statusBreakdown.cancelled, color: 'bg-red-100 text-red-600' },
                ].map(s => (
                  <span key={s.label} className={`px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                    {s.value} {s.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Score */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-charcoal">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center py-2">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={profileScore >= 80 ? '#16a34a' : profileScore >= 50 ? '#8B3A3A' : '#f59e0b'}
                      strokeWidth="10"
                      strokeDasharray={`${profileScore * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-charcoal">{profileScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {profileScore === 100 ? 'Profile complete!' : profileScore >= 80 ? 'Almost there!' : 'Improve your profile'}
                </p>
              </div>

              {profileTips.length > 0 && (
                <div className="space-y-2">
                  {profileTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              )}

              <Link href="/vendor/profile">
                <Button className="w-full bg-burgundy hover:bg-burgundy/90 text-white text-sm mt-2">
                  {profileScore === 100 ? 'View Profile' : 'Complete Profile'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings + Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Upcoming Bookings */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-charcoal">Upcoming Events</CardTitle>
                <Link href="/vendor/calendar">
                  <Button variant="ghost" size="sm" className="text-burgundy text-xs gap-1">
                    Calendar <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <CalendarDays className="w-10 h-10 text-gray-200" />
                  <p className="text-sm">No upcoming events</p>
                  <Link href="/vendor/bookings">
                    <Button variant="outline" size="sm" className="mt-1 text-xs">Add a booking</Button>
                  </Link>
                </div>
              ) : (
                upcomingBookings.map((b, i) => {
                  const date = new Date(b.eventDate);
                  const daysLeft = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-sand/20 transition-colors">
                      <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-burgundy uppercase">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-burgundy leading-none">{date.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm truncate">{b.clientName || 'Client'}</p>
                        <p className="text-xs text-gray-500 truncate">{b.eventType || 'Event'}{b.servicePackage ? ` · ${b.servicePackage}` : ''}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <StatusDot status={b.status} />
                        <p className="text-xs text-gray-400 mt-1">
                          {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-charcoal">Recent Bookings</CardTitle>
                <Link href="/vendor/bookings">
                  <Button variant="ghost" size="sm" className="text-burgundy text-xs gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <Calendar className="w-10 h-10 text-gray-200" />
                  <p className="text-sm">No bookings yet</p>
                </div>
              ) : (
                recentBookings.map((b, i) => {
                  const statusStyles: Record<string, string> = {
                    confirmed: 'bg-green-100 text-green-700',
                    pending: 'bg-yellow-100 text-yellow-700',
                    completed: 'bg-blue-100 text-blue-700',
                    cancelled: 'bg-red-100 text-red-600',
                  };
                  const StatusIcon = b.status === 'confirmed' ? CheckCircle
                    : b.status === 'pending' ? Clock
                    : b.status === 'completed' ? Eye
                    : XCircle;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-burgundy">
                          {(b.clientName || 'C')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal text-sm truncate">{b.clientName || 'Client'}</p>
                        <p className="text-xs text-gray-400">
                          {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyles[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          <StatusIcon className="w-3 h-3" />
                          {b.status}
                        </span>
                        {b.totalAmount ? (
                          <span className="text-xs text-gray-500">{fmt(b.totalAmount)} RWF</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-charcoal">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'New Booking', desc: 'Add a client booking', icon: Plus, href: '/vendor/bookings', color: 'bg-burgundy/10 text-burgundy' },
                { label: 'Add Service', desc: 'Create a new package', icon: Package, href: '/vendor/services', color: 'bg-blue-50 text-blue-600' },
                { label: 'View Calendar', desc: 'Manage availability', icon: CalendarDays, href: '/vendor/calendar', color: 'bg-green-50 text-green-600' },
                { label: 'Edit Profile', desc: 'Update your listing', icon: Eye, href: '/vendor/profile', color: 'bg-yellow-50 text-yellow-600' },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <Link key={a.label} href={a.href}>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-burgundy/30 hover:bg-sand/10 transition-all cursor-pointer group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${a.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal text-sm group-hover:text-burgundy transition-colors">{a.label}</p>
                        <p className="text-xs text-gray-400 truncate">{a.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </VendorPageLayout>
  );
}
