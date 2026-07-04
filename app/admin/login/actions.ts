"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkAdminPassword, createAdminSession } from "@/lib/auth/admin-session";
import { rateLimit } from "@/lib/auth/rate-limit";

export type AdminLoginState = { status: "idle" | "error"; message?: string };

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") || "");

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000)) {
    return { status: "error", message: "Trop de tentatives — réessaie dans quelques minutes." };
  }

  if (!password || !checkAdminPassword(password)) {
    return { status: "error", message: "Mot de passe incorrect." };
  }

  await createAdminSession();
  redirect("/admin");
}
