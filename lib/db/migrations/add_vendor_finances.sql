CREATE TABLE IF NOT EXISTS vendor_finances (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  gross_income REAL NOT NULL DEFAULT 0,
  tax_rate REAL NOT NULL DEFAULT 18,
  tax_amount REAL NOT NULL DEFAULT 0,
  labour_costs REAL NOT NULL DEFAULT 0,
  net_profit REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vendor_finances_vendor_id ON vendor_finances(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_finances_month_year ON vendor_finances(month, year);
