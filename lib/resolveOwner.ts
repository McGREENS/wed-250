import { db } from '@/lib/db';
import { weddings } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

/**
 * Given a logged-in userId, returns the wedding owner's userId.
 * - If the user owns a wedding → returns their own id.
 * - If the user is a partner on someone else's wedding → returns the owner's id.
 * - If no wedding found → returns the user's own id (so they can create one).
 */
export async function resolveOwnerUserId(userId: string): Promise<string> {
  const wedding = await db
    .select({ userId: weddings.userId, partnerUserId: weddings.partnerUserId })
    .from(weddings)
    .where(or(eq(weddings.userId, userId), eq(weddings.partnerUserId, userId)))
    .limit(1);

  if (!wedding.length) return userId;
  return wedding[0].userId;
}
