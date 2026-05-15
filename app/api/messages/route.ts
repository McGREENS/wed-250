import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { conversations, messages, users, vendors, bookings } from '@/lib/db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';

// GET - Fetch all conversations for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    // If conversationId is provided, fetch messages for that conversation
    if (conversationId) {
      const conversationMessages = await db
        .select({
          id: messages.id,
          content: messages.content,
          senderId: messages.senderId,
          read: messages.read,
          createdAt: messages.createdAt,
          senderName: users.name,
          senderRole: users.role,
        })
        .from(messages)
        .innerJoin(users, eq(messages.senderId, users.id))
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);

      // Mark messages as read only if the current user is NOT the sender
      await db
        .update(messages)
        .set({ read: true } as any)
        .where(
          and(
            eq(messages.conversationId, conversationId),
            eq(messages.read, false),
            sql`${messages.senderId} != ${session.user.id}`
          )
        );

      return NextResponse.json({ messages: conversationMessages });
    }

    // Fetch all conversations for the user
    const userRole = session.user.role;
    let userConversations: any[] = [];

    if (userRole === 'VENDOR') {
      const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
      if (!vendor) {
        return NextResponse.json({ conversations: [] });
      }

      // Get all couples who have bookings with this vendor
      const vendorBookings = await db
        .select({
          coupleId: bookings.userId,
          coupleName: users.name,
          coupleEmail: users.email,
          bookingId: bookings.id,
          bookingStatus: bookings.status,
        })
        .from(bookings)
        .innerJoin(users, eq(bookings.userId, users.id))
        .where(eq(bookings.vendorId, vendor.id))
        .groupBy(bookings.userId, users.name, users.email, bookings.id, bookings.status);

      // Get existing conversations
      const existingConversations = await db
        .select({
          id: conversations.id,
          vendorId: conversations.vendorId,
          coupleId: conversations.coupleId,
          bookingId: conversations.bookingId,
          lastMessageAt: conversations.lastMessageAt,
          createdAt: conversations.createdAt,
          coupleName: users.name,
          coupleEmail: users.email,
        })
        .from(conversations)
        .innerJoin(users, eq(conversations.coupleId, users.id))
        .where(eq(conversations.vendorId, vendor.id));

      // Create a map of existing conversations by coupleId
      const conversationMap = new Map(existingConversations.map(c => [c.coupleId, c]));

      // Merge bookings with conversations - create virtual conversations for couples without messages
      const uniqueCouples = new Map<string, any>();
      vendorBookings.forEach(booking => {
        if (!uniqueCouples.has(booking.coupleId)) {
          uniqueCouples.set(booking.coupleId, {
            coupleId: booking.coupleId,
            coupleName: booking.coupleName,
            coupleEmail: booking.coupleEmail,
            bookingId: booking.bookingId,
          });
        }
      });

      userConversations = Array.from(uniqueCouples.values()).map(couple => {
        const existingConv = conversationMap.get(couple.coupleId);
        return existingConv || {
          id: `virtual-${couple.coupleId}`,
          vendorId: vendor.id,
          coupleId: couple.coupleId,
          bookingId: couple.bookingId,
          lastMessageAt: null,
          createdAt: new Date(),
          coupleName: couple.coupleName,
          coupleEmail: couple.coupleEmail,
          isVirtual: true,
        };
      });

      // Sort: conversations with messages first, then by last message time
      userConversations.sort((a, b) => {
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        }
        return 0;
      });
    } else {
      // For couples, get all existing conversations
      const existingConversations = await db
        .select({
          id: conversations.id,
          vendorId: conversations.vendorId,
          coupleId: conversations.coupleId,
          bookingId: conversations.bookingId,
          lastMessageAt: conversations.lastMessageAt,
          createdAt: conversations.createdAt,
          vendorName: vendors.businessName,
          vendorCategory: vendors.category,
        })
        .from(conversations)
        .innerJoin(vendors, eq(conversations.vendorId, vendors.id))
        .where(eq(conversations.coupleId, session.user.id));

      // Get bookings to merge with conversations
      const coupleBookings = await db
        .select({
          vendorId: bookings.vendorId,
          vendorName: vendors.businessName,
          vendorCategory: vendors.category,
          bookingId: bookings.id,
        })
        .from(bookings)
        .innerJoin(vendors, eq(bookings.vendorId, vendors.id))
        .where(eq(bookings.userId, session.user.id))
        .groupBy(bookings.vendorId, vendors.businessName, vendors.category, bookings.id);

      const conversationMap = new Map(existingConversations.map(c => [c.vendorId, c]));
      const uniqueVendors = new Map<string, any>();

      // Add vendors from bookings
      coupleBookings.forEach(booking => {
        if (!uniqueVendors.has(booking.vendorId)) {
          uniqueVendors.set(booking.vendorId, {
            vendorId: booking.vendorId,
            vendorName: booking.vendorName,
            vendorCategory: booking.vendorCategory,
            bookingId: booking.bookingId,
          });
        }
      });

      // Add vendors from existing conversations (even without bookings)
      existingConversations.forEach(conv => {
        if (!uniqueVendors.has(conv.vendorId)) {
          uniqueVendors.set(conv.vendorId, {
            vendorId: conv.vendorId,
            vendorName: conv.vendorName,
            vendorCategory: conv.vendorCategory,
            bookingId: conv.bookingId,
          });
        }
      });

      userConversations = Array.from(uniqueVendors.values()).map(vendor => {
        const existingConv = conversationMap.get(vendor.vendorId);
        return existingConv || {
          id: `virtual-${vendor.vendorId}`,
          vendorId: vendor.vendorId,
          coupleId: session.user.id,
          bookingId: vendor.bookingId,
          lastMessageAt: null,
          createdAt: new Date(),
          vendorName: vendor.vendorName,
          vendorCategory: vendor.vendorCategory,
          isVirtual: true,
        };
      });

      userConversations.sort((a, b) => {
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        }
        return 0;
      });
    }

    const conversationsWithMessages = await Promise.all(
      userConversations.map(async (conv) => {
        // Skip message fetching for virtual conversations
        if (conv.isVirtual) {
          return {
            ...conv,
            messages: [],
            unreadCount: 0,
            vendorBusinessName: userRole === 'VENDOR' ? conv.coupleName : conv.vendorName,
          };
        }

        const convMessages = await db
          .select({
            id: messages.id,
            content: messages.content,
            senderId: messages.senderId,
            createdAt: messages.createdAt,
          })
          .from(messages)
          .where(eq(messages.conversationId, conv.id))
          .orderBy(messages.createdAt);

        const unreadCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.id),
              eq(messages.read, false),
              sql`${messages.senderId} != ${session.user.id}`
            )
          );

        return {
          ...conv,
          messages: convMessages,
          unreadCount: Number(unreadCount[0]?.count || 0),
          vendorBusinessName: userRole === 'VENDOR' ? conv.coupleName : conv.vendorName,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithMessages });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST - Create a new conversation or send a message
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { vendorId, coupleId, bookingId, content } = body;

    console.log('[Messages POST] Request:', { vendorId, coupleId, bookingId, contentLength: content?.length, userId: session.user.id, userRole: session.user.role });

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Determine the conversation participants
    let finalVendorId = vendorId;
    let finalCoupleId = coupleId;

    if (session.user.role === 'VENDOR') {
      // Vendor is sending message
      const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
      if (!vendor) {
        console.error('[Messages POST] Vendor not found for userId:', session.user.id);
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      finalVendorId = vendor.id;
      if (!finalCoupleId) {
        return NextResponse.json({ error: 'Couple ID is required' }, { status: 400 });
      }
    } else {
      // Couple is sending message
      finalCoupleId = session.user.id;
      if (!finalVendorId) {
        return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
      }
      
      // Verify vendor exists
      const [vendor] = await db.select().from(vendors).where(eq(vendors.id, finalVendorId)).limit(1);
      if (!vendor) {
        console.error('[Messages POST] Target vendor not found:', finalVendorId);
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
    }

    console.log('[Messages POST] Final participants:', { finalVendorId, finalCoupleId });

    // Check if conversation already exists
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.vendorId, finalVendorId),
          eq(conversations.coupleId, finalCoupleId)
        )
      )
      .limit(1);

    let conversationId;

    if (existingConversation) {
      conversationId = existingConversation.id;
      console.log('[Messages POST] Using existing conversation:', conversationId);
      // Update last message timestamp
      await db
        .update(conversations)
        .set({ lastMessageAt: new Date(), updatedAt: new Date() } as any)
        .where(eq(conversations.id, conversationId));
    } else {
      // Create new conversation
      console.log('[Messages POST] Creating new conversation');
      const [newConversation] = await db
        .insert(conversations)
        .values({
          vendorId: finalVendorId,
          coupleId: finalCoupleId,
          bookingId: bookingId || null,
        } as any)
        .returning();
      conversationId = newConversation.id;
      console.log('[Messages POST] Created conversation:', conversationId);
    }

    // Insert the message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: session.user.id,
        content: content.trim(),
      })
      .returning();

    console.log('[Messages POST] Message sent successfully:', newMessage.id);
    return NextResponse.json({ success: true, message: newMessage, conversationId });
  } catch (error) {
    console.error('[Messages POST] Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
