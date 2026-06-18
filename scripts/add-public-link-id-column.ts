import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function addPublicLinkIdColumn() {
  try {
    // Check if column exists
    const tableInfo = await client.execute(`PRAGMA table_info(referrals)`);
    const hasPublicLinkId = tableInfo.rows.some((row: any) => row.name === 'public_link_id');
    
    if (hasPublicLinkId) {
      console.log("✓ public_link_id column already exists");
    } else {
      // Add the column
      await client.execute(`
        ALTER TABLE referrals ADD COLUMN public_link_id TEXT REFERENCES public_referral_links(id) ON DELETE SET NULL
      `);
      console.log("✓ public_link_id column added successfully!");
    }
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    client.close();
  }
}

addPublicLinkIdColumn();
