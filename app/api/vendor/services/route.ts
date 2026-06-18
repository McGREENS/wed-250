import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { vendors, servicePackages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // CRITICAL: Check if user is a VENDOR
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const services = await db.select().from(servicePackages).where(eq(servicePackages.vendorId, vendor.id));
    return NextResponse.json({ services });
  } catch (error) {
    console.error("GET /api/vendor/services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized", message: "Please log in to create services" }, { status: 401 });
    }
    
    // CRITICAL: Check if user is a VENDOR
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
    }

    const body = await req.json();
    const { serviceType, name, description, price, duration, features, amenities, image, ...otherFields } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: "Service name is required" }, { status: 400 });
    }

    if (!description || description.trim() === '') {
      return NextResponse.json({ error: "Service description is required" }, { status: 400 });
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Build metadata from all other fields
    const metadata = { ...otherFields };

    // Build features array from features or amenities (for venues)
    let featuresArray = [];
    if (features) {
      featuresArray = features.split(',').map((f: string) => f.trim()).filter(Boolean);
    } else if (amenities) {
      featuresArray = amenities.split(',').map((f: string) => f.trim()).filter(Boolean);
    }

    const [service] = await db.insert(servicePackages).values({
      vendorId: vendor.id,
      serviceType: serviceType || "General",
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image: image || null,
      features: JSON.stringify({ duration: duration || null, items: featuresArray }),
      metadata: JSON.stringify(metadata),
      active: true,
    } as any).returning();

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("POST /api/vendor/services error:", error);
    
    // Extract meaningful error message
    let errorMessage = "Failed to create service";
    if (error instanceof Error) {
      if (error.message.includes('NOT NULL constraint failed')) {
        const match = error.message.match(/NOT NULL constraint failed: service_packages\.(.+)/);
        if (match) {
          errorMessage = `${match[1]} is required`;
        }
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // CRITICAL: Check if user is a VENDOR
  if (session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
  }

  const body = await req.json();
  const { id, action, data } = body;

  if (action === "toggleActive") {
    const [service] = await db.select().from(servicePackages).where(eq(servicePackages.id, id)).limit(1);
    await db.update(servicePackages).set({ active: !service.active } as any).where(eq(servicePackages.id, id));
  } else if (action === "edit") {
    const { serviceType, name, description, price, duration, features, amenities, image, ...otherFields } = data;
    
    // Build metadata from all other fields
    const metadata = { ...otherFields };

    // Build features array from features or amenities (for venues)
    let featuresArray = [];
    if (features) {
      featuresArray = features.split(',').map((f: string) => f.trim());
    } else if (amenities) {
      featuresArray = amenities.split(',').map((f: string) => f.trim());
    }

    await db.update(servicePackages).set({
      serviceType: serviceType || "General",
      name: name,
      description: description,
      price: parseFloat(price),
      image: image || null,
      features: JSON.stringify({ duration: duration || null, items: featuresArray }),
      metadata: JSON.stringify(metadata),
      updatedAt: new Date(),
    } as any).where(eq(servicePackages.id, id));
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // CRITICAL: Check if user is a VENDOR
  if (session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Forbidden: Only vendors can access this' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await db.delete(servicePackages).where(eq(servicePackages.id, id!));

  return NextResponse.json({ success: true });
}
