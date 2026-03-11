/**
 * Push Database Schema to Turso
 * Run: node push-schema.mjs
 */

import { createClient } from '@libsql/client';

const DB_URL = 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA';

console.log('\n📦 Pushing Schema to Turso Database...\n');

const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

try {
  // Users table
  console.log('Creating users table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      email_verified INTEGER,
      image TEXT,
      password TEXT,
      role TEXT DEFAULT 'COUPLE' NOT NULL,
      phone TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Vendors table
  console.log('Creating vendors table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      location TEXT,
      price_range TEXT,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      images TEXT,
      portfolio TEXT,
      services TEXT,
      availability TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Weddings table
  console.log('Creating weddings table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS weddings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      couple_names TEXT NOT NULL,
      wedding_date INTEGER,
      venue_id TEXT,
      budget REAL DEFAULT 0,
      guest_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'PLANNING',
      notes TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Bookings table
  console.log('Creating bookings table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      wedding_id TEXT REFERENCES weddings(id) ON DELETE CASCADE,
      vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      client_name TEXT,
      client_email TEXT,
      client_phone TEXT,
      event_type TEXT,
      service_package TEXT,
      service_type TEXT,
      booking_date INTEGER,
      event_date INTEGER,
      status TEXT DEFAULT 'pending',
      total_amount REAL,
      amount REAL,
      deposit_amount REAL,
      payment_status TEXT DEFAULT 'UNPAID',
      notes TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Service Packages table
  console.log('Creating service_packages table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS service_packages (
      id TEXT PRIMARY KEY,
      vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      features TEXT,
      active INTEGER DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Reviews table
  console.log('Creating reviews table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
      venue_id TEXT,
      rating INTEGER NOT NULL,
      comment TEXT,
      images TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Favorites table
  console.log('Creating favorites table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
      venue_id TEXT,
      created_at INTEGER
    )
  `);

  console.log('\n✅ All tables created successfully!\n');
  console.log('🎉 Database is ready to use!\n');
  console.log('Next step: npm run dev\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
