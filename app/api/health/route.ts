import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      nextauthUrl: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
      nextauthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      tursoDatabaseUrl: process.env.TURSO_DATABASE_URL ? 'SET' : 'MISSING',
      tursoAuthToken: process.env.TURSO_AUTH_TOKEN ? 'SET' : 'MISSING',
    },
    database: 'NOT_TESTED'
  };

  // Test database connection
  try {
    const { createClient } = await import('@libsql/client');
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    
    await client.execute('SELECT 1');
    checks.database = 'CONNECTED';
    await client.close();
  } catch (error: any) {
    checks.database = `ERROR: ${error.message}`;
  }

  return NextResponse.json(checks);
}
