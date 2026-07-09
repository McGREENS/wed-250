import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { weddings, bookings, favorites, venueTours, tasks } from '@/lib/db/schema';
import { eq, count, sum, and } from 'drizzle-orm';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);

    // Get user's wedding info
    const userWedding = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);
    
    // Get booking stats
    const userBookings = await db.select().from(bookings).where(eq(bookings.userId, userId));
    const totalBookings = userBookings.length;
    const totalSpent = userBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const confirmedBookings = userBookings.filter(b => b.status === 'confirmed').length;

    // Get favorites count
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    const favoritesCount = userFavorites.length;

    // Get venue tours count
    const userVenueTours = await db.select().from(venueTours).where(eq(venueTours.userId, userId));
    const venueToursCount = userVenueTours.length;

    // Get tasks stats
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    const totalTasks = userTasks.length;
    const tasksCompleted = userTasks.filter(t => t.completed).length;

    const wedding = userWedding[0];
    
    // Calculate days until wedding
    let daysUntilWedding = 0;
    if (wedding?.weddingDate) {
      const today = new Date();
      const weddingDate = new Date(wedding.weddingDate);
      daysUntilWedding = Math.max(0, Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Calculate budget usage
    const totalBudget = wedding?.budget || 0;
    const budgetUsage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    return NextResponse.json({
      daysUntilWedding,
      tasksCompleted,
      totalTasks,
      budgetUsage,
      totalBookings,
      totalSpent,
      totalBudget,
      favoritesCount,
      venueToursCount,
      weddingDate: wedding?.weddingDate,
      coupleNames: wedding?.coupleNames,
      guestCount: wedding?.guestCount || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}