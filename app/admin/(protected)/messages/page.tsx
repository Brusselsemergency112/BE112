import MessageRow from "./message-row";
import { listContactMessages } from "@/lib/data/messages";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof listContactMessages>> = [];
  let error = false;

  try {
    messages = await listContactMessages();
  } catch (err) {
    console.error("listContactMessages failed", err);
    error = true;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Messages</h1>
        <p className="mt-2 text-sm text-mute">Demandes reçues via le formulaire de contact.</p>
      </div>

      {error ? (
        <p className="border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
          Supabase n&apos;est pas configuré, renseigne les variables d&apos;environnement.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} />
          ))}
          {messages.length === 0 && <p className="text-sm text-mute">Aucun message pour le moment.</p>}
        </div>
      )}
    </div>
  );
}
