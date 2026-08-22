import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, vendors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);

  return NextResponse.json({ user, vendor });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, field, value, data } = body;

  try {
    if (type === "profile") {
      // Single-field update
      const userFields: Record<string, any> = { updatedAt: new Date() };
      const vendorFields: Record<string, any> = { updatedAt: new Date() };

      if (field === 'businessName') { userFields.name = value; vendorFields.businessName = value; }
      else if (field === 'email') {
        const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, value)).limit(1);
        if (existing && existing.id !== session.user.id) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        userFields.email = value;
      }
      else if (field === 'phone') userFields.phone = value;
      else if (field === 'image') { userFields.image = value || null; }
      else if (field === 'bio') vendorFields.description = value;
      else if (field === 'location') vendorFields.location = value;
      else if (field === 'priceRange') vendorFields.priceRange = value;
      else if (field === 'category') vendorFields.category = value;
      // Full save fallback (data object)
      else if (data) {
        userFields.name = data.businessName;
        userFields.phone = data.phone;
        userFields.image = data.image || null;
        vendorFields.businessName = data.businessName;
        vendorFields.description = data.bio;
        vendorFields.categories = JSON.stringify([data.category]);
        vendorFields.location = data.location;
        vendorFields.priceRange = data.priceRange;
      }

      if (Object.keys(userFields).length > 1) {
        await db.update(users).set(userFields as any).where(eq(users.id, session.user.id));
      }
      if (Object.keys(vendorFields).length > 1) {
        await db.update(vendors).set(vendorFields as any).where(eq(vendors.userId, session.user.id));
      }
    } else if (type === "password") {
      const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
      if (!user.password) return NextResponse.json({ error: "No password set" }, { status: 400 });

      const bcrypt = require("bcryptjs");
      const match = await bcrypt.compare(data.currentPassword, user.password);
      if (!match) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

      const hashed = await bcrypt.hash(data.newPassword, 10);
      await db.update(users).set({ password: hashed, updatedAt: new Date() } as any).where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
