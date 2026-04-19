# Andiza Wedding Platform - Process Flow Documentation

## Table of Contents
1. [User Registration & Authentication](#user-registration--authentication)
2. [Vendor Onboarding](#vendor-onboarding)
3. [Couple Onboarding](#couple-onboarding)
4. [Service Discovery & Booking](#service-discovery--booking)
5. [Venue Discovery & Booking](#venue-discovery--booking)
6. [Vendor Management](#vendor-management)
7. [Admin Operations](#admin-operations)

---

## 1. User Registration & Authentication

### Couple Signup Flow
```
1. User visits /signup
2. Selects "Couple" role
3. Fills form:
   - Names (both partners)
   - Email
   - Phone
   - Password
4. System creates:
   - User account (role: COUPLE)
   - Wedding record (linked to user)
5. Auto-login and redirect to /dashboard
```

### Vendor Signup Flow (OTP Verification)
```
1. User visits /signup
2. Selects "Vendor" role
3. Fills form:
   - Business Name
   - Email
   - Phone
   - Service Category
   - Password
4. System generates 6-digit OTP
5. OTP sent to email (valid for 10 minutes)
6. Data stored in pending_vendor_signups table
7. User enters OTP in modal
8. System verifies OTP:
   - Creates user account (role: VENDOR)
   - Creates vendor profile
   - Sends welcome email
   - Deletes pending signup record
9. Auto-login and redirect to /vendor/dashboard
```

### Login Flow
```
1. User visits /login
2. Enters email and password
3. System authenticates via NextAuth
4. Redirects based on role:
   - ADMIN → /admin
   - VENDOR → /vendor/dashboard
   - COUPLE → /dashboard
```

---

## 2. Vendor Onboarding

### Initial Setup
```
1. Vendor logs in for first time
2. Dashboard shows profile completion score
3. Vendor clicks "Complete Profile"
4. Redirected to /vendor/settings
5. Fills/updates:
   - Business information
   - Description
   - Location
   - Price range
   - Profile photo
```

### Service Package Creation
```
1. Vendor navigates to /vendor/services
2. Clicks "Create New Service"
3. Service Creation Wizard opens:
   
   Step 1: Service Type Selection
   - Photography, Videography, Catering, Decoration, etc.
   
   Step 2: Package Details
   - Package name
   - Description
   - Price
   - Features list
   
   Step 3: Service-Specific Fields
   - For Venues: capacity, amenities, venue type
   - For Photography: hours, deliverables
   - For Catering: menu options, guest count
   
   Step 4: Media Upload
   - Upload service image
   
4. System creates service_package record
5. Service appears on /vendors or /venues page
```

### Portfolio Management
```
1. Vendor navigates to /vendor/portfolio
2. Uploads images of past work
3. Images stored in vendor.portfolio (JSON array)
4. Portfolio displayed on vendor profile page
```

---

## 3. Couple Onboarding

### Wedding Settings
```
1. Couple logs in
2. Dashboard prompts to set wedding date
3. Clicks "Set your wedding date"
4. Redirected to /dashboard/wedding-settings
5. Fills:
   - Wedding date
   - Couple names
   - Guest count
   - Budget
6. System updates wedding record
7. Dashboard shows countdown and planning progress
```

### Planning Checklist
```
1. Couple navigates to /dashboard/checklist
2. System generates timeline-based tasks:
   - 12+ months before
   - 9-12 months before
   - 6-9 months before
   - etc.
3. Couple can:
   - Mark tasks as complete
   - Add custom tasks
   - View progress percentage
```

---

## 4. Service Discovery & Booking

### Browse Services
```
1. Couple visits /vendors
2. Views all service packages (except venues)
3. Filters by:
   - Service type (Photography, Catering, etc.)
   - Price range
   - Search query
4. Clicks on service card
5. Redirected to /vendors/[vendorId]/services/[serviceId]
6. Views:
   - Service details
   - Vendor information
   - Pricing
   - Features
```

### Favorite Services
```
1. Couple clicks heart icon on service card
2. System creates favorite record
3. Service added to /dashboard/favorites
4. Can unfavorite anytime
```

### Service Booking
```
1. Couple clicks "Book Now" on service page
2. Redirected to /booking/[vendorId]?service=[serviceId]
3. Fills booking form:
   - Event date
   - Event type
   - Client details (if not logged in)
   - Special requests/notes
4. System creates booking record:
   - Status: pending
   - Links to wedding (if logged in)
   - Links to vendor and service
5. Vendor receives notification
6. Booking appears in:
   - Couple: /dashboard/bookings
   - Vendor: /vendor/bookings
```

---

## 5. Venue Discovery & Booking

### Browse Venues
```
1. Couple visits /venues
2. Views all venue service packages
3. Filters by:
   - Venue type (Hotel, Ballroom, Garden, etc.)
   - Location (Kigali areas)
   - Price range
   - Guest capacity
   - Amenities/Features
4. Clicks on venue card
5. Redirected to /venues/[venueId]
6. Views:
   - Venue details
   - Capacity
   - Amenities
   - Pricing
   - Photos
```

### Request Venue Tour
```
1. Couple clicks "Request Tour" on venue page
2. Fills tour request form:
   - Preferred date
   - Preferred time
   - Name, email, phone
   - Special notes
3. System creates venue_tour record (status: PENDING)
4. Vendor receives notification
5. Tour request appears in:
   - Couple: /dashboard/bookings (tours tab)
   - Vendor: /vendor/bookings (tours tab)
```

### Request Venue Quote
```
1. Couple clicks "Request Quote" on venue page
2. Fills quote request form:
   - Event date
   - Guest count
   - Event type
   - Requirements
3. System creates booking record (status: pending)
4. Vendor reviews and responds with quote
5. Couple can accept or decline
```

---

## 6. Vendor Management

### Dashboard Overview
```
1. Vendor logs in to /vendor/dashboard
2. Views:
   - Revenue statistics (total, monthly, trends)
   - Booking counts (pending, confirmed, completed)
   - Active services count
   - Average rating
   - Profile completion score
   - Upcoming events calendar
   - Recent bookings
   - Revenue chart (6 months)
```

### Booking Management
```
1. Vendor navigates to /vendor/bookings
2. Views tabs:
   - All Bookings
   - Venue Tours (if venue vendor)
   - Quote Requests (if venue vendor)
3. For each booking:
   - View details
   - Update status (pending → confirmed → completed)
   - Add notes
   - Contact client
4. Status changes notify couple
```

### Calendar Management
```
1. Vendor navigates to /vendor/calendar
2. Views monthly calendar with:
   - Confirmed bookings
   - Pending bookings
   - Available dates
3. Can mark dates as unavailable
4. Prevents double-booking
```

### Service Management
```
1. Vendor navigates to /vendor/services
2. Views all service packages
3. Can:
   - Edit service details
   - Update pricing
   - Toggle active/inactive status
   - Delete services
   - Add new services
```

---

## 7. Admin Operations

### User Management
```
1. Admin logs in to /admin
2. Navigates to /admin/users
3. Views all users (couples, vendors, admins)
4. Can:
   - View user details
   - Filter by role
   - Search users
   - View user statistics
```

### Reports & Analytics
```
1. Admin navigates to /admin/reports
2. Selects report type:
   - Revenue Report
   - Bookings Report
   - Vendors Report
   - Users Report
   - Performance Report
3. Selects date range
4. Views:
   - Charts and graphs
   - Summary statistics
   - Detailed data tables
5. Can export as CSV or PDF
```

### Message Management
```
1. Admin navigates to /admin/messages
2. Views contact form submissions
3. Can:
   - Mark as read
   - Reply to messages
   - Filter by status
```

### Clear Database (Danger Zone)
```
1. Admin navigates to /admin/clear-data
2. Clicks "Clear All Data"
3. Confirms action
4. System deletes:
   - All vendor accounts
   - All venues
   - All service packages
   - All bookings
   - All reviews
   - All favorites
   - All venue tours
5. Couple accounts remain intact
6. Ready for fresh vendor onboarding
```

---

## Key Business Rules

### Booking Status Flow
```
pending → confirmed → completed
         ↓
      cancelled
```

### Payment Status Flow
```
UNPAID → DEPOSIT_PAID → PAID
```

### Venue Tour Status Flow
```
PENDING → CONFIRMED → COMPLETED
         ↓
      CANCELLED
```

### Profile Completion Score
Calculated based on:
- Business name filled
- Description added
- Location set
- Price range set
- Profile photo uploaded
- At least one service package created
- Portfolio images added

### Planning Progress
Calculated based on:
- Wedding date set
- Budget defined
- Guest count set
- Tasks completed
- Bookings made
- Venue selected
