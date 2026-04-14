import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vendors, venues, servicePackages, bookings, reviews, favorites, venueTours, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function DELETE() {
  try {
    const session = await auth();
    
    // Only allow admin users to delete all data
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting cleanup...');

    let deletedCounts = {
      venueTours: 0,
      favorites: 0,
      reviews: 0,
      bookings: 0,
      servicePackages: 0,
      venues: 0,
      vendors: 0,
      vendorUsers: 0
    };

    // Delete all venue tours
    try {
      await db.delete(venueTours);
      console.log('Deleted venue tours');
    } catch (e) {
      console.log('No venue tours to delete or table does not exist');
    }

    // Delete all favorites
    try {
      await db.delete(favorites);
      console.log('Deleted favorites');
    } catch (e) {
      console.log('No favorites to delete or table does not exist');
    }

    // Delete all reviews
    try {
      await db.delete(reviews);
      console.log('Deleted reviews');
    } catch (e) {
      console.log('No reviews to delete or table does not exist');
    }

    // Delete all bookings
    try {
      await db.delete(bookings);
      console.log('Deleted bookings');
    } catch (e) {
      console.log('No bookings to delete or table does not exist');
    }

    // Delete all service packages
    try {
      await db.delete(servicePackages);
      console.log('Deleted service packages');
    } catch (e) {
      console.log('No service packages to delete or table does not exist');
    }

    // Delete all venues
    try {
      await db.delete(venues);
      console.log('Deleted venues');
    } catch (e) {
      console.log('No venues to delete or table does not exist');
    }

    // Get all vendor user IDs before deleting vendors
    let vendorUserIds: string[] = [];
    try {
      const allVendors = await db.select({ userId: vendors.userId }).from(vendors);
      vendorUserIds = allVendors.map(v => v.userId);
      deletedCounts.vendors = allVendors.length;
    } catch (e) {
      console.log('No vendors to delete or table does not exist');
    }

    // Delete all vendors
    try {
      await db.delete(vendors);
      console.log('Deleted vendors');
    } catch (e) {
      console.log('No vendors to delete or table does not exist');
    }

    // Delete vendor users
    for (const userId of vendorUserIds) {
      try {
        await db.delete(users).where(eq(users.id, userId));
        deletedCounts.vendorUsers++;
      } catch (e) {
        console.log(`Failed to delete user ${userId}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully deleted all vendors, venues, and related data',
      deletedVendorAccounts: deletedCounts.vendorUsers,
      details: deletedCounts
    });
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to clear database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
