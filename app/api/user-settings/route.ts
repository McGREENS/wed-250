import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      image: users.image,
    }).from(users).where(eq(users.id, session.user.id)).limit(1);

    return NextResponse.json(user[0] || null);
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, name, phone, currentPassword, newPassword } = await request.json();

    if (type === 'profile') {
      if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      }

      const updated = await db.update(users)
        .set({ name, phone: phone || null, updatedAt: new Date() } as any)
        .where(eq(users.id, session.user.id))
        .returning({ id: users.id, name: users.name, phone: users.phone } as any);

      return NextResponse.json(updated[0]);
    }

    if (type === 'password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
      }

      // Verify current password
      const user = await db.select({ password: users.password })
        .from(users).where(eq(users.id, session.user.id)).limit(1);

      const isValid = await bcrypt.compare(currentPassword, user[0].password);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db.update(users)
        .set({ password: hashedPassword, updatedAt: new Date() } as any)
        .where(eq(users.id, session.user.id));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update user details' }, { status: 500 });
  }
}