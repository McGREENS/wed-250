import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { coupleSubscriptions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the most recent subscription for this user
    const [subscription] = await db
      .select()
      .from(coupleSubscriptions)
      .where(eq(coupleSubscriptions.userId, session.user.id))
      .orderBy(desc(coupleSubscriptions.createdAt))
      .limit(1);

    if (!subscription) {
      return NextResponse.json({ hasSubscription: false, subscription: null });
    }

    // For Centiwise integration, we rely on webhook callbacks to update status
    // No need for live PesaPal status checks anymore
    
    const isActive =
      subscription.status === 'COMPLETED' &&
      subscription.endDate != null &&
      subscription.endDate > new Date();

    return NextResponse.json({
      hasSubscription: isActive,
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        planName: subscription.planName,
        amount: subscription.amount,
        currency: subscription.currency,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive,
      },
    });
  } catch (error: any) {
    console.error('[SUBSCRIPTIONS STATUS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
