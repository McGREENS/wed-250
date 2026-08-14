-- Migration: Add maxBookingsPerDay field to vendors table
-- This allows vendors to set the maximum number of bookings allowed per day

ALTER TABLE vendors ADD COLUMN max_bookings_per_day INTEGER DEFAULT 1;

-- Set default value for existing vendors (they can accept 1 booking per day by default)
UPDATE vendors SET max_bookings_per_day = 1 WHERE max_bookings_per_day IS NULL;

-- Add index for faster queries when checking booking capacity
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON bookings(vendor_id, event_date);
