'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
    totalRevenue: number; projectedRevenue: number; actualRevenue: number;
    thisMonthRevenue: number; thisMonthProjected: number; thisMonthActual: number;
    revenueChange: number | null; actualRevenueChange: number | null;
    pendingBookings: number; confirmedBookings: number; bookingChange: number | null;
    totalBookings: number; activeServices: number; pendingTours: number; pendingQuotes: number;
    avgRating: number; reviewCount: number;
  };
  monthlyRevenue: { label: string; revenue: number; actual: number; count: number }[];
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
  if (value === null) return <span className="text-xs text-charcoal/60">No prior data</span>;
  const up = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${
      up ? 'text-charcoal' : 'text-burgundy'
    }`}>
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

function RevenueChart({ months, max }: { months: { label: string; revenue: number; actual: number; count: number }[]; max: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const rawStep = max / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const step = Math.ceil((rawStep || 1) / magnitude) * magnitude;
  const ticks = Array.from({ length: 5 }, (_, i) => i * step);
  const chartMax = ticks[4] || 1;

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-burgundy/25 inline-block" />
          <span className="text-xs text-gray-500">Projected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-burgundy inline-block" />
          <span className="text-xs text-gray-500">Actual Received</span>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pb-6" style={{ minWidth: 44 }}>
          {[...ticks].reverse().map(t => (
            <span key={t} className="text-[10px] text-gray-400 leading-none">{fmt(t)}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative">
          {/* Gridlines */}
          <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
            {ticks.map(t => <div key={t} className="w-full border-t border-gray-100" />)}
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1.5 h-full pb-6">
            {months.map((m, i) => {
              const projPct  = chartMax > 0 ? (m.revenue / chartMax) * 100 : 0;
              const actPct   = chartMax > 0 ? (m.actual  / chartMax) * 100 : 0;
              const isCurrent = i === months.length - 1;
              const isHovered = hovered === i;
              return (
                <div
                  key={m.label}
                  className="flex-1 flex flex-col items-center gap-1 relative cursor-default"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-charcoal text-white rounded-lg px-3 py-2 z-20 shadow-lg pointer-events-none" style={{ minWidth: 148 }}>
                      <p className="text-[11px] font-semibold">{m.label}</p>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[11px] flex justify-between gap-3">
                          <span className="text-gray-300">Projected</span>
                          <span className="font-bold">{m.revenue > 0 ? `${fmt(m.revenue)} RWF` : '—'}</span>
                        </p>
                        <p className="text-[11px] flex justify-between gap-3">
                          <span className="text-gray-300">Received</span>
                          <span className="font-bold text-green-400">{m.actual > 0 ? `${fmt(m.actual)} RWF` : '—'}</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{m.count} booking{m.count !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal" />
                    </div>
                  )}

                  {/* Dual bars side by side */}
                  <div className="w-full flex items-end gap-0.5" style={{ height: 160 }}>
                    {/* Projected bar */}
                    {m.revenue > 0 ? (
                      <div
                        className={`flex-1 rounded-t-md transition-all duration-200 ${
                          isCurrent
                            ? isHovered ? 'bg-burgundy/50' : 'bg-burgundy/30'
                            : isHovered ? 'bg-burgundy/40' : 'bg-burgundy/20'
                        }`}
                        style={{ height: `${projPct}%` }}
                      />
                    ) : (
                      <div className="flex-1 rounded-t-sm bg-gray-100" style={{ height: 3 }} />
                    )}
                    {/* Actual bar */}
                    {m.actual > 0 ? (
                      <div
                        className={`flex-1 rounded-t-md transition-all duration-200 ${
                          isCurrent
                            ? isHovered ? 'bg-burgundy' : 'bg-burgundy/90'
                            : isHovered ? 'bg-burgundy/70' : 'bg-burgundy/55'
                        }`}
                        style={{ height: `${actPct}%` }}
                      />
                    ) : (
                      <div className="flex-1 rounded-t-sm bg-gray-100" style={{ height: 3 }} />
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
    </div>
  );
}

export default function VendorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Good morning');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Check if user is a vendor
    if (session && session.user.role !== 'VENDOR') {
      router.push('/dashboard');
      return;
    }

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
  }, [session, router]);

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
  const maxRevenue = Math.max(...monthlyRevenue.map(m => Math.max(m.revenue, m.actual)), 0);
  const today = new Date();

  return (
    <VendorPageLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Mobile Profile Alert Banner */}
        {profileScore < 100 && (
          <div className="lg:hidden">
            <Link href="/vendor/settings">
              <div className="flex items-center gap-3 p-4 bg-burgundy text-white rounded-xl shadow-lg cursor-pointer">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Complete Your Profile ({profileScore}%)</p>
                  <p className="text-xs text-white/90 mt-0.5">Tap to improve your listing visibility</p>
                </div>
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </div>
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">
              {greeting}, {vendor.businessName}!
            </h1>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {vendor.verified && (
              <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 text-xs">
                <CheckCircle className="w-3 h-3" /> Verified
              </Badge>
            )}
            {stats.pendingTours > 0 && (
              <Link href="/vendor/bookings?tab=tours">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1 cursor-pointer text-xs">
                  <AlertCircle className="w-3 h-3" /> {stats.pendingTours} tour {stats.pendingTours === 1 ? 'request' : 'requests'}
                </Badge>
              </Link>
            )}
            <Link href="/vendor/bookings" className="flex-1 sm:flex-none">
              <Button className="bg-burgundy hover:bg-burgundy/90 text-white w-full sm:w-auto text-sm">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Projected Revenue */}
          <Card className="border-burgundy shadow-sm bg-burgundy">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-white/90">Projected Revenue</p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {stats.projectedRevenue > 0 ? `${fmt(stats.projectedRevenue)} RWF` : '—'}
              </p>
              <p className="text-xs text-white/70">Confirmed &amp; completed bookings</p>
            </CardContent>
          </Card>

          {/* Actual Revenue */}
          <Card className="border-gold shadow-sm bg-gold">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-charcoal/90">Actual Revenue</p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-charcoal" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-charcoal mb-1">
                {stats.actualRevenue > 0 ? `${fmt(stats.actualRevenue)} RWF` : '—'}
              </p>
              <ChangeChip value={stats.actualRevenueChange} />
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card className="border-charcoal shadow-sm bg-charcoal">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-white/90">Total Bookings</p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">{stats.totalBookings}</p>
              <span className="text-xs text-gold font-medium">{stats.pendingBookings} pending</span>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-sand shadow-sm bg-sand">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-charcoal/90">Active Services</p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/50 rounded-lg flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-charcoal" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-charcoal mb-1">{stats.activeServices}</p>
              <Link href="/vendor/services" className="text-xs text-burgundy hover:underline font-medium">Manage services →</Link>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="border-burgundy-light shadow-sm bg-burgundy-light">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-white/90">Avg. Rating</p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
              </p>
              <span className="text-xs text-white/70">{stats.reviewCount} review{stats.reviewCount !== 1 ? 's' : ''}</span>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Profile Score */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-burgundy/30 shadow-sm bg-cream">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-charcoal">Revenue Overview</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Last 6 months · confirmed &amp; completed bookings</p>
                </div>
                <div className="text-right space-y-1">
                  <div>
                    <p className="text-xs text-gray-400">Projected this month</p>
                    <p className="text-base font-bold text-burgundy/70 leading-tight">
                      {stats.thisMonthProjected > 0 ? `${fmt(stats.thisMonthProjected)} RWF` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Received this month</p>
                    <p className="text-base font-bold text-green-600 leading-tight">
                      {stats.thisMonthActual > 0 ? `${fmt(stats.thisMonthActual)} RWF` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-5 px-3 sm:px-5">
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
          <Card className="border-charcoal/30 shadow-sm bg-sand">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-semibold text-charcoal">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
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

              <Link href="/vendor/settings">
                <Button className="w-full bg-burgundy hover:bg-burgundy/90 text-white text-sm mt-2">
                  {profileScore === 100 ? 'View Profile' : 'Complete Profile'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings + Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Upcoming Bookings */}
          <Card className="border-gold/30 shadow-sm bg-cream">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-semibold text-charcoal">Upcoming Events</CardTitle>
                <Link href="/vendor/calendar">
                  <Button variant="ghost" size="sm" className="text-burgundy text-xs gap-1">
                    <span className="hidden sm:inline">Calendar</span> <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
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
          <Card className="border-burgundy/30 shadow-sm bg-sand">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-semibold text-charcoal">Recent Bookings</CardTitle>
                <Link href="/vendor/bookings">
                  <Button variant="ghost" size="sm" className="text-burgundy text-xs gap-1">
                    <span className="hidden sm:inline">View all</span> <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
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
        <Card className="border-charcoal/30 shadow-sm bg-cream">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-semibold text-charcoal">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'New Booking', desc: 'Add a client booking', icon: Plus, href: '/vendor/bookings', color: 'bg-burgundy/10 text-burgundy' },
                { label: 'Add Service', desc: 'Create a new package', icon: Package, href: '/vendor/services', color: 'bg-blue-50 text-blue-600' },
                { label: 'View Calendar', desc: 'Manage availability', icon: CalendarDays, href: '/vendor/calendar', color: 'bg-green-50 text-green-600' },
                { label: 'Edit Profile', desc: 'Update your listing', icon: Eye, href: '/vendor/settings', color: 'bg-yellow-50 text-yellow-600' },
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
