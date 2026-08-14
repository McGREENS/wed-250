# Vendor Booking Capacity Management System

## Overview

This feature allows vendors to set the **maximum number of bookings they can accept per day**, preventing overbooking and ensuring service quality.

### Default Behavior
- **Default capacity**: 1 booking per day (exclusive service)
- **Maximum allowed**: 10 bookings per day
- **Minimum allowed**: 1 booking per day

---

## How It Works

### For Vendors

1. **Access Settings**
   - Go to `/vendor/settings`
   - Find "Daily Booking Capacity" section
   - Adjust the slider from 1-10 bookings per day

2. **Update Capacity**
   - Use the +/- buttons or direct input
   - Click "Save Changes"
   - Setting applies immediately to new bookings

3. **Monitor Usage**
   - Calendar shows booked dates
   - Vendor can see how many slots are used each day

### For Customers

1. **View Availability**
   - Browse vendor services at `/vendors/[id]/services/[serviceId]`
   - Try to select a date
   - System checks available capacity

2. **Booking Error (When At Capacity)**
   ```
   "Sorry, this vendor can only accept X booking(s) per day. This date is at full capacity."
   ```

3. **Successful Booking**
   - Date has available capacity
   - Booking submitted and confirmed
   - Email sent to both parties

---

## Database Changes

### New Field in `vendors` Table

```typescript
maxBookingsPerDay: integer("max_bookings_per_day").default(1)
```

**Migration SQL:**
```sql
ALTER TABLE vendors ADD COLUMN max_bookings_per_day INTEGER DEFAULT 1;
CREATE INDEX idx_bookings_vendor_date ON bookings(vendor_id, event_date);
```

### Applying the Migration

Run this migration against your database:

```bash
# Using Turso CLI
turso db shell <database> < lib/db/migrations/add_max_bookings_per_day.sql

# Or execute directly in Drizzle Studio
```

---

## API Endpoints

### 1. Get Capacity Settings
**Endpoint:** `GET /api/vendor/capacity-settings`

**Authentication:** Vendor role required

**Response:**
```json
{
  "maxBookingsPerDay": 2
}
```

---

### 2. Update Capacity Settings
**Endpoint:** `PUT /api/vendor/capacity-settings`

**Authentication:** Vendor role required

**Request:**
```json
{
  "maxBookingsPerDay": 3
}
```

**Response:**
```json
{
  "success": true,
  "maxBookingsPerDay": 3,
  "message": "Capacity settings updated successfully"
}
```

**Validation:**
- Must be integer between 1-10
- Returns 400 if invalid
- Returns 401 if not authenticated
- Returns 403 if not a vendor

---

### 3. Get Booked Dates with Capacity Info
**Endpoint:** `GET /api/vendors/booked-dates?vendorId={vendorId}`

**Response Format:**
```json
{
  "bookedDates": ["2024-01-15", "2024-01-16"],
  "maxBookingsPerDay": 2,
  "dateBookingMap": {
    "2024-01-15": 2,
    "2024-01-16": 1,
    "2024-01-17": 0
  },
  "capacityInfo": {
    "2024-01-15": {
      "bookings": 2,
      "max": 2,
      "available": false
    },
    "2024-01-16": {
      "bookings": 1,
      "max": 2,
      "available": true
    }
  }
}
```

**What This Means:**
- `bookedDates`: Dates at full capacity (cannot book)
- `dateBookingMap`: Count of bookings per date
- `capacityInfo`: Detailed capacity status per date
- `maxBookingsPerDay`: Vendor's capacity setting

---

### 4. Create Service Booking (Vendor Capacity Check)
**Endpoint:** `POST /api/bookings/service`

**New Validation:**
- Counts non-cancelled bookings for the selected date
- Compares against vendor's `maxBookingsPerDay`
- Returns 409 Conflict if at capacity

**Request:**
```json
{
  "vendorId": "vendor-123",
  "serviceId": "service-456",
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "eventDate": "2024-01-15"
}
```

**Response (Success):**
```json
{
  "success": true,
  "bookingId": "booking-789"
}
```

**Response (At Capacity):**
```json
{
  "error": "Sorry, this vendor can only accept 2 booking(s) per day. This date is at full capacity.",
  "statusCode": 409
}
```

---

## Code Changes Summary

### 1. Database Schema (`lib/db/schema.ts`)
- Added `maxBookingsPerDay: integer().default(1)` field to vendors table

### 2. Updated Endpoints

**`app/api/vendors/booked-dates/route.ts`**
- Fetches vendor's `maxBookingsPerDay` setting
- Groups bookings by date with counts
- Returns capacity information along with booked dates array
- Fully-booked dates only returned if count >= max

**`app/api/bookings/service/route.ts`**
- Added capacity validation before creating booking
- Counts existing non-cancelled bookings for selected date
- Compares count against vendor's `maxBookingsPerDay`
- Returns 409 if at capacity with descriptive error message

### 3. New Files

**`app/api/vendor/capacity-settings/route.ts`**
- GET: Retrieve vendor's capacity setting
- PUT: Update vendor's capacity setting (validation 1-10)
- Vendor role authentication required

**`app/vendor/settings/CapacitySettings.tsx`**
- React component for vendor capacity management UI
- Increment/decrement buttons and direct input
- Real-time save with validation
- Displays helpful information about capacity usage

---

## Usage Examples

### Example 1: Vendor Sets Capacity to 3 Per Day

```typescript
// Vendor calls update endpoint
const response = await fetch('/api/vendor/capacity-settings', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ maxBookingsPerDay: 3 })
});

// Vendor can now accept 3 bookings per day per date
```

### Example 2: Customer Books When 2 Slots Available

```typescript
// Customer tries to book on 2024-01-20 where vendor allows 3 bookings
// and currently has 1 booking

const response = await fetch('/api/bookings/service', {
  method: 'POST',
  body: JSON.stringify({
    vendorId: 'vendor-123',
    serviceId: 'service-456',
    eventDate: '2024-01-20',
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com'
  })
});

// Success! Booking created (2 of 3 slots now filled)
// { success: true, bookingId: 'booking-xyz' }
```

### Example 3: Customer Books When All Slots Full

```typescript
// Customer tries to book on 2024-01-21 where vendor allows 2 bookings
// and currently has 2 bookings (full)

const response = await fetch('/api/bookings/service', {
  method: 'POST',
  body: JSON.stringify({
    vendorId: 'vendor-123',
    serviceId: 'service-456',
    eventDate: '2024-01-21',  // Full (2 of 2 slots filled)
    clientName: 'John Smith',
    clientEmail: 'john@example.com'
  })
});

// Error! Status 409 Conflict
// { error: "Sorry, this vendor can only accept 2 booking(s) per day. This date is at full capacity." }
```

---

## Integration Steps

### 1. Apply Database Migration

```bash
# Option A: Using Turso CLI
turso db shell andiza-laurier < lib/db/migrations/add_max_bookings_per_day.sql

# Option B: Using Drizzle Studio (manual SQL execution)
# Go to npm run db:studio and execute the SQL directly
```

### 2. Add Capacity Settings to Vendor Dashboard

Update `/app/vendor/settings/page.tsx` to include:

```typescript
import CapacitySettings from '@/app/vendor/settings/CapacitySettings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* ... other settings ... */}
      <CapacitySettings />
    </div>
  );
}
```

### 3. Update Frontend Service Booking Form

The error handling is already in place. Just ensure error messages are displayed:

```typescript
if (!res.ok) {
  const errorData = await res.json();
  toast.error(errorData.error); // Shows capacity error message
  return;
}
```

---

## Features Included

✅ **Vendor Management**
- Set daily booking capacity (1-10)
- Real-time updates
- Settings UI with increment/decrement

✅ **Customer-Facing**
- Automatic capacity checking
- Clear error messages
- No overbooking possible

✅ **Backend Validation**
- Server-side capacity enforcement
- Cannot be bypassed by direct API calls
- Proper HTTP status codes (409 Conflict)

✅ **Monitoring**
- API returns booking counts per date
- Capacity information available
- Easy to add analytics/dashboard views

---

## Testing

### Test Case 1: Vendor Updates Capacity

```bash
# Vendor changes capacity to 3
curl -X PUT http://localhost:3000/api/vendor/capacity-settings \
  -H "Content-Type: application/json" \
  -d '{"maxBookingsPerDay": 3}'

# Response: { success: true, maxBookingsPerDay: 3 }
```

### Test Case 2: Multiple Bookings on Same Date

```bash
# First booking succeeds
curl -X POST http://localhost:3000/api/bookings/service \
  -H "Content-Type: application/json" \
  -d '{...booking 1...}'

# Second booking succeeds (2 of 3)
curl -X POST http://localhost:3000/api/bookings/service \
  -H "Content-Type: application/json" \
  -d '{...booking 2...}'

# Third booking succeeds (3 of 3)
curl -X POST http://localhost:3000/api/bookings/service \
  -H "Content-Type: application/json" \
  -d '{...booking 3...}'

# Fourth booking fails
curl -X POST http://localhost:3000/api/bookings/service \
  -H "Content-Type: application/json" \
  -d '{...booking 4...}'

# Response: { error: "...date is at full capacity..." }, status: 409
```

### Test Case 3: Cancelled Booking Frees Up Slot

```bash
# Cancel one of the 3 bookings
# Now capacity is 2 of 3 (one slot available)

# New booking succeeds (3 of 3 again)
curl -X POST http://localhost:3000/api/bookings/service \
  -H "Content-Type: application/json" \
  -d '{...new booking...}'
```

---

## Future Enhancements

1. **Per-Service Capacity**
   - Different capacity limits per service type
   - Photography can accept 3, Catering can accept 1

2. **Time-Based Capacity**
   - Morning (9-12): 2 bookings
   - Afternoon (12-17): 1 booking
   - Evening (17-21): 3 bookings

3. **Day-of-Week Capacity**
   - Weekends: 1 booking
   - Weekdays: 2 bookings

4. **Analytics Dashboard**
   - Capacity utilization percentage
   - Booking trends per date
   - Peak days identification

5. **Waitlist System**
   - Allow bookings beyond capacity
   - Queue for cancellations
   - Auto-notify when slot opens

---

## Troubleshooting

### Issue: Migration failed to apply

**Solution:**
```bash
# Check if column already exists
turso db shell andiza-laurier "PRAGMA table_info(vendors)"

# If max_bookings_per_day exists, migration already applied
# If not, run migration again with proper syntax
```

### Issue: Bookings still accepted when at capacity

**Solution:**
1. Verify API endpoint updated: `grep -r "maxBookingsPerDay" app/api`
2. Check vendor record in database has the field
3. Restart the dev server: `npm run dev`
4. Test with curl to bypass frontend

### Issue: Vendor capacity not updating

**Solution:**
```bash
# Check vendor record
turso db shell andiza-laurier \
  "SELECT id, max_bookings_per_day FROM vendors LIMIT 1"

# Update directly if needed
turso db shell andiza-laurier \
  "UPDATE vendors SET max_bookings_per_day = 2 WHERE id = 'vendor-id'"
```

---

## FAQ

**Q: Can vendors change capacity retroactively?**
A: Only for future bookings. Past/current bookings are unaffected.

**Q: What happens if vendor sets capacity to 0?**
A: The UI prevents this (minimum 1). API validation enforces it.

**Q: Can customers bypass this with direct API calls?**
A: No. Server-side validation in `POST /api/bookings/service` checks capacity.

**Q: How are cancelled bookings handled?**
A: They're excluded from capacity count, freeing up a slot immediately.

**Q: Can vendors have different capacities per service?**
A: Currently no. All services share the same daily capacity. Future enhancement.

**Q: What if vendor hasn't set capacity?**
A: Defaults to 1 (exclusive service). Can be changed anytime.

---

## Summary

This feature empowers vendors to:
- ✅ Control daily booking volume
- ✅ Prevent overbooking
- ✅ Maintain service quality
- ✅ Scale gradually (start at 1, increase to 2, 3, etc.)

And ensures customers get:
- ✅ Clear error messages when fully booked
- ✅ Fair chance to book available dates
- ✅ No confusion about availability
