import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { recipientEmail, recipientName, subject, replyMessage } = body;

    if (!recipientEmail || !replyMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
                  <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Andiza Support</h1>
                </td>
              </tr>
              <tr>
                <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                  <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${recipientName}</strong>,</p>
                  <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                    Thank you for contacting us. Here's our response to your message:
                  </p>
                  <div style="background:#fdf8f4;border-left:4px solid #8B3A3A;border-radius:0 8px 8px 0;padding:24px 28px;margin-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#2C2C2C;line-height:1.7;white-space:pre-wrap;">${replyMessage}</p>
                  </div>
                  <p style="margin:0;font-size:13px;color:#999;line-height:1.6;border-top:1px solid #f0f0f0;padding-top:20px;">
                    If you have any further questions, feel free to reply to this email or contact us at support@andiza.rw.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#aaa;">Andiza — Rwanda's Wedding Planning Platform • Norrsken House Kigali</p>
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
      to: recipientEmail,
      subject: `Re: ${subject}`,
      html,
    });

    return NextResponse.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
