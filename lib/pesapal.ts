/**
 * PesaPal API v3 utility library
 *
 * Endpoints:
 *   Auth token  : POST /api/Auth/RequestToken
 *   Register IPN: POST /api/URLSetup/RegisterIPN
 *   Submit order: POST /api/Transactions/SubmitOrderRequest
 *   Order status: GET  /api/Transactions/GetTransactionStatus?orderTrackingId=...
 *
 * Sandbox base : https://cybqa.pesapal.com/pesapalv3
 * Live base    : https://pay.pesapal.com/v3
 */

// Read env at call-time (not module load time) so Next.js server components always see the value
function getBaseUrl(): string {
  const env = process.env.PESAPAL_ENV ?? 'live';
  return env === 'sandbox'
    ? 'https://cybqa.pesapal.com/pesapalv3'
    : 'https://pay.pesapal.com/v3';
}

/** @deprecated Use getBaseUrl() inside functions instead */
export const PESAPAL_BASE_URL = getBaseUrl();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PesapalToken {
  token: string;
  expiryDate: string; // UTC ISO string
}

export interface PesapalIpnResult {
  ipn_id: string;
  url: string;
  status: string;
}

export interface PesapalOrderResult {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  status: string;
  error: string | null;
}

export interface PesapalStatusResult {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string; // "PENDING" | "COMPLETED" | "FAILED" | "INVALID" | "REVERSED"
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number; // 0=INVALID 1=COMPLETED 2=FAILED 3=REVERSED
  merchant_reference: string;
  currency: string;
  error: string | null;
  status: string;
}

// ─── Token (no caching — token lasts 5 min, callers re-fetch per request) ─────

export async function getPesapalToken(): Promise<PesapalToken> {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET must be set');
  }

  const res = await fetch(`${getBaseUrl()}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PesaPal auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`PesaPal auth error: ${JSON.stringify(data.error)}`);
  }

  return { token: data.token, expiryDate: data.expiryDate };
}

// ─── IPN Registration ─────────────────────────────────────────────────────────

export async function registerPesapalIPN(
  ipnUrl: string,
  token: string
): Promise<PesapalIpnResult> {
  const res = await fetch(`${getBaseUrl()}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: ipnUrl,
      ipn_notification_type: 'POST', // PesaPal sends a POST notification to your IPN URL
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PesaPal IPN registration failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`PesaPal IPN registration error: ${JSON.stringify(data.error)}`);
  }

  return data as PesapalIpnResult;
}

// ─── Submit Order ─────────────────────────────────────────────────────────────

export interface SubmitOrderParams {
  /** Unique merchant order reference — stored in DB as pesapalMerchantReference */
  merchantReference: string;
  amount: number;
  currency: string; // "RWF"
  description: string;
  callbackUrl: string;     // where PesaPal redirects user after successful payment
  cancellationUrl: string; // where PesaPal redirects user if they cancel/go back
  notificationId: string;  // ipn_id obtained from registerPesapalIPN
  // Billing details
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

export async function submitPesapalOrder(
  params: SubmitOrderParams,
  token: string
): Promise<PesapalOrderResult> {
  const body = {
    id: params.merchantReference,
    currency: params.currency,
    amount: params.amount,
    description: params.description,
    callback_url: params.callbackUrl,
    cancellation_url: params.cancellationUrl,
    notification_id: params.notificationId,
    branch: '',
    billing_address: {
      email_address: params.emailAddress,
      phone_number: params.phoneNumber ?? '',
      country_code: 'RW',
      first_name: params.firstName,
      last_name: params.lastName,
      line_1: '',
      line_2: '',
      city: 'Kigali',
      state: 'Kigali',
      postal_code: '',
      zip_code: '',
    },
  };

  const res = await fetch(`${getBaseUrl()}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PesaPal order submission failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`PesaPal order submission error: ${JSON.stringify(data.error)}`);
  }

  return data as PesapalOrderResult;
}

// ─── Transaction Status ───────────────────────────────────────────────────────

export async function getPesapalTransactionStatus(
  orderTrackingId: string,
  token: string
): Promise<PesapalStatusResult> {
  const url = `${getBaseUrl()}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PesaPal status check failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`PesaPal status error: ${JSON.stringify(data.error)}`);
  }

  return data as PesapalStatusResult;
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS = [
  {
    id: 'INDIVIDUAL' as const,
    name: 'Individual',
    amount: 30000,
    currency: 'RWF',
    description: 'One shared dashboard, two users — plan together seamlessly.',
    badge: null,
    highlight: false,
    accountType: 'shared',
    // What they get
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
    currency: 'RWF',
    description: 'Two fully independent accounts — each partner manages their own side.',
    badge: 'Best Value',
    highlight: true,
    accountType: 'separate',
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
