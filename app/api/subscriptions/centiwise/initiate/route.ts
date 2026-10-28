import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db, client } from '@/lib/db';
import { coupleSubscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import {
  initiateCentiwisePayin,
  SUBSCRIPTION_PLANS,
  type PlanId,
} from '@/lib/centiwise';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { planId, purpose, phone } = body as {
      planId: string;
      purpose?: string;
      phone?: string;
    };

    // Validate plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
    }

    // Validate payment method — only MTN and AIRTEL for Rwanda
    const paymentMethod = (purpose ?? 'MTN').toUpperCase();
    if (!['MTN', 'AIRTEL'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method. Use MTN or AIRTEL.' },
        { status: 400 }
      );
    }

    // Check for existing active subscription
    const [existing] = await db
      .select()
      .from(coupleSubscriptions)
      .where(
        and(
          eq(coupleSubscriptions.userId, session.user.id),
          eq(coupleSubscriptions.status, 'COMPLETED')
        )
      )
      .limit(1);

    if (existing && existing.endDate && existing.endDate > new Date()) {
      return NextResponse.json(
        { error: 'You already have an active subscription.' },
        { status: 409 }
      );
    }

    // Build a unique order ID that encodes userId so the callback can find the user
    // Format: SUB-{planId}-{userId}-{timestamp}
    const timestamp = Date.now();
    const clientOrderId = `SUB-${planId}-${session.user.id}-${timestamp}`;

    const baseUrl = process.env.NEXTAUTH_URL || 'https://andiza.co.rw';

    // Use phone from request, user profile, or a placeholder
    // Customer must provide their mobile money number for the STK push
    const customerPhone = phone
      ? normalizePhone(phone)
      : '250788000000'; // fallback — user should provide real number

    console.log('[CENTIWISE INITIATE] Starting payment:', {
      userId: session.user.id,
      planId: plan.id,
      amount: plan.amount,
      purpose: paymentMethod,
      clientOrderId,
    });

    // Create a PENDING subscription record before redirecting
    await client.execute({
      sql: `INSERT INTO couple_subscriptions (id, user_id, plan_id, plan_name, amount, currency, status, pesapal_merchant_reference, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)`,
      args: [
        randomUUID(),
        session.user.id,
        plan.id,
        plan.name,
        plan.amount,
        plan.currency,
        clientOrderId,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
      ],
    });

    // Call Centiwise sale-form
    const result = await initiateCentiwisePayin({
      clientOrderId,
      amount: plan.amount,
      currency: 'RWF',
      customerName: session.user.name || session.user.email,
      customerEmail: session.user.email,
      customerPhone,
      purpose: paymentMethod as 'MTN' | 'AIRTEL',
      description: `Andiza ${plan.name} Plan — 1 year subscription`,
      redirectUrl: `${baseUrl}/pricing/payment-success?plan=${planId}&order=${clientOrderId}`,
    });

    console.log('[CENTIWISE INITIATE] Response:', result);

    // Centiwise sale-form returns a redirect_url for the hosted payment page
    // Response keys may be hyphenated (redirect-url) or underscored (redirect_url)
    const paymentUrl = result.redirect_url ?? result['redirect-url'] as string | undefined;
    if (!paymentUrl) {
      throw new Error('Centiwise did not return a payment URL. Response: ' + JSON.stringify(result));
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
      clientOrderId,
      paynetOrderId: result.paynet_order_id,
    });
  } catch (error: any) {
    console.error('[CENTIWISE INITIATE] Error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Payment initiation failed' },
      { status: 500 }
    );
  }
}

/**
 * Normalise a Rwandan phone number to 2507XXXXXXXX format (12 digits).
 * Accepts: 0780115764, 780115764, +250780115764, 250780115764
 */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('250') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return '25' + digits;        // 0780... → 250780...
  if ((digits.startsWith('7') || digits.startsWith('8')) && digits.length === 9) {
    return '250' + digits;  // 780... → 250780...
  }
  return digits;
}
