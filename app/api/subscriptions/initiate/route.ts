import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { coupleSubscriptions, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  getPesapalToken,
  registerPesapalIPN,
  submitPesapalOrder,
  SUBSCRIPTION_PLANS,
  type PlanId,
} from '@/lib/pesapal';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only COUPLE accounts can subscribe
    if (session.user.role !== 'COUPLE') {
      return NextResponse.json(
        { error: 'Only couple accounts can subscribe to a plan' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { planId } = body as { planId: PlanId };

    // Validate plan
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: `Invalid plan. Choose from: ${SUBSCRIPTION_PLANS.map((p) => p.id).join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already has an active (COMPLETED) subscription
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
        {
          error: 'You already have an active subscription',
          subscription: {
            planId: existing.planId,
            planName: existing.planName,
            endDate: existing.endDate,
          },
        },
        { status: 409 }
      );
    }

    // Fetch user details for billing
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Split name into first / last
    const nameParts = (user.name ?? 'Andiza User').trim().split(/\s+/);
    const firstName = nameParts[0] ?? 'Andiza';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Build unique merchant reference
    const merchantReference = `ANDIZA-SUB-${session.user.id.slice(0, 8).toUpperCase()}-${Date.now()}`;

    // Construct URLs
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.andiza.co.rw';
    const callbackUrl = `${baseUrl}/api/subscriptions/callback?OrderMerchantReference=${merchantReference}`;
    const cancellationUrl = `${baseUrl}/pricing/payment-cancel?ref=${merchantReference}&status=cancelled`;
    const ipnUrl = `${baseUrl}/api/subscriptions/callback`;

    // Step 1 — get access token
    const { token } = await getPesapalToken();

    // Step 2 — ensure IPN is registered; use stored ID or register now
    let notificationId = process.env.PESAPAL_IPN_ID ?? '';
    if (!notificationId) {
      const ipnResult = await registerPesapalIPN(ipnUrl, token);
      notificationId = ipnResult.ipn_id;
      // Log it so the admin can save it in env (avoids re-registering on every request)
      console.log(`[PESAPAL] Registered new IPN — id: ${notificationId}. Set PESAPAL_IPN_ID=${notificationId} in .env`);
    }

    // Step 3 — create a PENDING subscription record first
    await db.insert(coupleSubscriptions).values({
      userId: session.user.id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      currency: plan.currency,
      pesapalMerchantReference: merchantReference,
      status: 'PENDING',
    } as any);

    // Step 4 — submit the order to PesaPal
    const orderResult = await submitPesapalOrder(
      {
        merchantReference,
        amount: plan.amount,
        currency: plan.currency,
        description: `Andiza ${plan.name} Subscription`,
        callbackUrl,
        cancellationUrl,
        notificationId,
        firstName,
        lastName,
        emailAddress: user.email,
        phoneNumber: user.phone ?? undefined,
      },
      token
    );

    // Step 5 — store the tracking ID returned by PesaPal
    await db
      .update(coupleSubscriptions)
      .set({
        pesapalOrderTrackingId: orderResult.order_tracking_id,
        updatedAt: new Date(),
      } as any)
      .where(eq(coupleSubscriptions.pesapalMerchantReference, merchantReference));

    return NextResponse.json({
      redirectUrl: orderResult.redirect_url,
      orderTrackingId: orderResult.order_tracking_id,
      merchantReference,
    });
  } catch (error: any) {
    console.error('[PESAPAL] Initiate error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
