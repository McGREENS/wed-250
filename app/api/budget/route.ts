import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, weddings, vendors, bookingPayments, manualExpenses } from '@/lib/db/schema';
import { eq, sum } from 'drizzle-orm';

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

    // Get all payments for user's bookings
    const bookingIds = userBookings.map(b => b.id);
    const payments = bookingIds.length > 0 ? await db
      .select({
        bookingId: bookingPayments.bookingId,
        amount: bookingPayments.amount,
      })
      .from(bookingPayments)
      .where(eq(bookingPayments.bookingId, bookingIds[0])) : [];

    // Create a map of bookingId to total paid amount
    const paymentMap = new Map();
    for (const payment of payments) {
      const currentTotal = paymentMap.get(payment.bookingId) || 0;
      paymentMap.set(payment.bookingId, currentTotal + (payment.amount || 0));
    }

    // Fetch all payments for all bookings if there are multiple
    if (bookingIds.length > 1) {
      for (const bookingId of bookingIds.slice(1)) {
        const morePayments = await db
          .select({
            bookingId: bookingPayments.bookingId,
            amount: bookingPayments.amount,
          })
          .from(bookingPayments)
          .where(eq(bookingPayments.bookingId, bookingId));
        
        for (const payment of morePayments) {
          const currentTotal = paymentMap.get(payment.bookingId) || 0;
          paymentMap.set(payment.bookingId, currentTotal + (payment.amount || 0));
        }
      }
    }

    // Get manual expenses (vendors booked outside the platform)
    const userManualExpenses = await db
      .select()
      .from(manualExpenses)
      .where(eq(manualExpenses.userId, userId));

    // Group bookings by service type and calculate totals based on actual payments
    const categoryMap = new Map();
    let totalSpent = 0;

    userBookings.forEach(booking => {
      const paidAmount = paymentMap.get(booking.id) || 0;
      const serviceType = booking.serviceType || 'Other';
      
      totalSpent += paidAmount;

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
      category.totalSpent += paidAmount;
      category.paidAmount += paidAmount;
    });

    // Add manual expenses to categories
    userManualExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      totalSpent += expense.amount;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          bookings: [],
          totalSpent: 0,
          paidAmount: 0,
        });
      }

      const cat = categoryMap.get(category);
      cat.totalSpent += expense.amount;
      cat.paidAmount += expense.amount;
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
      percentOfBudget: totalBudget > 0 ? parseFloat(((category.totalSpent / totalBudget) * 100).toFixed(2)) : 0,
    }));

    const remaining = Math.max(0, totalBudget - totalSpent);
    const percentUsed = totalBudget > 0 ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(2)) : 0;

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