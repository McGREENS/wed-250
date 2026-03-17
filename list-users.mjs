import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const result = await client.execute('SELECT id, name, email, password, role, created_at FROM users');

console.log(`\nTotal users: ${result.rows.length}\n`);
result.rows.forEach((u, i) => {
  console.log(`[${i + 1}] ${u.role}`);
  console.log(`    Name    : ${u.name}`);
  console.log(`    Email   : ${u.email}`);
  console.log(`    Password: ${u.password}`);
  console.log(`    Created : ${u.created_at}`);
  console.log('');
});

await client.close();
