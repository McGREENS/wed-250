import { createClient } from '@libsql/client';

async function verify() {
  try {
    const client = createClient({
      url: 'file:local.db'
    });

    // Check if vendor_finances table exists
    const result = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='vendor_finances'
    `);

    if (result.rows.length > 0) {
      console.log('✅ vendor_finances table exists');
      
      // Check table structure
      const schema = await client.execute(`PRAGMA table_info(vendor_finances)`);
      console.log('\n📋 Table Schema:');
      schema.rows.forEach(row => {
        console.log(`   - ${row.name}: ${row.type}`);
      });

      // Check if there are any records
      const count = await client.execute(`SELECT COUNT(*) as count FROM vendor_finances`);
      console.log(`\n📊 Total records: ${count.rows[0].count}`);
    } else {
      console.log('❌ vendor_finances table does not exist');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();
