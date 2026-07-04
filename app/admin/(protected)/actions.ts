"use server";

import { redirect } from "next/navigation";
import { destroyAdminSession } from "@/lib/auth/admin-session";

export async function adminLogout(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
