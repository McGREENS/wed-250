import { NextResponse } from 'next/server';

export async function GET() {
  // Ask an external service what IP this server is making requests from
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return NextResponse.json({ serverIp: data.ip });
}
