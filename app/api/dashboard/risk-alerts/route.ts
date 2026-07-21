import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { weddings, bookings, tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);

    const [userWedding] = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);
    const userBookings = await db
      .select({ id: bookings.id, status: bookings.status, paymentStatus: bookings.paymentStatus, serviceType: bookings.serviceType, totalAmount: bookings.totalAmount })
      .from(bookings)
      .where(eq(bookings.userId, userId));
    const userTasks = await db.select({ completed: tasks.completed }).from(tasks).where(eq(tasks.userId, userId));

    const alerts: { level: 'high' | 'medium' | 'low'; message: string; action: string; href: string }[] = [];

    // 1. Pending bookings — vendor hasn't responded
    const pendingBookings = userBookings.filter(b => b.status === 'pending');
    if (pendingBookings.length > 0) {
      alerts.push({
        level: 'high',
        message: `${pendingBookings.length} booking${pendingBookings.length > 1 ? 's' : ''} awaiting vendor response`,
        action: 'View Bookings',
        href: '/dashboard/bookings',
      });
    }

    // 2. Confirmed but unpaid bookings
    const unpaidConfirmed = userBookings.filter(b => b.status === 'confirmed' && b.paymentStatus === 'UNPAID');
    if (unpaidConfirmed.length > 0) {
      alerts.push({
        level: 'high',
        message: `${unpaidConfirmed.length} confirmed booking${unpaidConfirmed.length > 1 ? 's' : ''} with no payment recorded`,
        action: 'View Bookings',
        href: '/dashboard/bookings',
      });
    }

    // 3. Budget overrun / approaching limit
    if (userWedding?.budget && userWedding.budget > 0) {
      const totalSpent = userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const pct = (totalSpent / userWedding.budget) * 100;
      if (pct > 100) {
        alerts.push({
          level: 'high',
          message: `Over budget by RWF ${Math.round(totalSpent - userWedding.budget).toLocaleString()}`,
          action: 'View Budget',
          href: '/dashboard/budget',
        });
      } else if (pct >= 85) {
        alerts.push({
          level: 'medium',
          message: `${Math.round(pct)}% of your budget is used`,
          action: 'View Budget',
          href: '/dashboard/budget',
        });
      }
    }

    // 4. Wedding soon but tasks incomplete
    if (userWedding?.weddingDate) {
      const daysLeft = Math.ceil((new Date(userWedding.weddingDate).getTime() - Date.now()) / 86400000);
      const total = userTasks.length;
      const completed = userTasks.filter(t => t.completed).length;
      const pct = total > 0 ? completed / total : 1;
      if (daysLeft > 0 && daysLeft <= 60 && pct < 0.5) {
        alerts.push({
          level: 'medium',
          message: `${daysLeft} days to go but only ${Math.round(pct * 100)}% of tasks done`,
          action: 'View Checklist',
          href: '/dashboard/checklist',
        });
      }
    }

    // 5. No venue booked
    const hasVenue = userBookings.some(b => b.serviceType?.toLowerCase() === 'venue');
    if (userWedding?.weddingDate && !hasVenue) {
      alerts.push({
        level: 'low',
        message: 'No venue booked yet for your wedding',
        action: 'Browse Venues',
        href: '/venues',
      });
    }

    // Return top 3 sorted by severity
    const order = { high: 0, medium: 1, low: 2 };
    const top3 = alerts.sort((a, b) => order[a.level] - order[b.level]).slice(0, 3);

    return NextResponse.json({ alerts: top3 });
  } catch (error) {
    console.error('Risk alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch risk alerts' }, { status: 500 });
  }
}
