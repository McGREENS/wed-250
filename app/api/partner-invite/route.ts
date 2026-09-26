import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, weddings } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { resolveOwnerUserId } from '@/lib/resolveOwner';
import nodemailer from 'nodemailer';

const smtpPort = parseInt(process.env.SMTP_PORT || '465');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.cylacon.com',
  port: smtpPort,
  secure: smtpPort === 465,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER || 'andiza@cylacon.com',
    pass: process.env.SMTP_PASSWORD || '3fGapSreQA7BhVLJemFs',
  },
});

async function sendPartnerEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({ from: '"Andiza" <andiza@cylacon.com>', to, subject, html });
}

// GET — return current partner info
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ownerUserId = await resolveOwnerUserId(session.user.id);
  const [wedding] = await db.select().from(weddings).where(eq(weddings.userId, ownerUserId)).limit(1);
  if (!wedding) return NextResponse.json({ partner: null });

  if (!wedding.partnerUserId) return NextResponse.json({ partner: null });

  const [partner] = await db.select({ id: users.id, name: users.name, email: users.email })
    .from(users).where(eq(users.id, wedding.partnerUserId)).limit(1);

  return NextResponse.json({ partner: partner || null });
}

// POST — invite partner
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { partnerName, partnerEmail, ownerPassword } = await req.json();
  if (!partnerName || !partnerEmail || !ownerPassword) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }

  const ownerUserId = await resolveOwnerUserId(session.user.id);

  // Only the original owner can invite a partner
  if (ownerUserId !== session.user.id) {
    return NextResponse.json({ error: 'Only the account owner can invite a partner' }, { status: 403 });
  }

  const [wedding] = await db.select().from(weddings).where(eq(weddings.userId, ownerUserId)).limit(1);
  if (!wedding) return NextResponse.json({ error: 'Please save your wedding details first' }, { status: 400 });

  // Verify owner's password
  const [ownerUser] = await db.select().from(users).where(eq(users.id, ownerUserId)).limit(1);
  const passwordValid = ownerUser?.password && await bcrypt.compare(ownerPassword, ownerUser.password);
  if (!passwordValid) {
    return NextResponse.json({ error: 'Incorrect password. Please enter your current password.' }, { status: 401 });
  }

  // Check if partner email is already a user
  const [existingUser] = await db.select().from(users).where(eq(users.email, partnerEmail)).limit(1);

  let partnerUser = existingUser;
  let tempPassword: string | null = null;

  const hashed = await bcrypt.hash(ownerPassword, 10);

  if (!existingUser) {
    tempPassword = ownerPassword;
    await db.insert(users).values({ name: partnerName, email: partnerEmail, password: hashed, role: 'COUPLE' } as any);
    const [created] = await db.select().from(users).where(eq(users.email, partnerEmail)).limit(1);
    partnerUser = created;
  } else {
    // Update their password to match the owner's so credentials in email are valid
    tempPassword = ownerPassword;
    await db.update(users).set({ password: hashed } as any).where(eq(users.id, existingUser.id));
  }

  // Build email — always include credentials
  const subject = `${session.user.name} invited you to plan your wedding on Andiza 💍`;

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#8B3A3A;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">You're invited! 💍</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:15px;">${session.user.name} wants to plan your wedding together</p>
      </div>
      <div style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
        <p style="font-size:15px;color:#444;">Hi <strong>${partnerName}</strong>,</p>
        <p style="font-size:15px;color:#444;line-height:1.6;">
          <strong>${session.user.name}</strong> has invited you to join their wedding planning account on Andiza.
          You'll have full access to view and manage everything together — tasks, budget, vendors, and more.
        </p>
        <div style="background:#fdf8f4;border-left:4px solid #8B3A3A;border-radius:0 8px 8px 0;padding:24px 28px;margin:24px 0;">
          <p style="margin:0 0 6px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Login Credentials</p>
          <p style="margin:8px 0;font-size:14px;color:#2C2C2C;"><strong>Email:</strong> ${partnerEmail}</p>
          <p style="margin:8px 0;font-size:14px;color:#2C2C2C;"><strong>Password:</strong> <span style="font-family:monospace;background:#f3f4f6;padding:2px 8px;border-radius:4px;">${tempPassword}</span></p>
        </div>
        <p style="font-size:13px;color:#888;">Please change your password after your first login.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'https://www.andiza.co.rw'}/login"
             style="display:inline-block;background:#8B3A3A;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">Login to Your Account</a>
        </div>
      </div>
      <div style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#aaa;">Andiza — Rwanda's Wedding Planning Platform • Norrsken House Kigali</p>
      </div>
    </div>`;

  // Send email — if it fails for a new user, delete the created account and return error
  try {
    await sendPartnerEmail(partnerEmail, subject, html);
  } catch (err) {
    console.error('Partner email failed:', err);
    if (!existingUser) {
      await db.delete(users).where(eq(users.email, partnerEmail));
    }
    return NextResponse.json({ error: 'Failed to send invite email. Please try again.' }, { status: 500 });
  }

  // Link partner to wedding only after email is confirmed sent
  await db.update(weddings)
    .set({ partnerUserId: partnerUser.id } as any)
    .where(eq(weddings.userId, ownerUserId));

  return NextResponse.json({ success: true, partnerName, partnerEmail });
}

// DELETE — remove partner link
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ownerUserId = await resolveOwnerUserId(session.user.id);
  if (ownerUserId !== session.user.id) {
    return NextResponse.json({ error: 'Only the account owner can remove a partner' }, { status: 403 });
  }

  await db.update(weddings)
    .set({ partnerUserId: null } as any)
    .where(eq(weddings.userId, ownerUserId));

  return NextResponse.json({ success: true });
}
