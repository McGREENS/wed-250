import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserPageLayout from "@/app/components/user/UserPageLayout";
import CoupleMessagesClient from "./CoupleMessagesClient";

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
      <CoupleMessagesClient userId={session.user.id} />
    </UserPageLayout>
  );
}
