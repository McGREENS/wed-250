import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VendorPageLayout from "@/app/components/vendor/VendorPageLayout";
import InvoicesClient from "./InvoicesClient";

export default async function VendorInvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "VENDOR") {
    redirect("/");
  }

  return (
    <VendorPageLayout>
      <InvoicesClient />
    </VendorPageLayout>
  );
}
