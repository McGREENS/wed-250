import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const MAX_PHOTOS = 30;
const MAX_VIDEOS = 20;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
  return NextResponse.json({ portfolio });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { file, type, title, category } = body;

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
  
  // Count existing photos and videos
  const photoCount = portfolio.filter((item: any) => item.type === "image").length;
  const videoCount = portfolio.filter((item: any) => item.type === "video").length;

  // Check limits
  if (type === "image" && photoCount >= MAX_PHOTOS) {
    return NextResponse.json({ error: `Maximum ${MAX_PHOTOS} photos allowed` }, { status: 400 });
  }
  if (type === "video" && videoCount >= MAX_VIDEOS) {
    return NextResponse.json({ error: `Maximum ${MAX_VIDEOS} videos allowed` }, { status: 400 });
  }

  // Check file size (base64 string length approximation)
  const fileSize = (file.length * 3) / 4;
  if (type === "image" && fileSize > MAX_PHOTO_SIZE) {
    return NextResponse.json({ error: "Photo must be less than 5MB" }, { status: 400 });
  }
  if (type === "video" && fileSize > MAX_VIDEO_SIZE) {
    return NextResponse.json({ error: "Video must be less than 50MB" }, { status: 400 });
  }

  const newItem = {
    id: Date.now().toString(),
    type,
    url: file,
    title,
    category,
    date: new Date().toISOString(),
    active: true,
    featured: false,
    views: 0
  };

  portfolio.push(newItem);

  await db.update(vendors).set({
    portfolio: JSON.stringify(portfolio),
    updatedAt: new Date(),
  } as any).where(eq(vendors.userId, session.user.id));

  return NextResponse.json({ success: true, item: newItem });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("id");

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
  const updatedPortfolio = portfolio.filter((item: any) => item.id !== itemId);

  await db.update(vendors).set({
    portfolio: JSON.stringify(updatedPortfolio),
    updatedAt: new Date(),
  } as any).where(eq(vendors.userId, session.user.id));

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, action } = body;

  const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
  
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
  const updatedPortfolio = portfolio.map((item: any) => {
    if (item.id === id) {
      if (action === "toggleActive") return { ...item, active: !item.active };
      if (action === "toggleFeatured") return { ...item, featured: !item.featured };
      if (action === "edit") return { ...item, title: body.data.title, category: body.data.category };
    }
    return item;
  });

  await db.update(vendors).set({
    portfolio: JSON.stringify(updatedPortfolio),
    updatedAt: new Date(),
  } as any).where(eq(vendors.userId, session.user.id));

  return NextResponse.json({ success: true });
}
