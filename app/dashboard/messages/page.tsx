import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserPageLayout from "@/app/components/user/UserPageLayout";
import CoupleMessagesClient from "./CoupleMessagesClient";
import DiscoverBanner from "@/app/components/dashboard/DiscoverBanner";

export default async function CoupleMessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "COUPLE") {
    redirect("/");
  }

  return (
    <UserPageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Messages</h1>
          <p className="text-gray-600">Chat with your vendors</p>
        </div>
        <DiscoverBanner />
        <CoupleMessagesClient userId={session.user.id} />
      </div>
    </UserPageLayout>
  );
}
