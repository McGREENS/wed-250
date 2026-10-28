import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/lib/db';
import { coupleSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  isPaymentSuccessful,
  isPaymentFailed,
  getCallbackOrderId,
  type CentiwiseCallbackPayload,
} from '@/lib/centiwise';

/**
 * Centiwise webhook — called by Centiwise when a payment status changes.
 * Centiwise POSTs to this URL with the payment result.
 * We must respond with HTTP 200 to acknowledge receipt.
 */
export async function POST(req: NextRequest) {
  let payload: CentiwiseCallbackPayload | null = null;

  try {
    const text = await req.text();
    console.log('[CENTIWISE CALLBACK] Raw payload:', text);

    try {
      payload = JSON.parse(text) as CentiwiseCallbackPayload;
    } catch {
      // Centiwise may send form-encoded data
      const params = new URLSearchParams(text);
      payload = Object.fromEntries(params.entries()) as unknown as CentiwiseCallbackPayload;
    }

    console.log('[CENTIWISE CALLBACK] Parsed payload:', payload);

    const { status } = payload;
    if (!status) {
      console.error('[CENTIWISE CALLBACK] Missing status field');
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    // Get our original order ID
    const clientOrderId = getCallbackOrderId(payload);
    if (!clientOrderId) {
      console.error('[CENTIWISE CALLBACK] Missing order ID in payload');
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    console.log('[CENTIWISE CALLBACK] Processing order:', clientOrderId, '→ status:', status);

    // Find the pending subscription by our stored merchant reference
    const [subscription] = await db
      .select()
      .from(coupleSubscriptions)
      .where(eq(coupleSubscriptions.pesapalMerchantReference, clientOrderId))
      .limit(1);

    if (!subscription) {
      // Could be a duplicate/test callback — log and return 200 to prevent retries
      console.warn('[CENTIWISE CALLBACK] No subscription found for order:', clientOrderId);
      return NextResponse.json({ success: true, message: 'Order not found — acknowledged' });
    }

    if (isPaymentSuccessful(status)) {
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      await client.execute({
        sql: `UPDATE couple_subscriptions SET status = 'COMPLETED', start_date = ?, end_date = ?, pesapal_order_tracking_id = ?, updated_at = ? WHERE id = ?`,
        args: [
          Math.floor(now.getTime() / 1000),
          Math.floor(oneYearLater.getTime() / 1000),
          String(payload.orderid ?? clientOrderId),
          Math.floor(now.getTime() / 1000),
          subscription.id,
        ],
      });

      console.log('[CENTIWISE CALLBACK] ✅ Subscription activated:', {
        subscriptionId: subscription.id,
        userId: subscription.userId,
        planId: subscription.planId,
        endDate: oneYearLater.toISOString(),
      });

    } else if (isPaymentFailed(status)) {
      const now = new Date();
      await client.execute({
        sql: `UPDATE couple_subscriptions SET status = 'FAILED', updated_at = ? WHERE id = ?`,
        args: [Math.floor(now.getTime() / 1000), subscription.id],
      });

      console.log('[CENTIWISE CALLBACK] ❌ Payment failed:', {
        subscriptionId: subscription.id,
        status,
        message: payload.error_message,
      });

    } else {
      // Still processing — leave as PENDING
      console.log('[CENTIWISE CALLBACK] ⏳ Payment still processing, status:', status);
    }

    // Always return 200 so Centiwise stops retrying
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[CENTIWISE CALLBACK] Error:', error);
    // Still return 200 to prevent infinite retries from Centiwise
    return NextResponse.json({ success: true, error: 'Internal error logged' });
  }
}

/**
 * GET — lets Centiwise verify the webhook URL is reachable.
 * Also useful for manual testing.
 */
export async function GET() {
  return NextResponse.json({
    active: true,
    endpoint: 'Centiwise webhook',
    timestamp: new Date().toISOString(),
  });
}
