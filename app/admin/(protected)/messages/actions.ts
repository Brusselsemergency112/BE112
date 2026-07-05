"use server";

import { revalidatePath } from "next/cache";
import { deleteContactMessage, markMessageRead } from "@/lib/data/messages";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

export async function markMessageReadAction(id: string): Promise<void> {
  await requireAdmin();
  await markMessageRead(id);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteContactMessage(id);
  revalidatePath("/admin/messages");
}
