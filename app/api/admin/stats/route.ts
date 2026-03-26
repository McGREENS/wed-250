import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, vendors, bookings, venueTours, servicePackages, reviews } from '@/lib/db/schema';
import { eq, count, sql, and, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalVendors] = await db.select({ count: count() }).from(vendors);
    const [totalBookings] = await db.select({ count: count() }).from(bookings);
    const [totalServices] = await db.select({ count: count() }).from(servicePackages);
    const [totalReviews] = await db.select({ count: count() }).from(reviews);
    const [pendingTours] = await db.select({ count: count() }).from(venueTours).where(eq(venueTours.status, 'PENDING'));
    const [pendingBookings] = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'pending'));
    const [confirmedBookings] = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'confirmed'));

    // Get user role breakdown
    const usersByRole = await db
      .select({
        role: users.role,
        count: count(),
      })
      .from(users)
      .groupBy(users.role);

    // Get booking status breakdown
    const bookingsByStatus = await db
      .select({
        status: bookings.status,
        count: count(),
      })
      .from(bookings)
      .groupBy(bookings.status);

    // Get total revenue
    const [revenueData] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)`,
      })
      .from(bookings);

    // Get recent users
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(10);

    // Get recent bookings with more details
    const recentBookings = await db
      .select({
        id: bookings.id,
        clientName: bookings.clientName,
        clientEmail: bookings.clientEmail,
        serviceType: bookings.serviceType,
        servicePackage: bookings.servicePackage,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        eventDate: bookings.eventDate,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .orderBy(sql`${bookings.createdAt} DESC`)
      .limit(10);

    // Get recent vendors
    const recentVendors = await db
      .select({
        id: vendors.id,
        businessName: vendors.businessName,
        categories: vendors.categories,
        location: vendors.location,
        verified: vendors.verified,
        featured: vendors.featured,
        rating: vendors.rating,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .orderBy(sql`${vendors.createdAt} DESC`)
      .limit(10);

    // Get top vendors by rating
    const topVendors = await db
      .select({
        id: vendors.id,
        businessName: vendors.businessName,
        rating: vendors.rating,
        reviewCount: vendors.reviewCount,
      })
      .from(vendors)
      .where(sql`${vendors.rating} > 0`)
      .orderBy(sql`${vendors.rating} DESC`)
      .limit(5);

    const stats = {
      totalUsers: totalUsers.count,
      totalVendors: totalVendors.count,
      totalBookings: totalBookings.count,
      totalServices: totalServices.count,
      totalReviews: totalReviews.count,
      pendingTours: pendingTours.count,
      pendingBookings: pendingBookings.count,
      confirmedBookings: confirmedBookings.count,
      totalRevenue: revenueData.total,
      usersByRole,
      bookingsByStatus,
      recentUsers,
      recentBookings,
      recentVendors,
      topVendors,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
