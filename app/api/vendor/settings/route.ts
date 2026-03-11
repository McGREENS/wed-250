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
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, data } = body;

  try {
    if (type === "profile") {
      await db.update(users).set({
        name: data.businessName,
        phone: data.phone,
        image: data.image || null,
        updatedAt: new Date(),
      }).where(eq(users.id, session.user.id));

      await db.update(vendors).set({
        businessName: data.businessName,
        description: data.bio,
        category: data.category,
        location: data.location,
        priceRange: data.priceRange,
        updatedAt: new Date(),
      }).where(eq(vendors.userId, session.user.id));
    } else if (type === "password") {
      const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
      
      if (!user.password) {
        return NextResponse.json({ error: "No password set" }, { status: 400 });
      }
      
      const bcrypt = require("bcryptjs");
      const passwordMatch = await bcrypt.compare(data.currentPassword, user.password);
      
      if (!passwordMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await db.update(users).set({
        password: hashedPassword,
        updatedAt: new Date(),
      }).where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
