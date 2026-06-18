import { redirect } from 'next/navigation';

export default async function VendorsPage() {
  // Pre-launch: Redirect to homepage
  redirect('/?coming-soon=vendors');
}
