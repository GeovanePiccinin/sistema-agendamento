import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantId) {
    redirect("/login");
  }

  return session.user;
}
