import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to Turso database...');
    console.log(`   URL: ${url}`);

    const client = createClient({
      url,
      authToken
    });

    // Check if table already exists
    console.log('\n🔍 Checking if vendor_finances table exists...');
    const checkTable = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='vendor_finances'
    `);

    if (checkTable.rows.length > 0) {
      console.log('⚠️  vendor_finances table already exists in remote database');
      console.log('   Skipping migration to prevent data loss');
      process.exit(0);
    }

    console.log('✓ Table does not exist, proceeding with migration\n');

    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'lib', 'db', 'migrations', 'add_vendor_finances.sql'),
      'utf-8'
    );

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
      console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
      try {
        await client.execute(statement);
        console.log(`    ✓ Success\n`);
      } catch (err) {
        console.error(`    ✗ Error: ${err.message}\n`);
        throw err;
      }
    }

    // Verify the table was created
    console.log('🔍 Verifying table creation...');
    const verify = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='vendor_finances'
    `);

    if (verify.rows.length > 0) {
      console.log('✅ vendor_finances table created successfully in remote database!');
      
      // Check table structure
      const schema = await client.execute(`PRAGMA table_info(vendor_finances)`);
      console.log('\n📋 Table Schema:');
      schema.rows.forEach(row => {
        console.log(`   - ${row.name}: ${row.type}`);
      });
    } else {
      console.log('❌ Table verification failed');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
