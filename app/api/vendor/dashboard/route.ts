import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { vendors, bookings, servicePackages, venueTours, reviews, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    
    // Create vendor record if it doesn't exist
    if (!vendor) {
      const [newVendor] = await db.insert(vendors).values({
        userId: session.user.id,
        businessName: session.user.name || 'My Business',
        categories: JSON.stringify(['Other']),
        location: 'Kigali, Rwanda',
        description: '',
        rating: 0,
        reviewCount: 0,
        verified: false,
        featured: false,
        portfolio: '[]',
      } as any).returning();
      vendor = newVendor;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const allBookings = await db.select().from(bookings)
      .where(eq(bookings.vendorId, vendor.id))
      .orderBy(desc(bookings.createdAt));

    const allServices = await db.select().from(servicePackages)
      .where(eq(servicePackages.vendorId, vendor.id));

    // Get all venue tours (can't filter by vendor directly, would need to join through servicePackages)
    const allTours = await db.select().from(venueTours);
    const [user] = await db.select({ image: users.image }).from(users).where(eq(users.id, session.user.id)).limit(1);

    const allReviews = await db.select().from(reviews)
      .where(eq(reviews.vendorId, vendor.id))
      .orderBy(desc(reviews.createdAt));

    // Revenue calculations
    const paidStatuses = ['confirmed', 'completed'];
    const thisMonthBookings = allBookings.filter(b => b.createdAt && b.createdAt >= startOfMonth);
    const lastMonthBookings = allBookings.filter(b => b.createdAt && b.createdAt >= startOfLastMonth && b.createdAt <= endOfLastMonth);

    const totalRevenue = allBookings
      .filter(b => paidStatuses.includes(b.status || ''))
      .reduce((s, b) => s + (b.totalAmount || 0), 0);

    const thisMonthRevenue = thisMonthBookings
      .filter(b => paidStatuses.includes(b.status || ''))
      .reduce((s, b) => s + (b.totalAmount || 0), 0);

    const lastMonthRevenue = lastMonthBookings
      .filter(b => paidStatuses.includes(b.status || ''))
      .reduce((s, b) => s + (b.totalAmount || 0), 0);

    const revenueChange = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : null;

    const bookingChange = lastMonthBookings.length > 0
      ? Math.round(((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100)
      : null;

    // Upcoming events
    const upcomingBookings = allBookings
      .filter(b => b.eventDate && new Date(b.eventDate) >= now && (b.status === 'confirmed' || b.status === 'pending'))
      .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())
      .slice(0, 5);

    // Monthly revenue chart — last 6 months, bucketed by eventDate
    const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0);
      const label = start.toLocaleDateString('en-US', { month: 'short' });
      const monthPaid = allBookings.filter(b => {
        if (!b.eventDate || !paidStatuses.includes(b.status || '')) return false;
        const d = new Date(b.eventDate);
        return d >= start && d <= end;
      });
      const revenue = monthPaid.reduce((s, b) => s + (b.totalAmount || 0), 0);
      const count = monthPaid.length;
      return { label, revenue, count };
    });

    // Status breakdown
    const statusBreakdown = {
      pending: allBookings.filter(b => b.status === 'pending').length,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      completed: allBookings.filter(b => b.status === 'completed').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
    };

    // Profile completeness score
    const hasPortfolio = (() => { try { return JSON.parse(vendor.portfolio || '[]').length > 0; } catch { return false; } })();
    const hasProfilePhoto = !!user?.image;
    const checks = [
      !!vendor.businessName,
      !!vendor.description,
      !!vendor.location,
      hasProfilePhoto,
      hasPortfolio,
      allServices.length > 0,
      (vendor.reviewCount || 0) > 0,
    ];
    const profileScore = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const profileTips = [
      !vendor.description && 'Add a business description',
      !vendor.location && 'Add your location',
      !hasProfilePhoto && 'Upload a profile photo',
      !hasPortfolio && 'Upload portfolio photos',
      allServices.length === 0 && 'Create your first service package',
      (vendor.reviewCount || 0) === 0 && 'Get your first client review',
    ].filter(Boolean) as string[];

    return NextResponse.json({
      vendor: {
        businessName: vendor.businessName,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        verified: vendor.verified,
      },
      stats: {
        totalRevenue,
        thisMonthRevenue,
        revenueChange,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        confirmedBookings: allBookings.filter(b => b.status === 'confirmed').length,
        bookingChange,
        totalBookings: allBookings.length,
        activeServices: allServices.filter(s => s.active).length,
        pendingTours: allTours.filter(t => t.status === 'PENDING').length,
        pendingQuotes: allBookings.filter(b => b.serviceType === 'Venue' && b.status === 'pending').length,
        avgRating: vendor.rating || 0,
        reviewCount: vendor.reviewCount || 0,
      },
      monthlyRevenue,
      statusBreakdown,
      upcomingBookings,
      recentBookings: allBookings.slice(0, 5),
      recentReviews: allReviews.slice(0, 3),
      profileScore,
      profileTips,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
