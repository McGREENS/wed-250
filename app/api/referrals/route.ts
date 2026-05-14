import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { referrals, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.cylacon.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'andiza@cylacon.com',
    pass: process.env.SMTP_PASSWORD || '3fGapSreQA7BhVLJemFs',
  },
});

// Generate unique referral code
function generateReferralCode(): string {
  return crypto.randomBytes(16).toString('hex');
}

// GET - Fetch all referrals for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userReferrals = await db
      .select({
        id: referrals.id,
        referralCode: referrals.referralCode,
        referredEmail: referrals.referredEmail,
        referredName: referrals.referredName,
        referredRole: referrals.referredRole,
        status: referrals.status,
        emailSent: referrals.emailSent,
        emailSentAt: referrals.emailSentAt,
        acceptedAt: referrals.acceptedAt,
        expiresAt: referrals.expiresAt,
        createdAt: referrals.createdAt,
        referredUserName: users.name,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredUserId, users.id))
      .where(eq(referrals.referrerId, session.user.id))
      .orderBy(desc(referrals.createdAt));

    return NextResponse.json({ referrals: userReferrals });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

// POST - Create a new referral
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { referredEmail, referredName, referredRole } = body;

    // Validation
    if (!referredEmail || !referredRole) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    if (!['COUPLE', 'VENDOR'].includes(referredRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be COUPLE or VENDOR' },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, referredEmail))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Check if there's already a pending referral for this email
    const [existingReferral] = await db
      .select()
      .from(referrals)
      .where(
        and(
          eq(referrals.referredEmail, referredEmail),
          eq(referrals.status, 'PENDING')
        )
      )
      .limit(1);

    if (existingReferral) {
      return NextResponse.json(
        { error: 'A pending referral already exists for this email' },
        { status: 400 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = true;
    
    while (codeExists) {
      const [existing] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, referralCode))
        .limit(1);
      
      if (!existing) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create referral
    const [newReferral] = await db
      .insert(referrals)
      .values({
        referrerId: session.user.id,
        referralCode,
        referredEmail,
        referredName: referredName || null,
        referredRole,
        expiresAt,
      } as any)
      .returning();

    // Send invitation email
    try {
      const referralLink = `${process.env.NEXTAUTH_URL}/signup?ref=${referralCode}`;
      
      await transporter.sendMail({
        from: '"Andiza" <andiza@cylacon.com>',
        to: referredEmail,
        subject: `${session.user.name} invited you to join Andiza`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>You're Invited to Andiza</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hello${referredName ? ` ${referredName}` : ''},
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  <strong>${session.user.name}</strong> has invited you to join <strong>Andiza</strong>, 
                  the premier wedding planning platform, as a <strong>${referredRole === 'VENDOR' ? 'Vendor' : 'Couple'}</strong>.
                </p>
                
                ${referredRole === 'VENDOR' ? `
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    As a vendor, you'll be able to:
                  </p>
                  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
                    <li>Showcase your services to couples planning their weddings</li>
                    <li>Manage bookings and calendar</li>
                    <li>Communicate directly with potential clients</li>
                    <li>Build your portfolio and grow your business</li>
                  </ul>
                ` : `
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    As a couple, you'll be able to:
                  </p>
                  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
                    <li>Browse and book top wedding vendors</li>
                    <li>Plan your perfect wedding with our tools</li>
                    <li>Manage your budget and guest list</li>
                    <li>Communicate with all your vendors in one place</li>
                  </ul>
                `}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${referralLink}" 
                     style="background: #8B4513; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
                    Accept Invitation
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                  This invitation will expire on <strong>${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
                </p>
                
                <p style="font-size: 14px; color: #666; margin-top: 10px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${referralLink}" style="color: #8B4513; word-break: break-all;">${referralLink}</a>
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Andiza Wedding Platform. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      });

      // Update referral to mark email as sent
      await db
        .update(referrals)
        .set({
          emailSent: true,
          emailSentAt: new Date(),
          updatedAt: new Date(),
        } as any)
        .where(eq(referrals.id, newReferral.id));

      return NextResponse.json({
        success: true,
        referral: {
          ...newReferral,
          emailSent: true,
        },
        message: 'Invitation sent successfully',
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Return success but note email failure
      return NextResponse.json({
        success: true,
        referral: newReferral,
        message: 'Referral created but email failed to send',
        emailError: true,
      });
    }
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}
