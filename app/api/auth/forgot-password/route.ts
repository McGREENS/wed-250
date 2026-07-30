import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.cylacon.com',
  port: 587,
  secure: false,
  auth: {
    user: 'andiza@cylacon.com',
    pass: '3fGapSreQA7BhVLJemFs',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Generate random password
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));

    // Send email with new password
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr>
                <td style="background:#8B3A3A;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                  <p style="margin:0 0 6px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Password Reset</p>
                  <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your Password Has Been Reset 🔑</h1>
                </td>
              </tr>
              <tr>
                <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                  <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${user.name}</strong>,</p>
                  <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                    We received a request to reset your password. Your new temporary password is below:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;border-left:4px solid #8B3A3A;border-radius:0 8px 8px 0;margin-bottom:28px;">
                    <tr><td style="padding:24px 28px;">
                      <p style="margin:0 0 12px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your New Password</p>
                      <p style="margin:0;font-size:18px;color:#2C2C2C;font-weight:700;font-family:monospace;background:#fff;padding:16px;border-radius:6px;text-align:center;letter-spacing:2px;">${newPassword}</p>
                    </td></tr>
                  </table>
                  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      <strong>🔒 Security Tip:</strong> Please change this password immediately after logging in. Go to your profile settings to update it.
                    </p>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td align="center" style="padding:8px 0 28px;">
                      <a href="${process.env.NEXTAUTH_URL || 'https://www.andiza.rw'}/login"
                         style="display:inline-block;background:#8B3A3A;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">
                        Login to Your Account
                      </a>
                    </td></tr>
                  </table>
                  <p style="margin:0;font-size:13px;color:#999;line-height:1.6;border-top:1px solid #f0f0f0;padding-top:20px;">
                    If you didn't request this password reset, please contact us immediately.
                  </p>
                </td>
              </tr>
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
      from: '"Andiza Support" <andiza@cylacon.com>',
      to: email,
      subject: '🔑 Password Reset - Andiza',
      html,
    });

    return NextResponse.json({ message: 'New password sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
