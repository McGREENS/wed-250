/**
 * Add venue_tours table to database
 * Run: node migrate-venue-tours.mjs
 */

import { createClient } from '@libsql/client';

const DB_URL = 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA';

console.log('\n🔄 Adding venue_tours table...\n');

const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

try {
  // Create venue_tours table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS venue_tours (
      id TEXT PRIMARY KEY,
      venue_id TEXT NOT NULL,
      user_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      tour_date INTEGER NOT NULL,
      tour_time TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ venue_tours table created successfully!\n');
  console.log('📋 Table structure:');
  console.log('   - id (TEXT, PRIMARY KEY)');
  console.log('   - venue_id (TEXT, NOT NULL)');
  console.log('   - user_id (TEXT, FOREIGN KEY)');
  console.log('   - name (TEXT, NOT NULL)');
  console.log('   - email (TEXT, NOT NULL)');
  console.log('   - phone (TEXT, NOT NULL)');
  console.log('   - tour_date (INTEGER, NOT NULL)');
  console.log('   - tour_time (TEXT, NOT NULL)');
  console.log('   - status (TEXT, DEFAULT PENDING)');
  console.log('   - notes (TEXT)');
  console.log('   - created_at (INTEGER, NOT NULL)');
  console.log('   - updated_at (INTEGER, NOT NULL)\n');

  console.log('🎉 Migration completed successfully!\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
