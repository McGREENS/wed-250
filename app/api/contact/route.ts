import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all contact messages (admin only)
export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Create new contact message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insertData = {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: 'UNREAD' as const,
    };

    const [newMessage] = await db
      .insert(contactMessages)
      .values(insertData as any)
      .returning();

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// Update message status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, status } = body;

    if (!messageId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ status: status as 'UNREAD' | 'READ' | 'REPLIED' } as any)
      .where(eq(contactMessages.id, messageId))
      .returning();

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// Delete message
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, messageId));

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
