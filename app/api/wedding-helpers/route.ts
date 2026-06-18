import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { weddingHelpers, weddings, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, session.user.id),
    });

    if (!wedding) {
      return NextResponse.json([]);
    }

    const helpers = await db.query.weddingHelpers.findMany({
      where: eq(weddingHelpers.weddingId, wedding.id),
    });

    return NextResponse.json(helpers);
  } catch (error) {
    console.error("Failed to fetch helpers:", error);
    return NextResponse.json({ error: "Failed to fetch helpers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, session.user.id),
    });

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, email, phone, role, assignedTasks, weddingDetails } = body;

    // Check if user exists with this email
    let helperUserId = null;
    if (email) {
      const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser) {
        helperUserId = existingUser.id;
      }
    }

    // Generate unique access token
    const accessToken = crypto.randomBytes(32).toString('hex');

    const [helper] = await db.insert(weddingHelpers).values({
      weddingId: wedding.id,
      name,
      email,
      phone,
      role,
      assignedTasks: JSON.stringify(assignedTasks || []),
      helperUserId,
      accessToken,
    } as any).returning();

    // Send email notification if email is provided
    if (email && weddingDetails) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'mail.cylacon.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER || 'andiza@cylacon.com',
            pass: process.env.SMTP_PASSWORD || '3fGapSreQA7BhVLJemFs',
          },
        });

        const tasksList = assignedTasks?.length > 0 
          ? assignedTasks.map((task: string) => `<li style="padding:6px 0;font-size:14px;color:#2C2C2C;">${task}</li>`).join('')
          : '<li style="padding:6px 0;font-size:14px;color:#888;font-style:italic;">No specific tasks assigned yet</li>';

        const formattedDate = new Date(weddingDetails.weddingDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const baseUrl = process.env.NEXTAUTH_URL || 'https://andiza.co.rw';
        const magicLink = `${baseUrl}/helper-tasks?token=${accessToken}`;
        const loginLink = `${baseUrl}/login`;

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
          <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#8B3A3A;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                      <p style="margin:0 0 6px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Wedding Helper Assignment</p>
                      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">You've Been Added as a Wedding Helper! 💒</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                      <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${name}</strong>,</p>
                      <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                        You've been added as a helper for <strong>${weddingDetails.coupleNames}</strong>'s wedding! They're counting on your support to make their special day perfect.
                      </p>

                      <!-- Wedding details card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;border-left:4px solid #8B3A3A;border-radius:0 8px 8px 0;margin-bottom:28px;">
                        <tr><td style="padding:24px 28px;">
                          <p style="margin:0 0 16px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Wedding Details</p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:6px 0;width:120px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Couple</td>
                              <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${weddingDetails.coupleNames}</td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Date</td>
                              <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${formattedDate}</td>
                            </tr>
                            ${role ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Role</td><td style="padding:6px 0;font-size:14px;color:#2C2C2C;">${role}</td></tr>` : ''}
                          </table>
                        </td></tr>
                      </table>

                      <!-- Assigned tasks -->
                      <div style="background:#fff8f0;border-left:4px solid #d97706;border-radius:0 8px 8px 0;padding:24px 28px;margin-bottom:28px;">
                        <p style="margin:0 0 16px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Assigned Tasks</p>
                        <ul style="margin:0;padding-left:20px;list-style:disc;">
                          ${tasksList}
                        </ul>
                      </div>

                      <!-- Access options -->
                      <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
                        <p style="margin:0 0 12px;font-size:14px;color:#15803d;font-weight:600;">📋 Access Your Tasks</p>
                        <p style="margin:0 0 16px;font-size:13px;color:#166534;line-height:1.6;">Click the button below to view and manage your assigned tasks. No login required!</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr><td align="center" style="padding:8px 0;">
                            <a href="${magicLink}" style="display:inline-block;background:#8B3A3A;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">View My Tasks</a>
                          </td></tr>
                        </table>
                      </div>

                      <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;">
                        The couple appreciates your help in making their wedding day memorable. Please reach out to them if you have any questions about your tasks.
                      </p>

                      <p style="margin:0;font-size:13px;color:#999;line-height:1.6;border-top:1px solid #f0f0f0;padding-top:20px;">
                        This is a notification from Andiza Wedding Platform. If you believe you received this email in error, please contact the couple directly.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aaa;">Andiza &mdash; Rwanda's Wedding Planning Platform &bull; Norrsken House Kigali</p>
                    </td>
                  </tr>

                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: '"Andiza" <andiza@cylacon.com>',
          to: email,
          subject: `💒 You've Been Added as a Wedding Helper for ${weddingDetails.coupleNames}`,
          html,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return NextResponse.json(helper);
  } catch (error) {
    console.error("Failed to create helper:", error);
    return NextResponse.json({ error: "Failed to create helper" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, phone, role, assignedTasks } = body;

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, session.user.id),
    });

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const [updated] = await db.update(weddingHelpers)
      .set({
        name,
        email,
        phone,
        role,
        assignedTasks: JSON.stringify(assignedTasks || []),
        updatedAt: new Date(),
      } as any)
      .where(and(
        eq(weddingHelpers.id, id),
        eq(weddingHelpers.weddingId, wedding.id)
      ))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update helper:", error);
    return NextResponse.json({ error: "Failed to update helper" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Helper ID required" }, { status: 400 });
    }

    const wedding = await db.query.weddings.findFirst({
      where: eq(weddings.userId, session.user.id),
    });

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    await db.delete(weddingHelpers)
      .where(and(
        eq(weddingHelpers.id, id),
        eq(weddingHelpers.weddingId, wedding.id)
      ));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete helper:", error);
    return NextResponse.json({ error: "Failed to delete helper" }, { status: 500 });
  }
}
