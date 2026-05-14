# Database Migration Summary

## Migration Completed: ✅

**Date**: January 2025  
**From**: `database-rose-book-vercel-icfg` (OLD)  
**To**: `andiza-laurier` (NEW)

## Migration Results

### Successfully Migrated:
- ✅ **14 Users** (3 Admins, 4 Couples, 7 Vendors)
- ✅ **9 Vendors** (Various categories)
- ✅ **1 Service Package** (Videography)
- ✅ **3 Weddings** (All in planning status)
- ✅ **7 Bookings** (Various statuses)
- ✅ **0 Reviews**
- ✅ **1 Favorite**
- ✅ **0 Venue Tours**
- ✅ **2 Contact Messages**
- ✅ **3 Pending Vendor Signups**
- ✅ **7 Tasks**

## Current Database Configuration

**Database URL**: `libsql://andiza-laurier.aws-us-east-1.turso.io`  
**Environment File**: `.env`

## Database Schema

The schema includes 15 tables:
1. `users` - User accounts (couples, vendors, admins)
2. `accounts` - OAuth accounts
3. `sessions` - User sessions
4. `verification_tokens` - Email verification
5. `vendors` - Vendor profiles
6. `venues` - Venue listings (DEPRECATED - use service_packages)
7. `weddings` - Wedding planning data
8. `bookings` - Service bookings
9. `reviews` - Vendor/venue reviews
10. `favorites` - User favorites
11. `venue_tours` - Venue tour requests
12. `service_packages` - Vendor service offerings
13. `tasks` - Wedding planning tasks
14. `contact_messages` - Contact form submissions
15. `pending_vendor_signups` - OTP verification for vendors

## Existing User Accounts

### Admin Accounts:
- `social.cylacon@gmail.com` (Admin)
- `ceo@cylacon.com` (CEO)
- `inyglarissa48@gmail.com` (Larissa)

### Vendor Accounts:
- `development@cylacon.com` (CYLACON - Invitation)
- `hansdigitallab@gmail.com` (Hans Digital Lab - Videography)
- `laurierhab@gmail.com` (Laurier - Invitation)
- `kamanziwakaberuka@gmail.com` (MC Kamanzi - Multi Service)
- `makitatentdesign@gmail.com` (Makita Tent Design - Venue)
- `l.inyange@alustudent.com` (Mama designer - Decoration)
- `larissa.inyange@gmail.com` (Maman deco - Music)
- `dieudonnesibomana31@gmail.com` (Patisserie blé d,or - Multi Service)

### Couple Accounts:
- `hblix25@gmail.com` (Blix)
- `umurava9@gmail.com` (Test channels)
- `irakozechris555@gmail.com` (sarah & peter)

## Next Steps

1. ✅ Migration completed
2. ✅ All data verified in NEW database
3. ✅ Schema matches application requirements
4. 🔄 Ready for development and testing
5. 📝 Can add more test data using seed scripts if needed

## Scripts Available

- `scripts/seed.ts` - Seed database with test data
- `scripts/seed-admin.mjs` - Create admin user

## Commands

```bash
# View database in Drizzle Studio
npm run db:studio

# Seed database with test data (if needed)
npm run db:seed

# Start development server
npm run dev
```

## Notes

- All passwords from old database are preserved (hashed)
- All IDs and relationships are maintained
- No data loss during migration
- Ready for production use
