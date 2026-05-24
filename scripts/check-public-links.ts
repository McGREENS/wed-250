import { db } from '@/lib/db';
import { publicReferralLinks, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkPublicLinks() {
  try {
    console.log('Fetching all public referral links...\n');
    
    const links = await db
      .select({
        id: publicReferralLinks.id,
        referralCode: publicReferralLinks.referralCode,
        referralRole: publicReferralLinks.referralRole,
        title: publicReferralLinks.title,
        usageCount: publicReferralLinks.usageCount,
        isActive: publicReferralLinks.isActive,
        createdAt: publicReferralLinks.createdAt,
      })
      .from(publicReferralLinks);

    console.log(`Total public links found: ${links.length}\n`);
    
    if (links.length === 0) {
      console.log('❌ No public referral links found in database');
      return;
    }

    links.forEach((link, index) => {
      console.log(`Link ${index + 1}:`);
      console.log(`  ID: ${link.id}`);
      console.log(`  Code: ${link.referralCode}`);
      console.log(`  Title: ${link.title}`);
      console.log(`  Role: ${link.referralRole}`);
      console.log(`  Usage Count: ${link.usageCount}`);
      console.log(`  Active: ${link.isActive}`);
      console.log(`  Created: ${link.createdAt}\n`);
    });

    console.log('✅ Public links exist in database');
  } catch (error) {
    console.error('❌ Error checking public links:', error);
  } finally {
    process.exit(0);
  }
}

checkPublicLinks();
