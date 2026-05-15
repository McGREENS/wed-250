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

  console.log("Vendor calendar published status:", vendor.calendarPublished, "Type:", typeof vendor.calendarPublished);

  return NextResponse.json({ 
    availability, 
    bookings: vendorBookings,
    calendarPublished: !!vendor.calendarPublished
  });
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

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  try {
    if (action === "publish") {
      const result = await db.update(vendors).set({
        calendarPublished: 1,
        updatedAt: new Date(),
      } as any).where(eq(vendors.userId, session.user.id));

      console.log("Update result:", result);

      // Verify the update
      const [updatedVendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
      console.log("Verified - Calendar published status after update:", updatedVendor.calendarPublished);

      return NextResponse.json({ 
        success: true, 
        calendarPublished: true,
        message: "Calendar published successfully"
      });
    } else if (action === "unpublish") {
      const result = await db.update(vendors).set({
        calendarPublished: 0,
        updatedAt: new Date(),
      } as any).where(eq(vendors.userId, session.user.id));

      console.log("Update result:", result);

      // Verify the update
      const [updatedVendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
      console.log("Verified - Calendar published status after update:", updatedVendor.calendarPublished);

      return NextResponse.json({ 
        success: true, 
        calendarPublished: false,
        message: "Calendar unpublished"
      });
    }
  } catch (error) {
    console.error("Error updating calendar published status:", error);
    return NextResponse.json({ error: "Failed to update calendar status", details: String(error) }, { status: 500 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
