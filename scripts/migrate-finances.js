import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    // Use local database
    const client = createClient({
      url: 'file:local.db'
    });

    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'lib', 'db', 'migrations', 'add_vendor_finances.sql'),
      'utf-8'
    );

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} statements to execute\n`);

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

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
