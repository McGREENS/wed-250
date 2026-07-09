import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bookings, weddings, vendors, bookingPayments, manualExpenses, tasks as tasksTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);

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
    const paymentMap = new Map<string, number>();
    for (const bookingId of bookingIds) {
      const pmts = await db
        .select({ bookingId: bookingPayments.bookingId, amount: bookingPayments.amount })
        .from(bookingPayments)
        .where(eq(bookingPayments.bookingId, bookingId));
      for (const p of pmts) {
        paymentMap.set(p.bookingId, (paymentMap.get(p.bookingId) || 0) + (p.amount || 0));
      }
    }

    // Get manual expenses
    const userManualExpenses = await db.select().from(manualExpenses).where(eq(manualExpenses.userId, userId));

    // Get all tasks with budget
    const userTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId));

    // Helper: resolve a task's allocated budget amount
    const resolveTaskBudget = (task: any): number => {
      if (!task.expectedBudget && !task.budgetPercent) return 0;
      if (task.budgetType === 'percent' && task.budgetPercent && totalBudget > 0) {
        return (task.budgetPercent / 100) * totalBudget;
      }
      return task.expectedBudget || 0;
    };

    // Build vendor-category map (bookings + manual expenses)
    const categoryMap = new Map<string, { name: string; bookings: any[]; totalSpent: number; paidAmount: number }>();
    let totalSpentFromBookings = 0;

    userBookings.forEach(booking => {
      const paidAmount = paymentMap.get(booking.id) || 0;
      const serviceType = booking.serviceType || 'Other';
      totalSpentFromBookings += paidAmount;
      if (!categoryMap.has(serviceType)) {
        categoryMap.set(serviceType, { name: serviceType, bookings: [], totalSpent: 0, paidAmount: 0 });
      }
      const cat = categoryMap.get(serviceType)!;
      cat.bookings.push(booking);
      cat.totalSpent += paidAmount;
      cat.paidAmount += paidAmount;
    });

    userManualExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      totalSpentFromBookings += expense.amount;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { name: category, bookings: [], totalSpent: 0, paidAmount: 0 });
      }
      const cat = categoryMap.get(category)!;
      cat.totalSpent += expense.amount;
      cat.paidAmount += expense.amount;
    });

    // Build wedding-phase task budget map
    const WEDDING_PHASES = ['Traditional (Gusaba)', 'Civil Ceremony', 'Church Wedding', 'Reception', 'Gutwikurura'];
    const phaseMap = new Map<string, { name: string; allocated: number; spent: number; taskCount: number }>();
    WEDDING_PHASES.forEach(p => phaseMap.set(p, { name: p, allocated: 0, spent: 0, taskCount: 0 }));
    phaseMap.set('Other', { name: 'Other', allocated: 0, spent: 0, taskCount: 0 });

    let totalPlanned = 0;  // allocated but not yet completed
    let totalTaskSpent = 0; // completed tasks actual spent

    userTasks.forEach(task => {
      const allocated = resolveTaskBudget(task);
      if (allocated === 0) return;

      const phase = WEDDING_PHASES.includes(task.category || '') ? task.category! : 'Other';
      const phaseData = phaseMap.get(phase)!;
      phaseData.taskCount += 1;

      if (task.completed) {
        const spent = task.actualSpent != null ? (task.actualSpent as number) : allocated;
        phaseData.spent += spent;
        totalTaskSpent += spent;
      } else {
        phaseData.allocated += allocated;
        totalPlanned += allocated;
      }
    });

    const totalSpent = totalSpentFromBookings + totalTaskSpent;
    const remaining = totalBudget > 0 ? totalBudget - totalSpent - totalPlanned : 0;
    const percentUsed = totalBudget > 0 ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(2)) : 0;

    const categories = Array.from(categoryMap.values())
      .filter(c => c.totalSpent > 0)
      .map(c => ({
        ...c,
        percentOfBudget: totalBudget > 0 ? parseFloat(((c.totalSpent / totalBudget) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    const phases = Array.from(phaseMap.values()).filter(p => p.allocated > 0 || p.spent > 0);

    return NextResponse.json({
      totalBudget,
      totalSpent,
      totalPlanned,
      remaining,
      percentUsed,
      categories,
      phases,
      recentBookings: userBookings.slice(0, 5),
    });
  } catch (error) {
    console.error('Budget overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch budget overview' }, { status: 500 });
  }
}