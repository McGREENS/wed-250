import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (!vendor.calendarPublished) {
      return NextResponse.json(
        { error: "Calendar not published" },
        { status: 403 }
      );
    }

    const availability = vendor.availability ? JSON.parse(vendor.availability) : { blocked: [] };
    const vendorBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.vendorId, vendor.id));

    console.log("Vendor bookings:", vendorBookings);
    console.log("Availability blocked dates:", availability.blocked);

    return NextResponse.json({
      availability,
      bookings: vendorBookings,
    });
  } catch (error) {
    console.error("Error fetching vendor calendar:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
