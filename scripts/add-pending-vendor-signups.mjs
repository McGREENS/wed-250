import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_URL = 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA';

const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

async function migrate() {
  try {
    console.log('\n🔧 Creating pending_vendor_signups table...\n');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS pending_vendor_signups (
        id TEXT PRIMARY KEY,
        business_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_category TEXT NOT NULL,
        password TEXT NOT NULL,
        otp TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_pending_vendor_signups_email 
      ON pending_vendor_signups(email)
    `);

    console.log('✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
