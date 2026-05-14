import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VendorPageLayout from "@/app/components/vendor/VendorPageLayout";
import ReferralsClient from "@/app/components/referrals/ReferralsClient";

export default async function VendorReferralsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "VENDOR") {
    redirect("/");
  }

  return (
    <VendorPageLayout>
      <ReferralsClient userRole="VENDOR" />
    </VendorPageLayout>
  );
}
