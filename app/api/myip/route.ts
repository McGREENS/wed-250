import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export async function GET() {
  const endpointId = process.env.CENTIWISE_ENDPOINT_ID!;
  const controlKey = process.env.CENTIWISE_CONTROL_KEY!;

  const clientOrderId = `IPTEST-${Date.now()}`;
  const amount = 300;
  const amountMinor = String(Math.round(amount * 100));
  const email = 'laurierhab@gmail.com';

  const control = createHash('sha1')
    .update(endpointId + clientOrderId + amountMinor + email + controlKey)
    .digest('hex');

  const payload: Record<string, string | number> = {
    first_name: 'Laurier',
    last_name: 'Hab',
    email,
    phone: '250780115764',
    cell_phone: '250780115764',
    account_name: 'Laurier Hab',
    address1: 'Kigali',
    city: 'Kigali',
    zip_code: '00000',
    country: 'RW',
    amount,
    currency: 'RWF',
    ipaddress: '0.0.0.0',
    client_orderid: clientOrderId,
    order_desc: 'IP test',
    site_url: 'https://andiza.co.rw',
    purpose: 'MTN',
    redirect_url: 'https://andiza.co.rw/pricing/payment-success',
    server_callback_url: 'https://andiza.co.rw/api/subscriptions/centiwise/callback',
    control,
  };

  const formBody = new URLSearchParams();
  for (const [k, v] of Object.entries(payload)) formBody.append(k, String(v));

  const res = await fetch(
    `https://gate.centiwise.com/paynet/api/v2/sale-form/${endpointId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    }
  );

  const text = await res.text();

  // Also get our outbound IP
  const ipRes = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipRes.json();

  return NextResponse.json({
    outboundIp: ipData.ip,
    clientOrderId,
    centiwiseRawResponse: text,
  });
}
