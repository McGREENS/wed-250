import { redirect } from 'next/navigation';

export default async function VenuesPage() {
    // Pre-launch: Redirect to homepage
    redirect('/?coming-soon=venues');
}
