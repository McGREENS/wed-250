import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { vendors, bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const availability = vendor.availability ? JSON.parse(vendor.availability) : { blocked: [] };
  const vendorBookings = await db.select().from(bookings).where(eq(bookings.vendorId, vendor.id));

  return NextResponse.json({ availability, bookings: vendorBookings });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, action } = body;

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const availability = vendor.availability ? JSON.parse(vendor.availability) : { blocked: [] };

  if (action === "block") {
    if (!availability.blocked.includes(date)) {
      availability.blocked.push(date);
    }
  } else if (action === "unblock") {
    availability.blocked = availability.blocked.filter((d: string) => d !== date);
  }

  await db.update(vendors).set({
    availability: JSON.stringify(availability),
    updatedAt: new Date(),
  } as any).where(eq(vendors.userId, session.user.id));

  return NextResponse.json({ success: true, availability });
}
