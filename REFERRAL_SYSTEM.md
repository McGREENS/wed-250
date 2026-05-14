# Referral System Documentation

## Overview
Professional referral system allowing users to invite others to join the platform as either Couples or Vendors. Built according to international standards with email notifications, tracking, and expiration management.

## Features

### 1. **Referral Link Generation**
- Unique cryptographic referral codes (32 characters hex)
- Role-specific invitations (COUPLE or VENDOR)
- 30-day expiration period
- Automatic duplicate prevention

### 2. **Email Invitations**
- Professional HTML email templates
- Personalized with referrer's name
- Role-specific benefits listed
- Clickable invitation links
- Expiration date clearly displayed
- Responsive design for all devices

### 3. **Referral Tracking**
- Real-time status monitoring (PENDING, ACCEPTED, EXPIRED, CANCELLED)
- Email delivery confirmation
- Acceptance timestamp
- Referred user linkage
- Complete audit trail

### 4. **Dashboard Analytics**
- Total referrals count
- Pending invitations
- Accepted referrals
- Detailed referral table with:
  - Invitee information
  - Role assignment
  - Status badges
  - Email delivery status
  - Expiration dates
  - Copy link functionality

## Database Schema

```sql
CREATE TABLE referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  referred_role TEXT NOT NULL CHECK(referred_role IN ('COUPLE', 'VENDOR')),
  referred_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED')),
  email_sent INTEGER DEFAULT 0,
  email_sent_at INTEGER,
  accepted_at INTEGER,
  expires_at INTEGER NOT NULL,
  metadata TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Indexes for performance
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_email ON referrals(referred_email);
```

## API Endpoints

### POST /api/referrals
Create a new referral invitation.

**Request Body:**
```json
{
  "referredEmail": "invitee@example.com",
  "referredName": "John Doe",
  "referredRole": "COUPLE" | "VENDOR"
}
```

**Response:**
```json
{
  "success": true,
  "referral": {
    "id": "uuid",
    "referralCode": "hex-code",
    "referredEmail": "invitee@example.com",
    "referredRole": "COUPLE",
    "status": "PENDING",
    "expiresAt": "2024-02-10T00:00:00Z",
    "emailSent": true
  },
  "message": "Invitation sent successfully"
}
```

**Validations:**
- Email format validation
- Role must be COUPLE or VENDOR
- Email not already registered
- No pending referral for same email
- Unique referral code generation

### GET /api/referrals
Fetch all referrals for the logged-in user.

**Response:**
```json
{
  "referrals": [
    {
      "id": "uuid",
      "referralCode": "hex-code",
      "referredEmail": "invitee@example.com",
      "referredName": "John Doe",
      "referredRole": "COUPLE",
      "status": "ACCEPTED",
      "emailSent": true,
      "emailSentAt": "2024-01-10T10:00:00Z",
      "acceptedAt": "2024-01-11T15:30:00Z",
      "expiresAt": "2024-02-10T00:00:00Z",
      "createdAt": "2024-01-10T10:00:00Z",
      "referredUserName": "John Doe"
    }
  ]
}
```

### GET /api/referrals/[code]
Verify a referral code.

**Response (Valid):**
```json
{
  "valid": true,
  "referral": {
    "referredEmail": "invitee@example.com",
    "referredName": "John Doe",
    "referredRole": "COUPLE",
    "referrerName": "Jane Smith",
    "expiresAt": "2024-02-10T00:00:00Z"
  }
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "error": "Invalid referral code" | "This referral link has expired" | "This referral has already been used"
}
```

## User Flow

### For Referrer (Inviting User)

1. **Navigate to Referrals Page**
   - Vendor: `/vendor/referrals`
   - Couple: `/dashboard/referrals`

2. **Click "Send Invitation" Button**
   - Modal opens with invitation form

3. **Fill Invitation Form**
   - Enter invitee's email (required)
   - Enter invitee's name (optional)
   - Select role: COUPLE or VENDOR (required)

4. **Submit Invitation**
   - System validates email
   - Generates unique referral code
   - Sends professional email to invitee
   - Shows success message
   - Updates referrals table

5. **Track Referrals**
   - View all sent invitations
   - See status (Pending/Accepted/Expired)
   - Copy referral link manually
   - Monitor email delivery
   - Check expiration dates

### For Invitee (Referred User)

1. **Receive Email Invitation**
   - Professional HTML email
   - See who invited them
   - Understand role (Couple or Vendor)
   - View benefits of joining
   - See expiration date

2. **Click Invitation Link**
   - Redirected to signup page with referral code
   - Example: `/auth/signup?ref=abc123...`

3. **Signup Process**
   - Referral code automatically validated
   - Email pre-filled (if in referral)
   - Role pre-selected based on invitation
   - Complete signup form
   - Submit registration

4. **Account Creation**
   - User account created
   - Referral marked as ACCEPTED
   - Referrer notified of acceptance
   - Referred user linked to referrer

## Email Template

The invitation email includes:

- **Header**: Branded gradient header with "You're Invited!"
- **Personalization**: Referrer's name and invitee's name
- **Role-Specific Benefits**:
  - For Vendors: Showcase services, manage bookings, communicate with clients, build portfolio
  - For Couples: Browse vendors, plan wedding, manage budget, communicate with vendors
- **Call-to-Action**: Large "Accept Invitation" button
- **Expiration Notice**: Clear expiration date
- **Fallback Link**: Plain text link if button doesn't work
- **Footer**: Copyright and branding

## Security Features

1. **Cryptographic Code Generation**
   - 32-character hexadecimal codes
   - Collision detection and regeneration
   - Unique constraint in database

2. **Email Validation**
   - Format validation
   - Duplicate registration prevention
   - Email-code matching on signup

3. **Expiration Management**
   - 30-day validity period
   - Automatic expiration checking
   - Status updates on expired codes

4. **Authorization**
   - Authentication required for all operations
   - Users can only view their own referrals
   - Referral ownership validation

5. **Data Integrity**
   - Foreign key constraints
   - Cascade deletions
   - Null handling for optional fields

## Status Lifecycle

```
PENDING → ACCEPTED (when invitee signs up)
PENDING → EXPIRED (after 30 days or manual check)
PENDING → CANCELLED (manual cancellation - future feature)
```

## UI Components

### Referrals Dashboard
- **Location**: `/vendor/referrals` and `/dashboard/referrals`
- **Components**:
  - Header with "Send Invitation" button
  - Statistics cards (Total, Pending, Accepted)
  - Referrals table with sorting
  - Status badges with icons
  - Copy link functionality
  - Loading states
  - Empty states

### Invitation Modal
- **Fields**:
  - Email (required, validated)
  - Name (optional)
  - Role selector (COUPLE/VENDOR)
- **Actions**:
  - Cancel button
  - Send button with loading state
- **Validation**:
  - Real-time email validation
  - Required field indicators
  - Error messages

### Status Badges
- **PENDING**: Yellow badge with clock icon
- **ACCEPTED**: Green badge with checkmark icon
- **EXPIRED**: Gray badge with X icon
- **CANCELLED**: Red badge with X icon

## Integration Points

### Signup Flow
1. Check for `ref` query parameter
2. Validate referral code via API
3. Pre-fill email and role if valid
4. Show referrer information
5. Complete signup
6. Update referral status to ACCEPTED

### Navigation
- Added to vendor sidebar (after Portfolio)
- Added to couple sidebar (after Wedding Settings)
- Icon: UserPlus from lucide-react

## Future Enhancements

1. **Referral Rewards**
   - Points system for successful referrals
   - Discounts or credits for referrers
   - Badges for top referrers

2. **Bulk Invitations**
   - CSV upload for multiple invitations
   - Email list integration
   - Batch processing

3. **Social Sharing**
   - Share via WhatsApp, Facebook, Twitter
   - QR code generation
   - Shareable referral cards

4. **Analytics**
   - Conversion rates
   - Time-to-acceptance metrics
   - Referral source tracking
   - Performance dashboards

5. **Reminders**
   - Email reminders for pending invitations
   - Expiration warnings
   - Re-invitation functionality

6. **Cancellation**
   - Manual referral cancellation
   - Bulk cancellation
   - Cancellation reasons

## Files Created/Modified

### Created
- `lib/db/schema.ts` - Added referrals table
- `scripts/add-referrals-table.mjs` - Database migration
- `app/api/referrals/route.ts` - Referral CRUD API
- `app/api/referrals/[code]/route.ts` - Code verification API
- `app/components/referrals/ReferralsClient.tsx` - Main UI component
- `app/vendor/referrals/page.tsx` - Vendor referrals page
- `app/dashboard/referrals/page.tsx` - Couple referrals page
- `REFERRAL_SYSTEM.md` - This documentation

### Modified
- `app/components/vendor/VendorSidebar.tsx` - Added Referrals link
- `app/components/user/UserSidebar.tsx` - Added Referrals link
- `app/api/signup/route.ts` - Added referral code handling

## Testing Checklist

- [ ] Create referral as vendor
- [ ] Create referral as couple
- [ ] Receive invitation email
- [ ] Click invitation link
- [ ] Verify referral code
- [ ] Complete signup with referral
- [ ] Check referral status updates to ACCEPTED
- [ ] Test expired referral code
- [ ] Test duplicate email prevention
- [ ] Test invalid referral code
- [ ] Copy referral link functionality
- [ ] View referrals dashboard
- [ ] Check statistics accuracy
- [ ] Test email delivery
- [ ] Verify database constraints

## Error Handling

All API endpoints include comprehensive error handling:
- 400: Bad Request (validation errors)
- 401: Unauthorized (not logged in)
- 404: Not Found (invalid referral code)
- 500: Internal Server Error (unexpected errors)

All errors return JSON with descriptive messages for user feedback.

## Performance Considerations

- Database indexes on frequently queried fields
- Efficient query patterns with joins
- Pagination ready (for future implementation)
- Optimistic UI updates
- Loading states for all async operations

## Compliance

- GDPR-ready (user data handling)
- CAN-SPAM compliant emails
- Unsubscribe functionality (future)
- Data retention policies (future)
- Privacy policy integration (future)
