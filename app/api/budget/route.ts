import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, weddings, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's wedding info for total budget
    const userWedding = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);
    const totalBudget = userWedding[0]?.budget || 0;

    // Get all user bookings with vendor info
    const userBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        servicePackage: bookings.servicePackage,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        vendorName: vendors.businessName,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(vendors, eq(bookings.vendorId, vendors.id))
      .where(eq(bookings.userId, userId));

    // Group bookings by service type and calculate totals
    const categoryMap = new Map();
    let totalSpent = 0;

    userBookings.forEach(booking => {
      const amount = booking.totalAmount || 0;
      const serviceType = booking.serviceType || 'Other';
      
      totalSpent += amount;

      if (!categoryMap.has(serviceType)) {
        categoryMap.set(serviceType, {
          name: serviceType,
          bookings: [],
          totalSpent: 0,
          paidAmount: 0,
        });
      }

      const category = categoryMap.get(serviceType);
      category.bookings.push(booking);
      category.totalSpent += amount;
      
      if (booking.paymentStatus === 'PAID' || booking.paymentStatus === 'DEPOSIT_PAID') {
        category.paidAmount += amount;
      }
    });

    // Convert map to array and add default categories if they don't exist
    const defaultCategories = [
      'Venue', 'Photography', 'Catering', 'Decoration', 
      'Music', 'Planning', 'Transportation', 'Flowers'
    ];

    defaultCategories.forEach(categoryName => {
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          bookings: [],
          totalSpent: 0,
          paidAmount: 0,
        });
      }
    });

    const categories = Array.from(categoryMap.values()).map(category => ({
      ...category,
      percentOfBudget: totalBudget > 0 ? Math.round((category.totalSpent / totalBudget) * 100) : 0,
    }));

    const remaining = Math.max(0, totalBudget - totalSpent);
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    return NextResponse.json({
      totalBudget,
      totalSpent,
      remaining,
      percentUsed,
      categories: categories.sort((a, b) => b.totalSpent - a.totalSpent),
      recentBookings: userBookings.slice(0, 5),
    });
  } catch (error) {
    console.error('Budget overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch budget overview' }, { status: 500 });
  }
}