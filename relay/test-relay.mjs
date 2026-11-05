/**
 * Relay test script
 * Usage: node relay/test-relay.mjs
 *
 * Requires RELAY_BASE_URL and RELAY_SECRET to be set in .env
 * Requires the relay to be deployed and reachable.
 */

import { createHash } from 'crypto';
import { config } from 'dotenv';
config();

const RELAY_BASE    = process.env.RELAY_BASE_URL;
const RELAY_SECRET  = process.env.RELAY_SECRET;
const ENDPOINT_ID   = process.env.CENTIWISE_ENDPOINT_ID;
const CONTROL_KEY   = process.env.CENTIWISE_CONTROL_KEY;

if (!RELAY_BASE || !RELAY_SECRET || !ENDPOINT_ID || !CONTROL_KEY) {
  console.error('❌ Missing env vars: RELAY_BASE_URL, RELAY_SECRET, CENTIWISE_ENDPOINT_ID, CENTIWISE_CONTROL_KEY');
  process.exit(1);
}

const RELAY_PATH = `/paynet/api/v2/sale-form/${ENDPOINT_ID}`;

let passed = 0;
let failed = 0;

async function test(name, fn) {
  process.stdout.write(`  ${name} ... `);
  try {
    await fn();
    console.log('✅ PASS');
    passed++;
  } catch (e) {
    console.log(`❌ FAIL: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ── Build a valid test payload ────────────────────────────────────────────────
function buildPayload(orderId) {
  const amount      = 300;
  const amountMinor = String(Math.round(amount * 100)); // 30000
  const email       = 'laurierhab@gmail.com';
  const control     = createHash('sha1')
    .update(ENDPOINT_ID + orderId + amountMinor + email + CONTROL_KEY)
    .digest('hex');

  const p = new URLSearchParams({
    first_name:          'Test',
    last_name:           'User',
    email,
    phone:               '250780115764',
    cell_phone:          '250780115764',
    account_name:        'Test User',
    address1:            'Kigali',
    city:                'Kigali',
    zip_code:            '00000',
    country:             'RW',
    amount:              String(amount),
    currency:            'RWF',
    ipaddress:           '41.186.0.1',
    client_orderid:      orderId,
    order_desc:          'Relay test',
    site_url:            'https://andiza.co.rw',
    purpose:             'MTN',
    redirect_url:        'https://andiza.co.rw/pricing/payment-success',
    server_callback_url: 'https://andiza.co.rw/api/subscriptions/centiwise/callback',
    control,
  });
  return p.toString();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log(`\nRelay: ${RELAY_BASE}${RELAY_PATH}\n`);

await test('GET returns 405', async () => {
  const res = await fetch(`${RELAY_BASE}${RELAY_PATH}`, {
    method: 'GET',
    headers: { 'X-Relay-Secret': RELAY_SECRET },
  });
  assert(res.status === 405, `Expected 405, got ${res.status}`);
});

await test('Missing secret returns 403', async () => {
  const res = await fetch(`${RELAY_BASE}${RELAY_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildPayload(`SECTEST-${Date.now()}`),
  });
  assert(res.status === 403, `Expected 403, got ${res.status}`);
});

await test('Wrong secret returns 403', async () => {
  const res = await fetch(`${RELAY_BASE}${RELAY_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'X-Relay-Secret': 'wrong-secret-value',
    },
    body: buildPayload(`WRONGSEC-${Date.now()}`),
  });
  assert(res.status === 403, `Expected 403, got ${res.status}`);
});

await test('Disallowed path returns 403', async () => {
  const res = await fetch(`${RELAY_BASE}/admin/config`, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'X-Relay-Secret': RELAY_SECRET,
    },
    body: 'test=1',
  });
  assert(res.status === 403, `Expected 403, got ${res.status}`);
});

await test('Path traversal attempt returns 403', async () => {
  const res = await fetch(`${RELAY_BASE}/paynet/api/v2/../../../etc/passwd`, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'X-Relay-Secret': RELAY_SECRET,
    },
    body: 'test=1',
  });
  assert(res.status === 403, `Expected 403, got ${res.status}`);
});

await test('Valid request reaches Centiwise and returns a response', async () => {
  const orderId = `RELAYTEST-${Date.now()}`;
  const res = await fetch(`${RELAY_BASE}${RELAY_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'X-Relay-Secret': RELAY_SECRET,
    },
    body: buildPayload(orderId),
  });

  const text = await res.text();
  console.log(`\n     Response (${res.status}): ${text.replace(/\n/g, ' ').substring(0, 200)}`);

  // We accept any response that came FROM Centiwise (not a relay error)
  assert(res.status !== 403, 'Relay rejected the request (403)');
  assert(res.status !== 502, 'Relay could not reach Centiwise (502)');
  assert(res.status !== 405, 'Relay rejected method (405)');
  assert(text.includes('merchant-order-id') || text.includes('redirect-url'),
    'Response does not look like a Centiwise response');

  if (text.includes('async-form-response')) {
    console.log('     ✅ Got redirect URL — Centiwise accepted the request!');
  } else if (text.includes('Bad+request+IP') || text.includes('Bad request IP')) {
    console.log('     ⚠️  Centiwise responded but IP not whitelisted yet — ask Godwin to whitelist 197.243.23.16');
  } else if (text.includes('INVALID_CONTROL_CODE')) {
    console.log('     ⚠️  Control hash mismatch — check CENTIWISE_CONTROL_KEY');
  }
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
