import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function push() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'db', 'migrations', 'add_vendor_finances.sql'),
    'utf-8'
  );

  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

  console.log('🚀 Pushing to Turso...\n');

  for (const statement of statements) {
    console.log('Executing:', statement.substring(0, 60) + '...');
    await client.execute(statement);
    console.log('✓ Done\n');
  }

  console.log('✅ Migration complete!');
}

push().catch(console.error);
