import PublicLayout from '@/app/components/layout/PublicLayout';

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session is read client-side via useSession() in PublicLayout,
  // avoiding a duplicate auth() server round-trip on every public page.
  return <PublicLayout>{children}</PublicLayout>;
}
