import Database from 'better-sqlite3';
const db = new Database('./local.db');
const rows = db.prepare(`
  SELECT id, vendor_id, client_name, service_type, service_package, status, created_at
  FROM bookings ORDER BY created_at DESC LIMIT 10
`).all();
console.log(JSON.stringify(rows, null, 2));
db.close();
