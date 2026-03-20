import { auth } from "@/auth";
import PublicLayout from '@/app/components/layout/PublicLayout';

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <PublicLayout session={session}>{children}</PublicLayout>;
}
