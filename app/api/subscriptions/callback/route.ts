/**
 * PesaPal IPN (Instant Payment Notification) handler.
 *
 * PesaPal calls this URL via POST when a payment status changes.
 * We also use GET to handle the user redirect (callback_url) after payment.
 *
 * PesaPal IPN POST body:
 *   { OrderTrackingId, OrderMerchantReference, OrderNotificationType }
 *
 * PesaPal redirect GET query params (callback_url):
 *   ?OrderTrackingId=...&OrderMerchantReference=...&OrderNotificationType=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupleSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPesapalToken, getPesapalTransactionStatus } from '@/lib/pesapal';

// Add 1 year validity when a subscription is completed
const SUBSCRIPTION_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

async function processPayment(orderTrackingId: string, merchantReference: string) {
  // Fetch current status from PesaPal
  const { token } = await getPesapalToken();
  const statusResult = await getPesapalTransactionStatus(orderTrackingId, token);

  /*
   * PesaPal status_code values:
   *   0 = INVALID
   *   1 = COMPLETED
   *   2 = FAILED
   *   3 = REVERSED
   *
   * payment_status_description: "PENDING" | "COMPLETED" | "FAILED" | "INVALID" | "REVERSED"
   */
  const statusCode = statusResult.status_code;
  const description = (statusResult.payment_status_description ?? '').toUpperCase();

  let newStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'PENDING';

  if (statusCode === 1 || description === 'COMPLETED') {
    newStatus = 'COMPLETED';
  } else if (statusCode === 2 || description === 'FAILED') {
    newStatus = 'FAILED';
  } else if (statusCode === 3 || description === 'REVERSED') {
    newStatus = 'CANCELLED';
  }

  // Find the subscription by merchant reference or tracking id
  const [sub] = await db
    .select()
    .from(coupleSubscriptions)
    .where(eq(coupleSubscriptions.pesapalMerchantReference, merchantReference))
    .limit(1);

  if (!sub) {
    console.error(`[PESAPAL IPN] No subscription found for ref: ${merchantReference}`);
    return { ok: false, error: 'Subscription not found' };
  }

  // Only process if status is actually changing
  if (sub.status === newStatus) {
    return { ok: true, status: newStatus, unchanged: true };
  }

  const now = new Date();
  const updatePayload: Record<string, any> = {
    pesapalOrderTrackingId: orderTrackingId,
    status: newStatus,
    updatedAt: now,
  };

  if (newStatus === 'COMPLETED') {
    updatePayload.startDate = now;
    updatePayload.endDate = new Date(now.getTime() + SUBSCRIPTION_DURATION_MS);
  }

  await db
    .update(coupleSubscriptions)
    .set(updatePayload)
    .where(eq(coupleSubscriptions.id, sub.id));

  console.log(`[PESAPAL IPN] Subscription ${sub.id} → ${newStatus} (ref: ${merchantReference})`);
  return { ok: true, status: newStatus };
}

// ── POST — IPN webhook called by PesaPal servers ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const orderTrackingId: string =
      body?.OrderTrackingId ?? body?.orderTrackingId ?? '';
    const merchantReference: string =
      body?.OrderMerchantReference ?? body?.orderMerchantReference ?? '';

    if (!orderTrackingId || !merchantReference) {
      console.warn('[PESAPAL IPN] POST missing required fields', body);
      return NextResponse.json({ error: 'Missing OrderTrackingId or OrderMerchantReference' }, { status: 400 });
    }

    const result = await processPayment(orderTrackingId, merchantReference);

    // PesaPal requires a 200 response with specific body to acknowledge IPN
    return NextResponse.json({ orderNotificationType: 'IPNCHANGE', orderTrackingId, orderMerchantReference: merchantReference, status: '200' });
  } catch (error: any) {
    console.error('[PESAPAL IPN] POST error:', error);
    // Still return 200 so PesaPal doesn't keep retrying on our server errors
    return NextResponse.json({ status: '200', message: 'Received' });
  }
}

// ── GET — handles both user redirect AND PesaPal GET-style IPN ───────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    // PesaPal appends these to both the callback_url redirect and GET-style IPN
    const orderTrackingId = searchParams.get('OrderTrackingId') ?? '';
    const merchantReference =
      searchParams.get('OrderMerchantReference') ??
      searchParams.get('OrderMerchantReference'.toLowerCase()) ??
      '';

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.andiza.co.rw';

    if (!orderTrackingId || !merchantReference) {
      return NextResponse.redirect(
        new URL('/pricing?payment=error&reason=missing_params', baseUrl)
      );
    }

    const result = await processPayment(orderTrackingId, merchantReference);

    if (result.status === 'COMPLETED') {
      return NextResponse.redirect(
        new URL(`/pricing/payment-success?ref=${encodeURIComponent(merchantReference)}`, baseUrl)
      );
    }

    if (result.status === 'FAILED' || result.status === 'CANCELLED') {
      return NextResponse.redirect(
        new URL(`/pricing/payment-cancel?ref=${encodeURIComponent(merchantReference)}&status=${result.status.toLowerCase()}`, baseUrl)
      );
    }

    // Still PENDING — show success page with pending state
    return NextResponse.redirect(
      new URL(`/pricing/payment-success?ref=${encodeURIComponent(merchantReference)}&pending=1`, baseUrl)
    );
  } catch (error: any) {
    console.error('[PESAPAL CALLBACK] GET error:', error);
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.andiza.co.rw';
    return NextResponse.redirect(new URL('/pricing?payment=error', baseUrl));
  }
}
