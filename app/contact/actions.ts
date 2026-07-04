"use server";

import { headers } from "next/headers";
import { createContactMessage } from "@/lib/data/messages";
import { rateLimit } from "@/lib/auth/rate-limit";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const honeypot = String(formData.get("company") || "").trim();

  if (honeypot) {
    return { status: "success" };
  }

  if (!name || !email || !message) {
    return { status: "error", message: "Merci de compléter les champs obligatoires." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }
  if (name.length > 200 || subject.length > 200 || message.length > 5000) {
    return { status: "error", message: "Un champ dépasse la longueur autorisée." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return { status: "error", message: "Trop de tentatives — réessaie dans quelques minutes." };
  }

  try {
    await createContactMessage({ name, email, subject, message });
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Une erreur est survenue. Réessaie plus tard ou écris directement par e-mail.",
    };
  }
}
