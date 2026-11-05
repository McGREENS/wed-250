/**
 * Centiwise payment gateway — server-only module.
 *
 * Routing:
 *   All requests go through the fixed-IP PHP relay on our cPanel server
 *   (relay.andiza.co.rw → 197.243.23.16) so Centiwise always sees a
 *   whitelisted IP regardless of which Vercel node handles the request.
 *
 *   The relay URL is used only as the HTTP destination.
 *   The control hash is computed using the real endpoint ID — it does not
 *   involve the relay URL at all.
 *
 * Runtime: Node.js only (never Edge / client components).
 */

import { createHash } from 'crypto';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CentiwisePayinRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cell_phone: string;
  account_name: string;   // required for Rwanda
  address1: string;
  city: string;
  zip_code: string;
  country: string;        // 'RW'
  amount: number;
  currency: string;       // 'RWF'
  ipaddress: string;
  client_orderid: string;
  order_desc: string;
  site_url: string;
  purpose: string;        // 'MTN' | 'AIRTEL'
  redirect_url: string;
  server_callback_url: string;
  control: string;
}

export interface CentiwiseSaleFormResponse {
  status?: string;
  redirect_url?: string;
  paynet_order_id?: string;
  merchant_order_id?: string;
  error_message?: string;
  error_code?: string;
  [key: string]: unknown;
}

export interface CentiwiseCallbackPayload {
  status: string;
  orderid: string;
  merchant_order_id?: string;
  client_orderid?: string;
  amount?: string | number;
  currency?: string;
  error_message?: string;
  approval_code?: string;
  [key: string]: unknown;
}

// ─── Config ────────────────────────────────────────────────────────────────────

function getConfig() {
  const login       = process.env.CENTIWISE_LOGIN;
  const controlKey  = process.env.CENTIWISE_CONTROL_KEY;
  const endpointId  = process.env.CENTIWISE_ENDPOINT_ID;
  const callbackUrl = process.env.CENTIWISE_CALLBACK_URL;
  const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL || 'https://andiza.co.rw';

  // Relay config — required in production
  const relayBaseUrl = process.env.RELAY_BASE_URL;   // https://relay.andiza.co.rw
  const relaySecret  = process.env.RELAY_SECRET;

  if (!login || !controlKey || !endpointId) {
    throw new Error(
      'Centiwise configuration missing. ' +
      'Ensure CENTIWISE_LOGIN, CENTIWISE_CONTROL_KEY and CENTIWISE_ENDPOINT_ID are set.'
    );
  }
  if (!relayBaseUrl || !relaySecret) {
    throw new Error(
      'Relay configuration missing. ' +
      'Ensure RELAY_BASE_URL and RELAY_SECRET are set in environment variables.'
    );
  }

  return { login, controlKey, endpointId, callbackUrl, siteUrl, relayBaseUrl, relaySecret };
}

// ─── Control Hash ──────────────────────────────────────────────────────────────

/**
 * SHA1(endpointid + client_orderid + amount_minor + email + control_key)
 *
 * Rules confirmed by Centiwise support:
 *   - SHA-1, lowercase hex, 40 chars
 *   - endpointid  = numeric endpoint ID (e.g. 108048) — NOT the login
 *   - amount      = minor units × 100, no decimal  (300 RWF → "30000")
 *   - email       = exact email field value in the request body
 *   - No currency, no separators
 */
export function buildControlHash(
  clientOrderId: string,
  amount: number,
  email: string
): string {
  const { controlKey, endpointId } = getConfig();
  const amountMinor = String(Math.round(amount * 100));
  const raw = endpointId + clientOrderId + amountMinor + email + controlKey;
  // Log inputs without the control key
  console.log('[CENTIWISE] Control hash inputs:', { endpointId, clientOrderId, amountMinor, email });
  return createHash('sha1').update(raw).digest('hex');
}

// ─── Payin via relay ───────────────────────────────────────────────────────────

/**
 * Initiate a mobile money payin via the fixed-IP PHP relay.
 *
 * Flow:
 *   Vercel → POST relay.andiza.co.rw/paynet/api/v2/sale-form/{endpointId}
 *          → PHP relay forwards to gate.centiwise.com (from IP 197.243.23.16)
 *          → Centiwise responds with redirect_url
 *          → User is redirected to Centiwise hosted payment page
 *          → STK push sent to user's phone
 *          → Centiwise POSTs callback to server_callback_url
 */
export async function initiateCentiwisePayin(params: {
  clientOrderId: string;
  amount: number;
  currency: 'RWF';
  customerName: string;
  customerEmail: string;
  customerPhone: string;  // 2507XXXXXXXX
  purpose: 'MTN' | 'AIRTEL';
  description: string;
  redirectUrl: string;
}): Promise<CentiwiseSaleFormResponse> {
  const { endpointId, callbackUrl, siteUrl, relayBaseUrl, relaySecret } = getConfig();

  const nameParts = params.customerName.trim().split(' ');
  const firstName = nameParts[0] ?? 'Customer';
  const lastName  = nameParts.slice(1).join(' ') || '-';

  const control = buildControlHash(params.clientOrderId, params.amount, params.customerEmail);

  const payload: CentiwisePayinRequest = {
    first_name:          firstName,
    last_name:           lastName,
    email:               params.customerEmail,
    phone:               params.customerPhone,
    cell_phone:          params.customerPhone,
    account_name:        params.customerName,
    address1:            'Kigali',
    city:                'Kigali',
    zip_code:            '00000',
    country:             'RW',
    amount:              params.amount,
    currency:            params.currency,
    ipaddress:           '41.186.0.1',
    client_orderid:      params.clientOrderId,
    order_desc:          params.description,
    site_url:            siteUrl,
    purpose:             params.purpose,
    redirect_url:        params.redirectUrl,
    server_callback_url: callbackUrl || `${siteUrl}/api/subscriptions/centiwise/callback`,
    control,
  };

  // Build the form-encoded body ONCE — this exact string is sent to the relay.
  // The control hash was already computed above on the same field values.
  const formBody = new URLSearchParams();
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) {
      formBody.append(k, String(v));
    }
  }
  const bodyString = formBody.toString();

  // Relay URL: relay.andiza.co.rw + the exact path the real gateway uses.
  // The relay validates this path against its allowlist before forwarding.
  const relayUrl = `${relayBaseUrl}/paynet/api/v2/sale-form/${endpointId}`;

  console.log('[CENTIWISE] POST via relay →', relayUrl, {
    clientOrderId: params.clientOrderId,
    amount:        params.amount,
    currency:      params.currency,
    purpose:       params.purpose,
    email:         params.customerEmail,
  });

  const response = await fetch(relayUrl, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'Accept':         '*/*',
      // Relay authentication — verified server-side with hash_equals()
      'X-Relay-Secret': relaySecret,
      // No Authorization header needed for sale-form (control hash auth only)
    },
    // Pass the body as a pre-built string so fetch cannot alter encoding
    body: bodyString,
    signal: AbortSignal.timeout(35000), // relay timeout (30s) + 5s buffer
  });

  const text = await response.text();
  console.log('[CENTIWISE] Raw response via relay:', response.status, text);

  // Parse form-encoded response (Centiwise always returns key=value&...)
  const data: CentiwiseSaleFormResponse = {};
  if (text.trim().startsWith('{')) {
    try { Object.assign(data, JSON.parse(text)); } catch { /* fall through */ }
  }
  if (Object.keys(data).length === 0 && text.includes('=')) {
    for (const [k, v] of new URLSearchParams(text).entries()) {
      data[k] = v.trim();
    }
  }

  console.log('[CENTIWISE] Parsed response:', data);

  // Check for gateway or relay errors
  if (response.status === 403) {
    throw new Error('Relay rejected request (403). Check RELAY_SECRET and allowed paths.');
  }
  if (response.status === 502) {
    throw new Error('Relay could not reach Centiwise (502). Check server connectivity.');
  }

  const responseType = String(data['type'] ?? '').trim();
  if (responseType === 'validation-error' || data['error-code'] || data['error-message']) {
    const msg = String(data['error-message'] ?? data['error-code'] ?? 'Validation error').trim();
    throw new Error(`Centiwise error: ${msg}`);
  }

  if (!response.ok) {
    throw new Error(`Relay returned HTTP ${response.status}`);
  }

  // Normalise hyphenated keys → underscored, trim all values
  const normalised: CentiwiseSaleFormResponse = {};
  for (const [k, v] of Object.entries(data)) {
    const clean = String(v).trim();
    normalised[k.replace(/-/g, '_')] = clean;
    normalised[k] = clean;
  }

  return normalised;
}

// ─── Callback helpers ──────────────────────────────────────────────────────────

/** Extract our client_orderid from a Centiwise webhook payload. */
export function getCallbackOrderId(payload: CentiwiseCallbackPayload): string | null {
  return payload.merchant_order_id ?? payload.client_orderid ?? null;
}

export function isPaymentSuccessful(status: string): boolean {
  return ['approved', 'success', 'completed', 'paid'].includes(status.toLowerCase());
}

export function isPaymentFailed(status: string): boolean {
  return ['declined', 'failed', 'cancelled', 'filtered', 'error'].includes(status.toLowerCase());
}

export function isPaymentPending(status: string): boolean {
  return ['processing', 'pending', 'initiated'].includes(status.toLowerCase());
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS = [
  {
    id:          'TEST' as const,
    name:        'Test',
    amount:      300,
    currency:    'RWF' as const,
    description: 'Test plan — for payment integration testing only.',
    badge:       'Testing' as string | null,
    highlight:   false,
    accountType: 'shared' as const,
    includes:    [{ text: 'Payment integration test', note: '300 RWF only' }],
  },
  {
    id:          'INDIVIDUAL' as const,
    name:        'Individual',
    amount:      30000,
    currency:    'RWF' as const,
    description: 'One shared dashboard, two users — plan together seamlessly.',
    badge:       null as null,
    highlight:   false,
    accountType: 'shared' as const,
    includes: [
      { text: '1 shared dashboard',         note: 'Both partners log in and see the same view' },
      { text: '2 user accounts',            note: 'Owner + 1 partner account included' },
      { text: 'Full wedding planning suite', note: null },
      { text: 'Vendor bookings & messaging', note: null },
      { text: 'Budget & expense tracker',   note: null },
      { text: 'Task list & wedding helpers', note: null },
      { text: 'Guest management',           note: null },
      { text: 'Venue tour scheduling',      note: null },
    ],
  },
  {
    id:          'COUPLE' as const,
    name:        'Couple',
    amount:      55000,
    currency:    'RWF' as const,
    description: 'Two fully independent accounts — each partner manages their own side.',
    badge:       'Best Value' as string | null,
    highlight:   true,
    accountType: 'separate' as const,
    includes: [
      { text: '2 separate dashboards',       note: 'Each partner has their own independent view' },
      { text: '2 independent accounts',      note: 'Manage tasks & vendors separately' },
      { text: 'Full wedding planning suite', note: 'For both accounts' },
      { text: 'Vendor bookings & messaging', note: null },
      { text: 'Budget & expense tracker',   note: null },
      { text: 'Task list & wedding helpers', note: null },
      { text: 'Guest management',           note: null },
      { text: 'Venue tour scheduling',      note: null },
    ],
  },
] as const;

export type PlanId           = (typeof SUBSCRIPTION_PLANS)[number]['id'];
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];
