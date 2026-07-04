"use server";

import { revalidatePath } from "next/cache";
import { deleteContactMessage, markMessageRead } from "@/lib/data/messages";

export async function markMessageReadAction(id: string): Promise<void> {
  await markMessageRead(id);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string): Promise<void> {
  await deleteContactMessage(id);
  revalidatePath("/admin/messages");
}
