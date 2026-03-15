import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { venueTours, servicePackages, vendors, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendTourConfirmationEmail, sendTourDeclinedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { venueId, name, email, phone, tourDate, tourTime, notes } = await req.json();

    if (!venueId || !name || !email || !phone || !tourDate || !tourTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [tour] = await db.insert(venueTours).values({
      venueId,
      userId: session?.user?.id || null,
      name,
      email,
      phone,
      tourDate: new Date(tourDate),
      tourTime,
      notes: notes || null,
      status: 'PENDING',
    } as any).returning();

    return NextResponse.json({ tour, success: true });
  } catch (error) {
    console.error('Error creating venue tour:', error);
    return NextResponse.json({ error: 'Failed to schedule tour' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tours = await db
      .select({
        id: venueTours.id,
        venueId: venueTours.venueId,
        userId: venueTours.userId,
        name: venueTours.name,
        email: venueTours.email,
        phone: venueTours.phone,
        tourDate: venueTours.tourDate,
        tourTime: venueTours.tourTime,
        status: venueTours.status,
        notes: venueTours.notes,
        createdAt: venueTours.createdAt,
        venueName: servicePackages.name,
      })
      .from(venueTours)
      .leftJoin(servicePackages, eq(venueTours.venueId, servicePackages.id))
      .where(eq(venueTours.userId, session.user.id));

    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Error fetching venue tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Verify the vendor owns the venue this tour is for
    const vendor = await db.select().from(vendors).where(eq(vendors.userId, session.user.id)).limit(1);
    if (!vendor.length) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const tour = await db.select({
      id: venueTours.id,
      vendorId: servicePackages.vendorId,
      venueId: venueTours.venueId,
      userId: venueTours.userId,
      name: venueTours.name,
      email: venueTours.email,
      tourDate: venueTours.tourDate,
      tourTime: venueTours.tourTime,
      venueName: servicePackages.name,
    })
    .from(venueTours)
    .leftJoin(servicePackages, eq(venueTours.venueId, servicePackages.id))
    .where(eq(venueTours.id, id))
    .limit(1);

    if (!tour.length || tour[0].vendorId !== vendor[0].id) {
      return NextResponse.json({ error: 'Unauthorized to update this tour' }, { status: 403 });
    }

    const updated = await db.update(venueTours)
      .set({ status, updatedAt: new Date() } as any)
      .where(eq(venueTours.id, id))
      .returning();

    // Send email to the user when vendor approves or declines
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      try {
        const tourData = tour[0];
        let emailTo = tourData.email;
        let emailName = tourData.name;

        // If tour was booked by a logged-in user, use their account email
        if (tourData.userId) {
          const user = await db.select({ email: users.email, name: users.name })
            .from(users)
            .where(eq(users.id, tourData.userId))
            .limit(1);
          if (user.length) {
            emailTo = user[0].email;
            emailName = user[0].name;
          }
        }

        const emailPayload = {
          email: emailTo,
          name: emailName,
          venueName: tourData.venueName || 'the venue',
          tourDate: new Date(tourData.tourDate!),
          tourTime: tourData.tourTime!,
        };

        if (status === 'CONFIRMED') {
          await sendTourConfirmationEmail(emailPayload);
        } else {
          await sendTourDeclinedEmail(emailPayload);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({ tour: updated[0] });
  } catch (error) {
    console.error('Error updating venue tour:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}
