"use server";

import { headers } from "next/headers";
import { createContactMessage } from "@/lib/data/messages";
import { rateLimit } from "@/lib/auth/rate-limit";
import { BOOKING_SERVICES } from "@/lib/site";

export type BookingState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitBookingAction(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const serviceId = String(formData.get("service") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const details = String(formData.get("details") || "").trim();
  const honeypot = String(formData.get("company") || "").trim();

  if (honeypot) return { status: "success" };

  const service = BOOKING_SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return { status: "error", message: "Choisis d'abord un type de séance." };
  }
  if (!name || !email) {
    return { status: "error", message: "Merci d'indiquer ton nom et ton e-mail." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }
  if (name.length > 200 || date.length > 100 || location.length > 200 || details.length > 4000) {
    return { status: "error", message: "Un champ dépasse la longueur autorisée." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000)) {
    return { status: "error", message: "Trop de demandes, réessaie dans quelques minutes." };
  }

  const lines = [`Type de séance : ${service.title}`];
  if (date) lines.push(`Date souhaitée : ${date}`);
  if (location) lines.push(`Lieu : ${location}`);
  lines.push("", details || "(pas de détails complémentaires)");
  const message = lines.join("\n");

  try {
    await createContactMessage({
      name,
      email,
      subject: `Réservation : ${service.title}`,
      message,
    });
    return { status: "success" };
  } catch (err) {
    console.error("submitBooking failed", err);
    return {
      status: "error",
      message: "Une erreur est survenue, réessaie ou écris-nous directement par e-mail.",
    };
  }
}
