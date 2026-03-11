import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { vendors, servicePackages } from "@/lib/db/schema";
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

  const services = await db.select().from(servicePackages).where(eq(servicePackages.vendorId, vendor.id));
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, duration, features, image } = body;

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const [service] = await db.insert(servicePackages).values({
    vendorId: vendor.id,
    name,
    description,
    price: parseFloat(price),
    image: image || null,
    features: JSON.stringify({ duration, items: features }),
    active: true,
  }).returning();

  return NextResponse.json({ success: true, service });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, action, data } = body;

  if (action === "toggleActive") {
    const [service] = await db.select().from(servicePackages).where(eq(servicePackages.id, id)).limit(1);
    await db.update(servicePackages).set({ active: !service.active }).where(eq(servicePackages.id, id));
  } else if (action === "edit") {
    await db.update(servicePackages).set({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image || null,
      features: JSON.stringify({ duration: data.duration, items: data.features }),
      updatedAt: new Date(),
    }).where(eq(servicePackages.id, id));
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await db.delete(servicePackages).where(eq(servicePackages.id, id!));

  return NextResponse.json({ success: true });
}
