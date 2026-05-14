import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { referrals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.cylacon.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'andiza@cylacon.com',
    pass: process.env.SMTP_PASSWORD || '3fGapSreQA7BhVLJemFs',
  },
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { referralId } = body;

    if (!referralId) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    const [referral] = await db
      .select()
      .from(referrals)
      .where(
        and(
          eq(referrals.id, referralId),
          eq(referrals.referrerId, session.user.id)
        )
      )
      .limit(1);

    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    if (referral.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only resend emails for pending referrals' },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(referral.expiresAt);
    
    if (now > expiresAt) {
      await db
        .update(referrals)
        .set({ status: 'EXPIRED' as const, updatedAt: new Date() } as any)
        .where(eq(referrals.id, referral.id));
      
      return NextResponse.json(
        { error: 'This referral has expired' },
        { status: 400 }
      );
    }

    const referralLink = `${process.env.NEXTAUTH_URL}/signup?ref=${referral.referralCode}`;

    await transporter.sendMail({
      from: '"Andiza" <andiza@cylacon.com>',
      to: referral.referredEmail,
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
                Hello${referral.referredName ? ` ${referral.referredName}` : ''},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${session.user.name}</strong> has invited you to join <strong>Andiza</strong>, 
                the premier wedding planning platform, as a <strong>${referral.referredRole === 'VENDOR' ? 'Vendor' : 'Couple'}</strong>.
              </p>
              
              ${referral.referredRole === 'VENDOR' ? `
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

    await db
      .update(referrals)
      .set({
        emailSent: true,
        emailSentAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq(referrals.id, referral.id));

    return NextResponse.json({
      success: true,
      message: 'Invitation email resent successfully',
    });
  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json(
      { error: 'Failed to resend invitation email' },
      { status: 500 }
    );
  }
}
