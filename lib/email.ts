import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string, role: "COUPLE" | "VENDOR") {
  const subject =
    role === "COUPLE"
      ? "Welcome to Andiza - Start Planning Your Dream Wedding!"
      : "Welcome to Andiza - Grow Your Wedding Business!";

  const html =
    role === "COUPLE"
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B3A3A;">Welcome to Andiza, ${name}! 💍</h1>
        <p>We're thrilled to have you join our community of couples planning their dream weddings in Rwanda.</p>
        <ul>
          <li>Browse and book top wedding venues and vendors</li>
          <li>Manage your wedding budget and checklist</li>
          <li>Track your guest list and RSVPs</li>
          <li>Save your favorite vendors and venues</li>
        </ul>
        <p>Ready to start planning? <a href="http://localhost:3000/dashboard" style="color: #8B3A3A;">Visit your dashboard</a></p>
        <p>Best wishes,<br/>The Andiza Team<br/>Norrsken House Kigali</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B3A3A;">Welcome to Andiza, ${name}! 🎉</h1>
        <p>Thank you for joining Andiza as a wedding vendor. We're excited to help you grow your business!</p>
        <ul>
          <li>Showcase your services to couples across Rwanda</li>
          <li>Manage bookings and calendar availability</li>
          <li>Build your portfolio and collect reviews</li>
          <li>Connect with couples planning their special day</li>
        </ul>
        <p>Get started now: <a href="http://localhost:3000/vendor/dashboard" style="color: #8B3A3A;">Visit your vendor dashboard</a></p>
        <p>Best regards,<br/>The Andiza Team<br/>Norrsken House Kigali</p>
      </div>
    `;

  const result = await resend.emails.send({
    from: "Andiza <onboarding@resend.dev>",
    to: email,
    subject,
    html,
  });

  console.log("Email sent result:", result);
  return result;
}

export async function sendTourConfirmationEmail({
  email,
  name,
  venueName,
  tourDate,
  tourTime,
}: {
  email: string;
  name: string;
  venueName: string;
  tourDate: Date;
  tourTime: string;
}) {
  const formattedDate = new Date(tourDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
      <div style="background-color: #8B3A3A; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Your Venue Visit is Confirmed! 🎉</h1>
      </div>
      <div style="background-color: #fff; padding: 32px; border: 1px solid #E6E2DD; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px;">Great news! Your venue visit request has been <strong style="color: #16a34a;">approved</strong>. Here are your visit details:</p>
        <div style="background-color: #fdf8f4; border-left: 4px solid #8B3A3A; padding: 20px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Venue:</strong> ${venueName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${tourTime}</p>
        </div>
        <p style="font-size: 15px; color: #555;">Please make sure to arrive on time. If you need to reschedule or have any questions, contact the venue directly.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/bookings"
             style="background-color: #8B3A3A; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">
            View in Dashboard
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">Best wishes,<br/>The Andiza Team<br/>Norrsken House Kigali</p>
      </div>
    </div>
  `;

  const result = await resend.emails.send({
    from: "Andiza <onboarding@resend.dev>",
    to: email,
    subject: `✅ Venue Visit Confirmed – ${venueName} on ${formattedDate}`,
    html,
  });

  console.log("Tour confirmation email sent:", result);
  return result;
}

export async function sendQuoteRequestEmail({
  vendorEmail,
  vendorName,
  venueName,
  clientName,
  clientEmail,
  clientPhone,
  eventDate,
  guestCount,
  message,
  contactMethod,
  dashboardUrl,
}: {
  vendorEmail: string;
  vendorName: string;
  venueName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  contactMethod: string;
  dashboardUrl: string;
}) {
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
                <p style="margin:0 0 6px 0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:2px;text-transform:uppercase;">New Quote Request</p>
                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Someone wants to book your venue!</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="background:#ffffff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${vendorName}</strong>,</p>
                <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                  A couple has submitted a quote request for <strong>${venueName}</strong>. Here are their details:
                </p>

                <!-- Client details card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;border-left:4px solid #8B3A3A;border-radius:0 8px 8px 0;margin-bottom:28px;">
                  <tr><td style="padding:24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;width:140px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Name</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${clientName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;"><a href="mailto:${clientEmail}" style="color:#8B3A3A;">${clientEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Phone</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;">${clientPhone}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Event Date</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Guest Count</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;">${guestCount} guests</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Contact Via</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;text-transform:capitalize;">${contactMethod}</td>
                      </tr>
                    </table>
                  </td></tr>
                </table>

                <!-- Message -->
                ${message ? `
                <p style="margin:0 0 8px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Their Message</p>
                <div style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                  <p style="margin:0;font-size:14px;color:#444;line-height:1.7;font-style:italic;">&ldquo;${message}&rdquo;</p>
                </div>` : ''}

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding:8px 0 28px;">
                    <a href="${dashboardUrl}"
                       style="display:inline-block;background:#8B3A3A;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      View &amp; Respond in Dashboard
                    </a>
                  </td></tr>
                </table>

                <p style="margin:0;font-size:13px;color:#999;line-height:1.6;border-top:1px solid #f0f0f0;padding-top:20px;">
                  Reply directly to the client at <a href="mailto:${clientEmail}" style="color:#8B3A3A;">${clientEmail}</a> or manage this request from your Andiza dashboard.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#aaa;">Andiza &mdash; Rwanda&rsquo;s Wedding Planning Platform &bull; Norrsken House Kigali</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const result = await resend.emails.send({
    from: 'Andiza <onboarding@resend.dev>',
    to: vendorEmail,
    replyTo: clientEmail,
    subject: `💌 New Quote Request for ${venueName} — ${eventDate}`,
    html,
  });

  console.log('Quote request email sent:', result);
  return result;
}

export async function sendQuoteAcceptedEmail({
  clientEmail, clientName, venueName, eventDate, totalAmount, depositAmount, servicePackage, dashboardUrl,
}: {
  clientEmail: string; clientName: string; venueName: string; eventDate: string;
  totalAmount: number; depositAmount: number | null; servicePackage: string | null; dashboardUrl: string;
}) {
  const html = `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="background:#16a34a;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                <p style="margin:0 0 6px;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Quote Accepted</p>
                <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your venue booking is confirmed! 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${clientName}</strong>,</p>
                <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                  Great news! <strong>${venueName}</strong> has accepted your quote request. Here are your booking details:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;margin-bottom:28px;">
                  <tr><td style="padding:24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;width:160px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Venue</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${venueName}</td>
                      </tr>
                      ${servicePackage ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Package</td><td style="padding:6px 0;font-size:14px;color:#2C2C2C;">${servicePackage}</td></tr>` : ''}
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Event Date</td>
                        <td style="padding:6px 0;font-size:14px;color:#2C2C2C;font-weight:600;">${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Total Amount</td>
                        <td style="padding:6px 0;font-size:15px;color:#16a34a;font-weight:700;">${totalAmount.toLocaleString()} RWF</td>
                      </tr>
                      ${depositAmount ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Deposit Required</td><td style="padding:6px 0;font-size:14px;color:#2C2C2C;">${depositAmount.toLocaleString()} RWF</td></tr>` : ''}
                    </table>
                  </td></tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding:8px 0 28px;">
                    <a href="${dashboardUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">View Booking Details</a>
                  </td></tr>
                </table>
                <p style="margin:0;font-size:13px;color:#999;border-top:1px solid #f0f0f0;padding-top:20px;">The venue will contact you shortly to finalise the details.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#aaa;">Andiza &mdash; Rwanda&rsquo;s Wedding Planning Platform &bull; Norrsken House Kigali</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>
  `;
  return resend.emails.send({
    from: 'Andiza <onboarding@resend.dev>',
    to: clientEmail,
    subject: `✅ Booking Confirmed — ${venueName} on ${eventDate}`,
    html,
  });
}

export async function sendQuoteDeclinedEmail({
  clientEmail, clientName, venueName, eventDate, reason,
}: {
  clientEmail: string; clientName: string; venueName: string; eventDate: string; reason: string;
}) {
  const html = `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="background:#6b7280;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                <p style="margin:0 0 6px;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Quote Update</p>
                <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your quote request was not accepted</h1>
              </td>
            </tr>
            <tr>
              <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${clientName}</strong>,</p>
                <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                  Unfortunately, <strong>${venueName}</strong> was unable to accept your quote request for <strong>${eventDate}</strong>.
                </p>
                <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
                  <p style="margin:0 0 6px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reason from the venue</p>
                  <p style="margin:0;font-size:14px;color:#2C2C2C;line-height:1.6;font-style:italic;">&ldquo;${reason}&rdquo;</p>
                </div>
                <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;">Don't worry — there are many other great venues available on Andiza. Browse alternatives and find your perfect match.</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding:8px 0 28px;">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/venues" style="display:inline-block;background:#8B3A3A;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">Browse More Venues</a>
                  </td></tr>
                </table>
                <p style="margin:0;font-size:13px;color:#999;border-top:1px solid #f0f0f0;padding-top:20px;">We're sorry this didn't work out. The Andiza team is here to help you find the right venue.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#aaa;">Andiza &mdash; Rwanda&rsquo;s Wedding Planning Platform &bull; Norrsken House Kigali</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>
  `;
  return resend.emails.send({
    from: 'Andiza <onboarding@resend.dev>',
    to: clientEmail,
    subject: `Quote Update — ${venueName}`,
    html,
  });
}

export async function sendTourDeclinedEmail({
  email,
  name,
  venueName,
  tourDate,
  tourTime,
}: {
  email: string;
  name: string;
  venueName: string;
  tourDate: Date;
  tourTime: string;
}) {
  const formattedDate = new Date(tourDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
      <div style="background-color: #6b7280; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Venue Visit Update</h1>
      </div>
      <div style="background-color: #fff; padding: 32px; border: 1px solid #E6E2DD; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px;">Unfortunately, your venue visit request has been <strong style="color: #dc2626;">declined</strong> by the venue. Here were your requested details:</p>
        <div style="background-color: #fdf8f4; border-left: 4px solid #6b7280; padding: 20px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Venue:</strong> ${venueName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${tourTime}</p>
        </div>
        <p style="font-size: 15px; color: #555;">Don't worry — there are many other great venues available. Browse more options and schedule another visit.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/venues"
             style="background-color: #8B3A3A; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">
            Browse More Venues
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">Best wishes,<br/>The Andiza Team<br/>Norrsken House Kigali</p>
      </div>
    </div>
  `;

  const result = await resend.emails.send({
    from: "Andiza <onboarding@resend.dev>",
    to: email,
    subject: `Venue Visit Request Update – ${venueName}`,
    html,
  });

  console.log("Tour declined email sent:", result);
  return result;
}
