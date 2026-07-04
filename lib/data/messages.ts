import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ContactMessageRow } from "@/lib/supabase/types";

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabaseAdmin().from("contact_messages").insert({
    name: input.name,
    email: input.email,
    subject: input.subject || null,
    message: input.message,
  });
  if (error) throw error;
}

export async function listContactMessages(): Promise<ContactMessageRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markMessageRead(id: string): Promise<void> {
  const { error } = await supabaseAdmin().from("contact_messages").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabaseAdmin().from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}
