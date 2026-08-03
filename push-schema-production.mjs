import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA'
});

const schemas = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified INTEGER,
    image TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'COUPLE' NOT NULL,
    phone TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Accounts table (OAuth)
  `CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
  )`,

  // Sessions table
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL
  )`,

  // Verification tokens
  `CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires INTEGER NOT NULL
  )`,

  // Vendors table
  `CREATE TABLE IF NOT EXISTS vendors (
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
    calendar_published INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Venues table
  `CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    max_capacity INTEGER,
    venue_type TEXT,
    price_per_day REAL,
    amenities TEXT,
    images TEXT,
    featured INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Weddings table
  `CREATE TABLE IF NOT EXISTS weddings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    couple_names TEXT NOT NULL,
    wedding_date INTEGER,
    venue_id TEXT REFERENCES venues(id),
    budget REAL DEFAULT 0,
    guest_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PLANNING',
    notes TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Bookings table
  `CREATE TABLE IF NOT EXISTS bookings (
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
  )`,

  // Booking Payments table
  `CREATE TABLE IF NOT EXISTS booking_payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    note TEXT,
    paid_at INTEGER NOT NULL,
    created_at INTEGER
  )`,

  // Reviews table
  `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
    venue_id TEXT REFERENCES venues(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    images TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Favorites table
  `CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
    venue_id TEXT,
    created_at INTEGER
  )`,

  // Venue Tours table
  `CREATE TABLE IF NOT EXISTS venue_tours (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    tour_date INTEGER NOT NULL,
    tour_time TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    notes TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Service Packages table
  `CREATE TABLE IF NOT EXISTS service_packages (
    id TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    features TEXT,
    metadata TEXT,
    image TEXT,
    active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Tasks table
  `CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    timeline TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    custom INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Contact Messages table
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'UNREAD',
    created_at INTEGER
  )`,

  // Pending Vendor Signups table
  `CREATE TABLE IF NOT EXISTS pending_vendor_signups (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_category TEXT NOT NULL,
    password TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    metadata TEXT,
    created_at INTEGER
  )`,

  // Pending Couple Signups table
  `CREATE TABLE IF NOT EXISTS pending_couple_signups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    wedding_date TEXT,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    metadata TEXT,
    created_at INTEGER
  )`,

  // Conversations table
  `CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    couple_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
    last_message_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Messages table
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at INTEGER
  )`,

  // Public Referral Links table
  `CREATE TABLE IF NOT EXISTS public_referral_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    referral_role TEXT NOT NULL,
    title TEXT,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Referrals table
  `CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    referred_email TEXT NOT NULL,
    referred_name TEXT,
    referred_role TEXT NOT NULL,
    referred_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    email_sent INTEGER DEFAULT 0,
    email_sent_at INTEGER,
    accepted_at INTEGER,
    expires_at INTEGER NOT NULL,
    public_link_id TEXT REFERENCES public_referral_links(id) ON DELETE SET NULL,
    metadata TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,

  // Invoices table
  `CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
    client_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_address TEXT,
    issue_date INTEGER NOT NULL,
    due_date INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    tax_rate REAL DEFAULT 18,
    tax_amount REAL NOT NULL,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    color TEXT DEFAULT '#8B4513',
    notes TEXT,
    terms TEXT,
    items TEXT NOT NULL,
    paid_at INTEGER,
    sent_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  )`
];

async function pushSchema() {
  console.log('Starting schema migration to production Turso DB...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const schema of schemas) {
    const tableName = schema.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
    try {
      await client.execute(schema);
      console.log(`✓ Created table: ${tableName}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to create table ${tableName}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✓ Migration complete: ${successCount} tables created, ${errorCount} errors`);
}

pushSchema().catch(console.error);
