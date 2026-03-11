/**
 * Wed-250 Database Connection Test
 * Run: node test-db.mjs
 */

import { createClient } from '@libsql/client';

console.log('\n🧪 Testing Wed-250 Database Connection\n');
console.log('='.repeat(50));

// Database credentials from .env
const DB_URL = 'libsql://database-rose-book-vercel-icfg-yewewbmsmdg5mps5mmjpurdl.aws-us-east-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxNDEzODksImlkIjoiMDE5Y2Q3NzYtNmYwMS03NzBjLWFjZDMtYjdlYjNmZjZhMTkzIiwicmlkIjoiYTJkMTJiM2QtNTVlMC00Y2QwLWIzZTItOTIzZmYwM2E4ZGNhIn0.7rHCGU4lAQmljCucx38dZc50ZEVP1HVLC7ZhOcbylil-e1jXRshkT8cPF0aTFuPBFmVJl6FojnUtMMSY7ScZCA';

console.log('📍 Database URL:', DB_URL);
console.log('🔑 Auth Token:', DB_TOKEN.substring(0, 20) + '...[HIDDEN]');
console.log('🌍 Region: AWS US East 1\n');

console.log('🔌 Attempting connection...\n');

try {
  const client = createClient({
    url: DB_URL,
    authToken: DB_TOKEN,
  });

  console.log('Test 1: Running SELECT 1...');
  const result1 = await client.execute('SELECT 1 as test');
  console.log('✅ Success:', JSON.stringify(result1.rows[0]));

  console.log('\nTest 2: Checking database tables...');
  const result2 = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  if (result2.rows.length > 0) {
    console.log('✅ Tables found:');
    result2.rows.forEach(row => console.log(`   - ${row.name}`));
  } else {
    console.log('ℹ️  No tables yet (empty database)');
  }

  console.log('\nTest 3: Creating test table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS test_connection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Test table created');

  console.log('\nTest 4: Inserting test data...');
  await client.execute({
    sql: 'INSERT INTO test_connection (message) VALUES (?)',
    args: ['Connection test successful!']
  });
  console.log('✅ Test data inserted');

  console.log('\nTest 5: Reading test data...');
  const result5 = await client.execute('SELECT * FROM test_connection ORDER BY id DESC LIMIT 1');
  console.log('✅ Data retrieved:', JSON.stringify(result5.rows[0]));

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ ALL TESTS PASSED!\n');
  console.log('Database is working perfectly!\n');
  console.log('Database Details:');
  console.log('  Name: database-rose-book-vercel');
  console.log('  Region: AWS US East 1');
  console.log('  Status: ✅ Connected and operational');
  console.log('  Tables:', result2.rows.length > 0 ? result2.rows.length : 'Empty (ready for schema)');
  console.log('\n💡 Next steps:');
  console.log('  1. Close your terminal completely');
  console.log('  2. Open a new terminal');
  console.log('  3. Run: npm run db:push');
  console.log('  4. Run: npm run dev\n');

} catch (error) {
  console.log('\n❌ CONNECTION FAILED!\n');
  console.log('Error:', error.message);
  console.log('\nPossible issues:');
  console.log('  - Token might be expired');
  console.log('  - Database might be deleted');
  console.log('  - Network connection issue');
  console.log('\nSolution:');
  console.log('  Generate a new token from Vercel dashboard\n');
  process.exit(1);
}
