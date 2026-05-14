import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addReferralsTable() {
  try {
    console.log('Creating referrals table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referral_code TEXT NOT NULL UNIQUE,
        referred_email TEXT NOT NULL,
        referred_name TEXT,
        referred_role TEXT NOT NULL CHECK(referred_role IN ('COUPLE', 'VENDOR')),
        referred_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED')),
        email_sent INTEGER DEFAULT 0,
        email_sent_at INTEGER,
        accepted_at INTEGER,
        expires_at INTEGER NOT NULL,
        metadata TEXT,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    console.log('Creating index on referral_code...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code)
    `);

    console.log('Creating index on referrer_id...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id)
    `);

    console.log('Creating index on referred_email...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_referrals_email ON referrals(referred_email)
    `);

    console.log('✅ Referrals table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
}

addReferralsTable();
