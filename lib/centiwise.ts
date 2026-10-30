import { createHash } from 'crypto';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CentiwisePayinRequest {
  // Customer
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cell_phone: string;
  // Rwanda requires account_name = mobile money account holder name
  account_name: string;
  // Address (required fields, use defaults for Rwanda)
  address1: string;
  city: string;
  zip_code: string;
  country: string; // 'RW'
  // Payment
  amount: number;
  currency: string; // 'RWF'
  ipaddress: string;
  // Order
  client_orderid: string;
  order_desc: string;
  site_url: string;
  // Mobile money provider: 'MTN' | 'AIRTEL'
  purpose: string;
  // URLs
  redirect_url: string;
  server_callback_url: string;
  // Auth
  control: string;
}

export interface CentiwiseSaleFormResponse {
  // Centiwise sale-form returns a redirect URL or an error
  status?: string;
  redirect_url?: string;
  paynet_order_id?: string;
  merchant_order_id?: string;
  error_message?: string;
  error_code?: string;
  // Some responses wrap differently
  [key: string]: unknown;
}

export interface CentiwiseCallbackPayload {
  // Standard Centiwise webhook fields
  status: string;           // 'approved' | 'declined' | 'filtered' | 'processing'
  orderid: string;          // Centiwise internal order ID
  merchant_order_id?: string; // Our client_orderid
  client_orderid?: string;  // Our client_orderid (some versions use this)
  amount?: string | number;
  currency?: string;
  error_message?: string;
  approval_code?: string;
  card_printed_name?: string;
  [key: string]: unknown;
}

// ─── Config ────────────────────────────────────────────────────────────────────

function getConfig() {
  const login = process.env.CENTIWISE_LOGIN;
  const controlKey = process.env.CENTIWISE_CONTROL_KEY;
  const endpointId = process.env.CENTIWISE_ENDPOINT_ID;
  const callbackUrl = process.env.CENTIWISE_CALLBACK_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andiza.co.rw';

  if (!login || !controlKey || !endpointId) {
    throw new Error(
      'Centiwise configuration missing. Ensure CENTIWISE_LOGIN, CENTIWISE_CONTROL_KEY, and CENTIWISE_ENDPOINT_ID are set in .env'
    );
  }

  return { login, controlKey, endpointId, callbackUrl, siteUrl };
}

// ─── Control Hash ──────────────────────────────────────────────────────────────

/**
 * Build the control hash for sale-form payin requests.
 * Formula: SHA1(endpointid + client_orderid + amount + email + control_key)
 *
 * - SHA-1, lowercase hex (40 chars)
 * - endpointid = the numeric endpoint ID (e.g. 108048) — NOT the login
 * - amount = integer string in minor units, no decimal point (300 RWF → "300")
 * - email = exact email value sent in the request body
 * - No currency, no separators
 *
 * Reference: https://doc.centiwise.com/integration/API_commands/api_v2_sale.html
 */
export function buildControlHash(
  clientOrderId: string,
  amount: number,
  email: string
): string {
  const { controlKey, endpointId } = getConfig();
  // Amount in minor units (×100), no decimal — 300 RWF → "30000"
  const amountMinor = String(Math.round(amount * 100));
  const raw = endpointId + clientOrderId + amountMinor + email + controlKey;
  console.log('[CENTIWISE] Control hash: endpointId + orderid + amountMinor + email + <key>', { amountMinor });
  return createHash('sha1').update(raw).digest('hex');
}

// ─── Payin (sale-form redirect) ────────────────────────────────────────────────

/**
 * Initiate a mobile money payin via Centiwise sale-form redirect.
 *
 * The sale-form endpoint accepts a POST with form-encoded or JSON body,
 * and responds with a redirect_url that sends the customer to the
 * Centiwise hosted payment page (or directly pushes a STK to their phone).
 *
 * Endpoint: POST https://gate.centiwise.com/paynet/api/v2/sale-form/{endpointId}
 */
export async function initiateCentiwisePayin(params: {
  clientOrderId: string;
  amount: number;
  currency: 'RWF';
  customerName: string;
  customerEmail: string;
  customerPhone: string; // format: 2507XXXXXXXX
  purpose: 'MTN' | 'AIRTEL';
  description: string;
  redirectUrl: string;   // where user lands after payment
}): Promise<CentiwiseSaleFormResponse> {
  const { login, endpointId, callbackUrl, siteUrl } = getConfig();

  const nameParts = params.customerName.trim().split(' ');
  const firstName = nameParts[0] ?? 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '-';

  const control = buildControlHash(params.clientOrderId, params.amount, params.customerEmail);

  const payload: CentiwisePayinRequest = {
    first_name: firstName,
    last_name: lastName,
    email: params.customerEmail,
    phone: params.customerPhone,
    cell_phone: params.customerPhone,
    account_name: params.customerName, // required for Rwanda
    address1: 'Kigali',
    city: 'Kigali',
    zip_code: '00000',
    country: 'RW',
    amount: params.amount,
    currency: params.currency,
    ipaddress: '41.186.0.1', // Rwanda IP range placeholder
    client_orderid: params.clientOrderId,
    order_desc: params.description,
    site_url: siteUrl,
    purpose: params.purpose,
    redirect_url: params.redirectUrl,
    server_callback_url: callbackUrl || `${siteUrl}/api/subscriptions/centiwise/callback`,
    control,
  };

  const url = `https://gate.centiwise.com/paynet/api/v2/sale-form/${endpointId}`;

  // Build form-encoded body — Centiwise sale-form expects application/x-www-form-urlencoded
  const formBody = new URLSearchParams();
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) {
      formBody.append(k, String(v));
    }
  }

  console.log('[CENTIWISE] POST sale-form →', url, {
    clientOrderId: params.clientOrderId,
    amount: params.amount,
    currency: params.currency,
    purpose: params.purpose,
    email: params.customerEmail,
    phone: params.customerPhone,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
    },
    body: formBody.toString(),
    signal: AbortSignal.timeout(30000),
  });

  const text = await response.text();
  console.log('[CENTIWISE] Raw response:', response.status, text);

  // Centiwise returns form-encoded responses (key=value&key=value)
  // Parse it regardless of Content-Type
  let data: CentiwiseSaleFormResponse = {};
  if (text.trim().startsWith('{')) {
    try { data = JSON.parse(text); } catch { /* fall through to form parse */ }
  }
  if (Object.keys(data).length === 0 && text.includes('=')) {
    const params = new URLSearchParams(text);
    for (const [k, v] of params.entries()) {
      data[k] = v;
    }
  }

  console.log('[CENTIWISE] Parsed response:', data);

  // Check for validation errors (returned as type=validation-error)
  if (data['type'] === 'validation-error' || data['error-code'] || data['error-message']) {
    const msg = data['error-message'] ?? data['error-code'] ?? 'Validation error';
    throw new Error(`Centiwise validation error: ${msg}`);
  }

  if (!response.ok) {
    throw new Error(`Centiwise HTTP error: ${response.status}`);
  }

  // Normalise hyphenated keys to underscored for consistent access
  // e.g. redirect-url → redirect_url, paynet-order-id → paynet_order_id
  const normalised: CentiwiseSaleFormResponse = {};
  for (const [k, v] of Object.entries(data)) {
    normalised[k.replace(/-/g, '_')] = v;
    normalised[k] = v; // keep original too
  }

  return normalised;
}

// ─── Callback helpers ──────────────────────────────────────────────────────────

/**
 * Normalise the client_orderid from a callback — Centiwise may send it
 * as merchant_order_id or client_orderid depending on the version.
 */
export function getCallbackOrderId(payload: CentiwiseCallbackPayload): string | null {
  return (
    payload.merchant_order_id ??
    payload.client_orderid ??
    null
  );
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
    id: 'TEST' as const,
    name: 'Test',
    amount: 300,
    currency: 'RWF' as const,
    description: 'Test plan — for payment integration testing only.',
    badge: 'Testing' as string | null,
    highlight: false,
    accountType: 'shared' as const,
    includes: [
      { text: 'Payment integration test', note: '300 RWF only' },
    ],
  },
  {
    id: 'INDIVIDUAL' as const,
    name: 'Individual',
    amount: 30000,
    currency: 'RWF' as const,
    description: 'One shared dashboard, two users — plan together seamlessly.',
    badge: null as null,
    highlight: false,
    accountType: 'shared' as const,
    includes: [
      { text: '1 shared dashboard', note: 'Both partners log in and see the same view' },
      { text: '2 user accounts', note: 'Owner + 1 partner account included' },
      { text: 'Full wedding planning suite', note: null },
      { text: 'Vendor bookings & messaging', note: null },
      { text: 'Budget & expense tracker', note: null },
      { text: 'Task list & wedding helpers', note: null },
      { text: 'Guest management', note: null },
      { text: 'Venue tour scheduling', note: null },
    ],
  },
  {
    id: 'COUPLE' as const,
    name: 'Couple',
    amount: 55000,
    currency: 'RWF' as const,
    description: 'Two fully independent accounts — each partner manages their own side.',
    badge: 'Best Value' as string | null,
    highlight: true,
    accountType: 'separate' as const,
    includes: [
      { text: '2 separate dashboards', note: 'Each partner has their own independent view' },
      { text: '2 independent accounts', note: 'Manage tasks & vendors separately' },
      { text: 'Full wedding planning suite', note: 'For both accounts' },
      { text: 'Vendor bookings & messaging', note: null },
      { text: 'Budget & expense tracker', note: null },
      { text: 'Task list & wedding helpers', note: null },
      { text: 'Guest management', note: null },
      { text: 'Venue tour scheduling', note: null },
    ],
  },
] as const;

export type PlanId = (typeof SUBSCRIPTION_PLANS)[number]['id'];
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];
