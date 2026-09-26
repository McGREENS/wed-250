import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { coupleSubscriptions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getPesapalToken, getPesapalTransactionStatus } from '@/lib/pesapal';

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

    // If pending and has a tracking id, do a live check to catch late IPN deliveries
    if (
      subscription.status === 'PENDING' &&
      subscription.pesapalOrderTrackingId
    ) {
      try {
        const { token } = await getPesapalToken();
        const statusResult = await getPesapalTransactionStatus(
          subscription.pesapalOrderTrackingId,
          token
        );

        const statusCode = statusResult.status_code;
        const desc = (statusResult.payment_status_description ?? '').toUpperCase();

        if (statusCode === 1 || desc === 'COMPLETED') {
          const now = new Date();
          const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          await db
            .update(coupleSubscriptions)
            .set({
              status: 'COMPLETED',
              startDate: now,
              endDate,
              updatedAt: now,
            } as any)
            .where(eq(coupleSubscriptions.id, subscription.id));

          subscription.status = 'COMPLETED';
          subscription.startDate = now;
          subscription.endDate = endDate;
        } else if (statusCode === 2 || desc === 'FAILED') {
          await db
            .update(coupleSubscriptions)
            .set({ status: 'FAILED', updatedAt: new Date() } as any)
            .where(eq(coupleSubscriptions.id, subscription.id));
          subscription.status = 'FAILED';
        }
      } catch (e) {
        // Non-fatal — return cached status if live check fails
        console.warn('[SUBSCRIPTIONS STATUS] Live check failed:', e);
      }
    }

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
