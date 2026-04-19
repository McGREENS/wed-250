# Andiza Wedding Platform - Database Schema

## Overview
Database: **Turso (LibSQL/SQLite)**  
ORM: **Drizzle ORM**  
Schema Location: `lib/db/schema.ts`

---

## Tables

### 1. users
**Purpose**: Store all user accounts (couples, vendors, admins)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Unique user identifier |
| name | TEXT | NOT NULL | User's full name |
| email | TEXT | UNIQUE, NOT NULL | User's email address |
| emailVerified | INTEGER (timestamp) | NULL | Email verification timestamp |
| image | TEXT | NULL | Profile image (base64 or URL) |
| password | TEXT | NOT NULL | Hashed password |
| role | TEXT | NOT NULL, DEFAULT 'COUPLE' | User role: COUPLE, VENDOR, ADMIN |
| phone | TEXT | NULL | Phone number |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Account creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Last update timestamp |

**Indexes**: email (unique)

---

### 2. accounts
**Purpose**: OAuth provider accounts (for future social login)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Account identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| type | TEXT | NOT NULL | Account type (oauth, email) |
| provider | TEXT | NOT NULL | Provider name (google, facebook) |
| providerAccountId | TEXT | NOT NULL | Provider's user ID |
| refresh_token | TEXT | NULL | OAuth refresh token |
| access_token | TEXT | NULL | OAuth access token |
| expires_at | INTEGER | NULL | Token expiration |
| token_type | TEXT | NULL | Token type |
| scope | TEXT | NULL | OAuth scope |
| id_token | TEXT | NULL | ID token |
| session_state | TEXT | NULL | Session state |

**Foreign Keys**: userId → users.id (CASCADE DELETE)

---

### 3. sessions
**Purpose**: User session management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Session identifier |
| sessionToken | TEXT | NOT NULL, UNIQUE | Session token |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| expires | INTEGER (timestamp) | NOT NULL | Session expiration |

**Foreign Keys**: userId → users.id (CASCADE DELETE)  
**Indexes**: sessionToken (unique)

---

### 4. verification_tokens
**Purpose**: Email verification and password reset tokens

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| identifier | TEXT | NOT NULL | Email or user identifier |
| token | TEXT | NOT NULL, UNIQUE | Verification token |
| expires | INTEGER (timestamp) | NOT NULL | Token expiration |

**Indexes**: token (unique)

---

### 5. vendors
**Purpose**: Vendor business profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Vendor identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| businessName | TEXT | NOT NULL | Business name |
| category | TEXT | NOT NULL | Service category (single) |
| description | TEXT | NULL | Business description |
| location | TEXT | NULL | Business location |
| priceRange | TEXT | NULL | Price range (budget, moderate, premium, luxury) |
| rating | REAL | DEFAULT 0 | Average rating (0-5) |
| reviewCount | INTEGER | DEFAULT 0 | Number of reviews |
| featured | INTEGER (boolean) | DEFAULT false | Featured vendor flag |
| verified | INTEGER (boolean) | DEFAULT false | Verified vendor flag |
| images | TEXT (JSON) | NULL | Business images array |
| portfolio | TEXT (JSON) | NULL | Portfolio images array |
| services | TEXT (JSON) | NULL | DEPRECATED - use service_packages |
| availability | TEXT (JSON) | NULL | Availability calendar |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**: userId → users.id (CASCADE DELETE)

---

### 6. venues
**Purpose**: Venue listings (DEPRECATED - use service_packages with serviceType='Venue')

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Venue identifier |
| vendorId | TEXT | NOT NULL, FK → vendors.id | Vendor reference |
| name | TEXT | NOT NULL | Venue name |
| description | TEXT | NULL | Venue description |
| location | TEXT | NOT NULL | Venue location |
| capacity | INTEGER | NOT NULL | Minimum capacity |
| maxCapacity | INTEGER | NULL | Maximum capacity |
| venueType | TEXT | NULL | Type: indoor, outdoor, garden, ballroom |
| pricePerDay | REAL | NULL | Daily rental price |
| amenities | TEXT (JSON) | NULL | Amenities array |
| images | TEXT (JSON) | NULL | Venue images array |
| featured | INTEGER (boolean) | DEFAULT false | Featured venue flag |
| rating | REAL | DEFAULT 0 | Average rating |
| reviewCount | INTEGER | DEFAULT 0 | Number of reviews |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**: vendorId → vendors.id (CASCADE DELETE)

---

### 7. service_packages
**Purpose**: Vendor service offerings (replaces venues table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Service identifier |
| vendorId | TEXT | NOT NULL, FK → vendors.id | Vendor reference |
| serviceType | TEXT | NOT NULL | Service type (Photography, Catering, Venue, etc.) |
| name | TEXT | NOT NULL | Service/package name |
| description | TEXT | NULL | Service description |
| price | REAL | NOT NULL | Service price |
| features | TEXT (JSON) | NULL | Features array |
| metadata | TEXT (JSON) | NULL | Service-specific fields (capacity, hours, etc.) |
| image | TEXT | NULL | Service image |
| active | INTEGER (boolean) | DEFAULT true | Active status |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**: vendorId → vendors.id (CASCADE DELETE)

**Service Types**:
- Photography
- Videography
- Catering
- Decoration
- Music
- Planning
- Makeup
- Attire
- Transport
- Venue

---

### 8. weddings
**Purpose**: Couple wedding information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Wedding identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| coupleNames | TEXT | NOT NULL | Both partners' names |
| weddingDate | INTEGER (timestamp) | NULL | Wedding date |
| venueId | TEXT | NULL, FK → venues.id | Selected venue |
| budget | REAL | DEFAULT 0 | Total budget |
| guestCount | INTEGER | DEFAULT 0 | Expected guest count |
| status | TEXT | DEFAULT 'PLANNING' | Status: PLANNING, CONFIRMED, COMPLETED, CANCELLED |
| notes | TEXT | NULL | Wedding notes |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**:
- userId → users.id (CASCADE DELETE)
- venueId → venues.id

---

### 9. bookings
**Purpose**: Service bookings and venue reservations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Booking identifier |
| weddingId | TEXT | NULL, FK → weddings.id | Wedding reference (if logged in) |
| vendorId | TEXT | NOT NULL, FK → vendors.id | Vendor reference |
| userId | TEXT | NULL, FK → users.id | User reference |
| clientName | TEXT | NULL | Client name (if not logged in) |
| clientEmail | TEXT | NULL | Client email |
| clientPhone | TEXT | NULL | Client phone |
| eventType | TEXT | NULL | Event type |
| servicePackage | TEXT | NULL | Service package name |
| serviceType | TEXT | NULL | Service type |
| bookingDate | INTEGER (timestamp) | NULL | Booking creation date |
| eventDate | INTEGER (timestamp) | NULL | Event date |
| status | TEXT | DEFAULT 'pending' | Status: pending, confirmed, completed, cancelled |
| totalAmount | REAL | NULL | Total amount |
| amount | REAL | NULL | Amount (duplicate of totalAmount) |
| depositAmount | REAL | NULL | Deposit amount |
| paymentStatus | TEXT | DEFAULT 'UNPAID' | Payment status: UNPAID, DEPOSIT_PAID, PAID |
| notes | TEXT | NULL | Booking notes |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**:
- weddingId → weddings.id (CASCADE DELETE)
- vendorId → vendors.id (CASCADE DELETE)
- userId → users.id (CASCADE DELETE)

---

### 10. reviews
**Purpose**: Vendor and venue reviews

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Review identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| vendorId | TEXT | NULL, FK → vendors.id | Vendor reference |
| venueId | TEXT | NULL, FK → venues.id | Venue reference |
| rating | INTEGER | NOT NULL | Rating (1-5) |
| comment | TEXT | NULL | Review comment |
| images | TEXT (JSON) | NULL | Review images array |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**:
- userId → users.id (CASCADE DELETE)
- vendorId → vendors.id (CASCADE DELETE)
- venueId → venues.id (CASCADE DELETE)

**Constraints**: Either vendorId OR venueId must be set

---

### 11. favorites
**Purpose**: User favorite vendors/venues

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Favorite identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| vendorId | TEXT | NULL, FK → vendors.id | Vendor reference |
| venueId | TEXT | NULL | Venue/service package ID |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |

**Foreign Keys**:
- userId → users.id (CASCADE DELETE)
- vendorId → vendors.id (CASCADE DELETE)

**Note**: venueId can reference venues.id OR servicePackages.id

---

### 12. venue_tours
**Purpose**: Venue tour requests

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Tour identifier |
| venueId | TEXT | NOT NULL | Service package ID (venue) |
| userId | TEXT | NULL, FK → users.id | User reference |
| name | TEXT | NOT NULL | Client name |
| email | TEXT | NOT NULL | Client email |
| phone | TEXT | NOT NULL | Client phone |
| tourDate | INTEGER (timestamp) | NOT NULL | Requested tour date |
| tourTime | TEXT | NOT NULL | Requested tour time |
| status | TEXT | DEFAULT 'PENDING' | Status: PENDING, CONFIRMED, CANCELLED, COMPLETED |
| notes | TEXT | NULL | Tour notes |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**: userId → users.id (CASCADE DELETE)

---

### 13. tasks
**Purpose**: Wedding planning checklist tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Task identifier |
| userId | TEXT | NOT NULL, FK → users.id | User reference |
| title | TEXT | NOT NULL | Task title |
| timeline | TEXT | NOT NULL | Timeline (e.g., "12+ months before") |
| completed | INTEGER (boolean) | DEFAULT false | Completion status |
| custom | INTEGER (boolean) | DEFAULT false | Custom task flag |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |
| updatedAt | INTEGER (timestamp) | DEFAULT NOW | Update timestamp |

**Foreign Keys**: userId → users.id (CASCADE DELETE)

---

### 14. contact_messages
**Purpose**: Contact form submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Message identifier |
| name | TEXT | NOT NULL | Sender name |
| email | TEXT | NOT NULL | Sender email |
| phone | TEXT | NULL | Sender phone |
| subject | TEXT | NULL | Message subject |
| message | TEXT | NOT NULL | Message content |
| status | TEXT | DEFAULT 'UNREAD' | Status: UNREAD, READ, REPLIED |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |

---

### 15. pending_vendor_signups
**Purpose**: Temporary storage for vendor signups awaiting OTP verification

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY, UUID | Signup identifier |
| businessName | TEXT | NOT NULL | Business name |
| email | TEXT | NOT NULL | Email address |
| phone | TEXT | NOT NULL | Phone number |
| serviceCategory | TEXT | NOT NULL | Service category |
| password | TEXT | NOT NULL | Hashed password |
| otp | TEXT | NOT NULL | 6-digit OTP code |
| expiresAt | INTEGER (timestamp) | NOT NULL | OTP expiration (10 minutes) |
| createdAt | INTEGER (timestamp) | DEFAULT NOW | Creation timestamp |

**Note**: Records are deleted after successful verification or expiration

---

## Relationships

### One-to-Many
- users → vendors (1:N)
- users → weddings (1:N)
- users → bookings (1:N)
- users → reviews (1:N)
- users → favorites (1:N)
- users → tasks (1:N)
- vendors → venues (1:N)
- vendors → service_packages (1:N)
- vendors → bookings (1:N)
- weddings → bookings (1:N)

### Many-to-One
- bookings → weddings (N:1)
- bookings → vendors (N:1)
- reviews → users (N:1)
- reviews → vendors (N:1)
- favorites → users (N:1)

---

## JSON Field Structures

### vendors.images
```json
["base64_image_1", "base64_image_2", ...]
```

### vendors.portfolio
```json
["base64_image_1", "base64_image_2", ...]
```

### service_packages.features
```json
["Feature 1", "Feature 2", "Feature 3"]
```

### service_packages.metadata (Venue)
```json
{
  "capacity": 200,
  "maxCapacity": 300,
  "venueType": "ballroom",
  "amenities": ["Parking", "Catering Kitchen", "Dance Floor"]
}
```

### service_packages.metadata (Photography)
```json
{
  "hours": 8,
  "photographers": 2,
  "deliverables": ["Digital photos", "Album", "USB"]
}
```

### venues.amenities
```json
["Parking", "Catering Kitchen", "Bridal Suite", "Dance Floor"]
```

---

## Indexes

### Recommended Indexes (for performance)
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_vendors_userId ON vendors(userId);
CREATE INDEX idx_bookings_vendorId ON bookings(vendorId);
CREATE INDEX idx_bookings_userId ON bookings(userId);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_service_packages_vendorId ON service_packages(vendorId);
CREATE INDEX idx_service_packages_serviceType ON service_packages(serviceType);
CREATE INDEX idx_service_packages_active ON service_packages(active);
```

---

## Data Types

### Timestamps
All timestamps are stored as INTEGER (Unix timestamp in milliseconds)

### Booleans
Stored as INTEGER (0 = false, 1 = true)

### JSON
Stored as TEXT, parsed/stringified in application code

### UUIDs
Generated using `crypto.randomUUID()`

---

## Migration Notes

### Current State
- Database is in production with Turso
- Schema defined in Drizzle ORM
- No formal migration system in place

### Future Migrations
Consider implementing:
1. Drizzle Kit migrations
2. Version control for schema changes
3. Rollback procedures
4. Data migration scripts

---

## Backup & Recovery

### Turso Features
- Automatic backups
- Point-in-time recovery
- Replication across regions

### Manual Backup
```bash
# Export database
turso db shell <database-name> .dump > backup.sql

# Import database
turso db shell <database-name> < backup.sql
```

---

## Performance Considerations

### Query Optimization
- Use indexes on frequently queried columns
- Avoid N+1 queries (use joins)
- Paginate large result sets
- Cache frequently accessed data

### JSON Fields
- Keep JSON fields small
- Consider normalizing if querying JSON frequently
- Use SQLite JSON functions for queries

### Connection Pooling
- Turso handles connection pooling automatically
- Configure syncInterval for optimal performance

---

## Security

### Password Storage
- Passwords hashed using bcrypt
- Salt rounds: 10 (configurable)

### SQL Injection Prevention
- Drizzle ORM provides parameterized queries
- Never concatenate user input into SQL

### Data Validation
- Validate all inputs on API routes
- Use Zod or similar for schema validation
- Sanitize user-generated content

---

## Future Schema Changes

### Planned Additions
1. **payments** table for transaction records
2. **notifications** table for user notifications
3. **messages** table for vendor-couple chat
4. **contracts** table for digital contracts
5. **vendor_availability** table for calendar management
6. **wedding_guests** table for guest list management

### Deprecations
- **venues** table → migrate to service_packages
- **vendors.services** field → use service_packages table
