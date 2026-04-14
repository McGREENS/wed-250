import { db } from '../lib/db';
import { vendors, venues, servicePackages, bookings, reviews, favorites, venueTours, users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function clearVendorsAndVenues() {
  try {
    console.log('Starting cleanup...');

    // Delete all venue tours
    console.log('Deleting venue tours...');
    await db.delete(venueTours);

    // Delete all favorites
    console.log('Deleting favorites...');
    await db.delete(favorites);

    // Delete all reviews
    console.log('Deleting reviews...');
    await db.delete(reviews);

    // Delete all bookings
    console.log('Deleting bookings...');
    await db.delete(bookings);

    // Delete all service packages
    console.log('Deleting service packages...');
    await db.delete(servicePackages);

    // Delete all venues
    console.log('Deleting venues...');
    await db.delete(venues);

    // Get all vendor user IDs before deleting vendors
    const allVendors = await db.select({ userId: vendors.userId }).from(vendors);
    const vendorUserIds = allVendors.map(v => v.userId);

    // Delete all vendors
    console.log('Deleting vendors...');
    await db.delete(vendors);

    // Delete vendor users
    console.log('Deleting vendor user accounts...');
    for (const userId of vendorUserIds) {
      await db.delete(users).where(eq(users.id, userId));
    }

    console.log('✅ Successfully deleted all vendors, venues, and related data!');
    console.log(`   - Deleted ${vendorUserIds.length} vendor accounts`);
    console.log('   - All service packages removed');
    console.log('   - All bookings removed');
    console.log('   - All reviews removed');
    console.log('   - All favorites removed');
    console.log('   - All venue tours removed');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

clearVendorsAndVenues()
  .then(() => {
    console.log('\n✨ Database is now clean and ready for new vendor onboarding!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to clear database:', error);
    process.exit(1);
  });
