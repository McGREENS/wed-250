import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoices, vendors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import InvoiceView from './InvoiceView';

export default async function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  if (!invoice) {
    notFound();
  }

  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, invoice.vendorId))
    .limit(1);

  const items = JSON.parse(invoice.items);
  const color = invoice.color || "#8B4513";

  return (
    <InvoiceView 
      invoice={invoice}
      vendor={vendor}
      items={items}
      color={color}
    />
  );
}
