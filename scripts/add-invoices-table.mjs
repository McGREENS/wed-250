import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addInvoicesTable() {
  try {
    console.log('Creating invoices table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT NOT NULL UNIQUE,
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
        status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')),
        notes TEXT,
        terms TEXT,
        items TEXT NOT NULL,
        paid_at INTEGER,
        sent_at INTEGER,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    console.log('Creating indexes...');
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_id)
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id)
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number)
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status)
    `);

    console.log('✅ Invoices table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
}

addInvoicesTable();
