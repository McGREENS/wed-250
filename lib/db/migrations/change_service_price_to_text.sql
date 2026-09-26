-- Migration: Change service price from REAL to TEXT to support price ranges
-- This allows vendors to enter prices like "500,000 - 800,000 RWF"

-- Step 1: Create a new temporary column
ALTER TABLE services ADD COLUMN price_temp TEXT;

-- Step 2: Copy existing price data to the new column (convert REAL to TEXT)
UPDATE services SET price_temp = CAST(price AS TEXT);

-- Step 3: Drop the old price column
ALTER TABLE services DROP COLUMN price;

-- Step 4: Rename the temp column to price
ALTER TABLE services RENAME COLUMN price_temp TO price;

-- Step 5: Add NOT NULL constraint back
-- Note: SQLite doesn't support adding NOT NULL to existing column, 
-- so we'll handle this in the application validation