import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserPageLayout from "@/app/components/user/UserPageLayout";
import ReferralsClient from "@/app/components/referrals/ReferralsClient";

export default async function CoupleReferralsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "COUPLE") {
    redirect("/");
  }

  return (
    <UserPageLayout>
      <ReferralsClient userRole="COUPLE" />
    </UserPageLayout>
  );
}
