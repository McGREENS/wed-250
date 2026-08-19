import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoices, vendors } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'whm-market06.aos.rw',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'noreply@andiza.co.rw',
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, session.user.id))
      .limit(1);

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.id, invoiceId),
          eq(invoices.vendorId, vendor.id)
        )
      )
      .limit(1);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const items = JSON.parse(invoice.items);
    const invoiceUrl = `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}`;

    const itemsHtml = items.map((item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e8e8e8;">${item.description}</td>
          <td style="padding:12px;border-bottom:1px solid #e8e8e8;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #e8e8e8;text-align:right;">${item.unitPrice.toLocaleString()} RWF</td>
          <td style="padding:12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:600;">${itemTotal.toLocaleString()} RWF</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoice.invoiceNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${invoice.color || '#8B4513'} 0%, ${invoice.color || '#8B4513'}dd 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Invoice</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">${invoice.invoiceNumber}</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <div style="margin-bottom: 30px;">
              <div style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; color: ${invoice.color || '#8B4513'};">From:</h2>
                <p style="margin: 0; font-weight: 600;">${vendor.businessName}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${vendor.location || ''}</p>
              </div>
              <div>
                <h2 style="margin: 0 0 10px 0; color: ${invoice.color || '#8B4513'};">To:</h2>
                <p style="margin: 0; font-weight: 600;">${invoice.clientName}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${invoice.clientEmail}</p>
                ${invoice.clientPhone ? `<p style="margin: 5px 0 0 0; color: #666;">${invoice.clientPhone}</p>` : ''}
                ${invoice.clientAddress ? `<p style="margin: 5px 0 0 0; color: #666;">${invoice.clientAddress}</p>` : ''}
              </div>
            </div>

            <div style="background: #fdf8f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Invoice Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${new Date(invoice.issueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Due Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right; color: ${invoice.color || '#8B4513'}; font-weight: 600;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background: ${invoice.color || '#8B4513'}; color: white;">
                  <th style="padding: 12px; text-align: left;">Description</th>
                  <th style="padding: 12px; text-align: center; width: 80px;">Qty</th>
                  <th style="padding: 12px; text-align: right; width: 120px;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; width: 120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-bottom: 30px;">
              <table style="margin-left: auto; min-width: 300px;">
                <tr>
                  <td style="padding: 8px 20px 8px 0; text-align: right;">Subtotal:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${invoice.subtotal.toLocaleString()} RWF</td>
                </tr>
                <tr>
                  <td style="padding: 8px 20px 8px 0; text-align: right;">Tax (18%):</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${invoice.taxAmount.toLocaleString()} RWF</td>
                </tr>
                ${invoice.discount > 0 ? `
                <tr>
                  <td style="padding: 8px 20px 8px 0; text-align: right; color: #16a34a;">Discount:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #16a34a;">-${invoice.discount.toLocaleString()} RWF</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid ${invoice.color || '#8B4513'};">
                  <td style="padding: 12px 20px 12px 0; text-align: right; font-size: 18px; font-weight: 700;">Total:</td>
                  <td style="padding: 12px 0; text-align: right; font-size: 20px; font-weight: 700; color: ${invoice.color || '#8B4513'};">${invoice.total.toLocaleString()} RWF</td>
                </tr>
              </table>
            </div>

            ${invoice.notes ? `
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: ${invoice.color || '#8B4513'};">Notes:</h3>
              <p style="margin: 0; color: #666;">${invoice.notes}</p>
            </div>
            ` : ''}

            ${invoice.terms ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">Payment Terms:</h3>
              <p style="margin: 0; color: #78350f;">${invoice.terms}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoiceUrl}" 
                 style="background: ${invoice.color || '#8B4513'}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                View Invoice Online
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px; padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <p style="margin: 0;">Thank you for your business!</p>
            <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} ${vendor.businessName}. Powered by Andiza.</p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Andiza" <${process.env.SMTP_USER || 'noreply@andiza.co.rw'}>`,
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${vendor.businessName}`,
      html,
    });

    await db
      .update(invoices)
      .set({
        status: 'SENT' as const,
        sentAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq(invoices.id, invoice.id));

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
    });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }
}
