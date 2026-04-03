import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, vendors, bookings, servicePackages, reviews } from '@/lib/db/schema';
import { eq, count, sql, and, gte, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getDateRangeFilter(range: string) {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      return null;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  return startDate;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'revenue';
    const dateRange = searchParams.get('range') || '30days';

    const startDate = getDateRangeFilter(dateRange);

    let reportData: any = {};

    switch (reportType) {
      case 'revenue':
        reportData = await generateRevenueReport(startDate);
        break;
      case 'bookings':
        reportData = await generateBookingsReport(startDate);
        break;
      case 'vendors':
        reportData = await generateVendorsReport(startDate);
        break;
      case 'users':
        reportData = await generateUsersReport(startDate);
        break;
      case 'performance':
        reportData = await generatePerformanceReport(startDate);
        break;
      default:
        reportData = await generateRevenueReport(startDate);
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

async function generateRevenueReport(startDate: Date | null) {
  const dateFilter = startDate ? gte(bookings.createdAt, startDate) : undefined;

  const [totalRevenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(dateFilter);

  const [confirmedRevenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(and(eq(bookings.status, 'confirmed'), dateFilter));

  const [bookingCount] = await db
    .select({ count: count() })
    .from(bookings)
    .where(dateFilter);

  const avgBookingValue = bookingCount.count > 0 ? totalRevenue.total / bookingCount.count : 0;

  const revenueByCategory = await db
    .select({
      category: bookings.serviceType,
      total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)`,
      count: count(),
    })
    .from(bookings)
    .where(dateFilter)
    .groupBy(bookings.serviceType);

  const topBookings = await db
    .select({
      clientName: bookings.clientName,
      serviceType: bookings.serviceType,
      totalAmount: bookings.totalAmount,
      status: bookings.status,
      eventDate: bookings.eventDate,
    })
    .from(bookings)
    .where(dateFilter)
    .orderBy(desc(bookings.totalAmount))
    .limit(20);

  const maxRevenue = Math.max(...revenueByCategory.map(r => r.total), 1);

  return {
    summary: [
      { label: 'Total Revenue', value: `${totalRevenue.total.toLocaleString()} RWF`, change: 12.5 },
      { label: 'Confirmed Revenue', value: `${confirmedRevenue.total.toLocaleString()} RWF`, change: 8.3 },
      { label: 'Total Bookings', value: bookingCount.count.toLocaleString(), change: 15.2 },
      { label: 'Avg Booking Value', value: `${Math.round(avgBookingValue).toLocaleString()} RWF`, change: -2.1 },
    ],
    trendData: revenueByCategory.map(item => ({
      label: item.category,
      value: `${item.total.toLocaleString()} RWF`,
      percentage: (item.total / maxRevenue) * 100,
    })),
    distributionData: revenueByCategory.map((item, index) => ({
      label: item.category,
      value: `${item.total.toLocaleString()} RWF`,
      percentage: ((item.total / totalRevenue.total) * 100).toFixed(1),
      color: ['#8B3A3A', '#4A90E2', '#9B59B6', '#E67E22', '#27AE60'][index % 5],
    })),
    columns: ['Client Name', 'Service Type', 'Amount', 'Status', 'Event Date'],
    detailedData: topBookings.map(booking => ({
      clientName: booking.clientName,
      serviceType: booking.serviceType,
      totalAmount: `${booking.totalAmount?.toLocaleString()} RWF`,
      status: {
        value: booking.status,
        className: booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
      },
      eventDate: new Date(booking.eventDate).toLocaleDateString(),
    })),
  };
}

async function generateBookingsReport(startDate: Date | null) {
  const dateFilter = startDate ? gte(bookings.createdAt, startDate) : undefined;

  const [totalBookings] = await db.select({ count: count() }).from(bookings).where(dateFilter);
  const [pendingBookings] = await db.select({ count: count() }).from(bookings).where(and(eq(bookings.status, 'pending'), dateFilter));
  const [confirmedBookings] = await db.select({ count: count() }).from(bookings).where(and(eq(bookings.status, 'confirmed'), dateFilter));
  const [completedBookings] = await db.select({ count: count() }).from(bookings).where(and(eq(bookings.status, 'completed'), dateFilter));

  const bookingsByStatus = await db
    .select({
      status: bookings.status,
      count: count(),
    })
    .from(bookings)
    .where(dateFilter)
    .groupBy(bookings.status);

  const bookingsByType = await db
    .select({
      type: bookings.serviceType,
      count: count(),
    })
    .from(bookings)
    .where(dateFilter)
    .groupBy(bookings.serviceType);

  const recentBookings = await db
    .select()
    .from(bookings)
    .where(dateFilter)
    .orderBy(desc(bookings.createdAt))
    .limit(20);

  const maxCount = Math.max(...bookingsByType.map(b => b.count), 1);

  return {
    summary: [
      { label: 'Total Bookings', value: totalBookings.count.toLocaleString(), change: 15.3 },
      { label: 'Pending', value: pendingBookings.count.toLocaleString(), change: 5.2 },
      { label: 'Confirmed', value: confirmedBookings.count.toLocaleString(), change: 18.7 },
      { label: 'Completed', value: completedBookings.count.toLocaleString(), change: 22.1 },
    ],
    trendData: bookingsByType.map(item => ({
      label: item.type,
      value: item.count.toLocaleString(),
      percentage: (item.count / maxCount) * 100,
    })),
    distributionData: bookingsByStatus.map((item, index) => ({
      label: item.status,
      value: item.count.toLocaleString(),
      percentage: ((item.count / totalBookings.count) * 100).toFixed(1),
      color: ['#27AE60', '#F39C12', '#3498DB', '#E74C3C'][index % 4],
    })),
    columns: ['Client', 'Email', 'Service', 'Status', 'Amount', 'Date'],
    detailedData: recentBookings.map(booking => ({
      client: booking.clientName,
      email: booking.clientEmail,
      service: booking.serviceType,
      status: {
        value: booking.status,
        className: booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800',
      },
      amount: `${booking.totalAmount?.toLocaleString()} RWF`,
      date: new Date(booking.createdAt).toLocaleDateString(),
    })),
  };
}

async function generateVendorsReport(startDate: Date | null) {
  const dateFilter = startDate ? gte(vendors.createdAt, startDate) : undefined;

  const [totalVendors] = await db.select({ count: count() }).from(vendors).where(dateFilter);
  const [verifiedVendors] = await db.select({ count: count() }).from(vendors).where(and(eq(vendors.verified, true), dateFilter));
  const [featuredVendors] = await db.select({ count: count() }).from(vendors).where(and(eq(vendors.featured, true), dateFilter));

  const [avgRating] = await db
    .select({ avg: sql<number>`COALESCE(AVG(${vendors.rating}), 0)` })
    .from(vendors)
    .where(dateFilter);

  const vendorsByCategory = await db
    .select({
      category: vendors.category,
      count: count(),
    })
    .from(vendors)
    .where(dateFilter)
    .groupBy(vendors.category);

  const topVendors = await db
    .select()
    .from(vendors)
    .where(dateFilter)
    .orderBy(desc(vendors.rating))
    .limit(20);

  const maxCount = Math.max(...vendorsByCategory.map(v => v.count), 1);

  return {
    summary: [
      { label: 'Total Vendors', value: totalVendors.count.toLocaleString(), change: 8.2 },
      { label: 'Verified', value: verifiedVendors.count.toLocaleString(), change: 12.5 },
      { label: 'Featured', value: featuredVendors.count.toLocaleString(), change: 6.3 },
      { label: 'Avg Rating', value: avgRating.avg.toFixed(1), change: 3.1 },
    ],
    trendData: vendorsByCategory.map(item => ({
      label: item.category,
      value: item.count.toLocaleString(),
      percentage: (item.count / maxCount) * 100,
    })),
    distributionData: vendorsByCategory.map((item, index) => ({
      label: item.category,
      value: item.count.toLocaleString(),
      percentage: ((item.count / totalVendors.count) * 100).toFixed(1),
      color: ['#8B3A3A', '#4A90E2', '#9B59B6', '#E67E22', '#27AE60', '#F39C12'][index % 6],
    })),
    columns: ['Business Name', 'Category', 'Location', 'Rating', 'Reviews', 'Status'],
    detailedData: topVendors.map(vendor => ({
      businessName: vendor.businessName,
      category: vendor.category,
      location: vendor.location,
      rating: `⭐ ${vendor.rating?.toFixed(1)}`,
      reviews: vendor.reviewCount?.toLocaleString(),
      status: {
        value: vendor.verified ? 'Verified' : 'Pending',
        className: vendor.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
      },
    })),
  };
}

async function generateUsersReport(startDate: Date | null) {
  const dateFilter = startDate ? gte(users.createdAt, startDate) : undefined;

  const [totalUsers] = await db.select({ count: count() }).from(users).where(dateFilter);
  const [coupleUsers] = await db.select({ count: count() }).from(users).where(and(eq(users.role, 'COUPLE'), dateFilter));
  const [vendorUsers] = await db.select({ count: count() }).from(users).where(and(eq(users.role, 'VENDOR'), dateFilter));
  const [adminUsers] = await db.select({ count: count() }).from(users).where(and(eq(users.role, 'ADMIN'), dateFilter));

  const usersByRole = await db
    .select({
      role: users.role,
      count: count(),
    })
    .from(users)
    .where(dateFilter)
    .groupBy(users.role);

  const recentUsers = await db
    .select()
    .from(users)
    .where(dateFilter)
    .orderBy(desc(users.createdAt))
    .limit(20);

  const maxCount = Math.max(...usersByRole.map(u => u.count), 1);

  return {
    summary: [
      { label: 'Total Users', value: totalUsers.count.toLocaleString(), change: 10.5 },
      { label: 'Couples', value: coupleUsers.count.toLocaleString(), change: 12.3 },
      { label: 'Vendors', value: vendorUsers.count.toLocaleString(), change: 8.7 },
      { label: 'Admins', value: adminUsers.count.toLocaleString(), change: 0 },
    ],
    trendData: usersByRole.map(item => ({
      label: item.role,
      value: item.count.toLocaleString(),
      percentage: (item.count / maxCount) * 100,
    })),
    distributionData: usersByRole.map((item, index) => ({
      label: item.role,
      value: item.count.toLocaleString(),
      percentage: ((item.count / totalUsers.count) * 100).toFixed(1),
      color: ['#E91E63', '#4A90E2', '#9B59B6'][index % 3],
    })),
    columns: ['Name', 'Email', 'Role', 'Joined Date'],
    detailedData: recentUsers.map(user => ({
      name: user.name,
      email: user.email,
      role: {
        value: user.role,
        className: user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : user.role === 'VENDOR' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800',
      },
      joinedDate: new Date(user.createdAt).toLocaleDateString(),
    })),
  };
}

async function generatePerformanceReport(startDate: Date | null) {
  const dateFilter = startDate ? gte(bookings.createdAt, startDate) : undefined;

  const [totalRevenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(dateFilter);

  const [totalBookings] = await db.select({ count: count() }).from(bookings).where(dateFilter);
  const [totalVendors] = await db.select({ count: count() }).from(vendors).where(dateFilter);
  const [totalReviews] = await db.select({ count: count() }).from(reviews).where(dateFilter);

  const conversionRate = totalVendors.count > 0 ? (totalBookings.count / totalVendors.count) * 100 : 0;

  const topPerformers = await db
    .select({
      businessName: vendors.businessName,
      category: vendors.category,
      rating: vendors.rating,
      reviewCount: vendors.reviewCount,
    })
    .from(vendors)
    .where(dateFilter)
    .orderBy(desc(vendors.rating))
    .limit(20);

  return {
    summary: [
      { label: 'Total Revenue', value: `${totalRevenue.total.toLocaleString()} RWF`, change: 12.5 },
      { label: 'Bookings', value: totalBookings.count.toLocaleString(), change: 15.3 },
      { label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%`, change: 5.2 },
      { label: 'Reviews', value: totalReviews.count.toLocaleString(), change: 18.7 },
    ],
    trendData: [
      { label: 'Revenue Growth', value: '+12.5%', percentage: 85 },
      { label: 'Booking Growth', value: '+15.3%', percentage: 92 },
      { label: 'User Growth', value: '+10.5%', percentage: 78 },
      { label: 'Vendor Growth', value: '+8.2%', percentage: 70 },
    ],
    distributionData: [
      { label: 'Excellent (4.5+)', value: '45', percentage: '45', color: '#27AE60' },
      { label: 'Good (3.5-4.5)', value: '35', percentage: '35', color: '#F39C12' },
      { label: 'Average (2.5-3.5)', value: '15', percentage: '15', color: '#E67E22' },
      { label: 'Poor (<2.5)', value: '5', percentage: '5', color: '#E74C3C' },
    ],
    columns: ['Vendor', 'Category', 'Rating', 'Reviews'],
    detailedData: topPerformers.map(vendor => ({
      vendor: vendor.businessName,
      category: vendor.category,
      rating: `⭐ ${vendor.rating?.toFixed(1)}`,
      reviews: vendor.reviewCount?.toLocaleString(),
    })),
  };
}
