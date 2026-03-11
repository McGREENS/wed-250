import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string, role: "COUPLE" | "VENDOR") {
  const subject = role === "COUPLE" ? "Welcome to Andiza - Start Planning Your Dream Wedding!" : "Welcome to Andiza - Grow Your Wedding Business!";
  
  const html = role === "COUPLE" 
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B3A3A;">Welcome to Andiza, ${name}! 💍</h1>
        <p>We're thrilled to have you join our community of couples planning their dream weddings in Rwanda.</p>
        <p>With Andiza, you can:</p>
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
        <p>As an Andiza vendor, you can:</p>
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
