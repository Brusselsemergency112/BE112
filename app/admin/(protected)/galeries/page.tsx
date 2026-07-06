import Link from "next/link";
import CreateGalleryForm from "./create-gallery-form";
import DeleteGalleryButton from "./delete-gallery-button";
import { listGalleries } from "@/lib/data/galleries";
import { categoryLabel } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminGaleriesPage() {
  let galleries: Awaited<ReturnType<typeof listGalleries>> = [];
  let error = false;

  try {
    galleries = await listGalleries();
  } catch (err) {
    console.error("listGalleries failed", err);
    error = true;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl">Galeries privées</h1>
        <p className="mt-2 text-sm text-mute">
          Crée une galerie, communique le code une seule fois, puis ajoute les photos.
        </p>
      </div>

      {error ? (
        <p className="border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
          Supabase n&apos;est pas configuré, renseigne les variables d&apos;environnement pour
          activer les galeries privées.
        </p>
      ) : (
        <>
          <CreateGalleryForm />

          <div>
            <h2 className="text-xs uppercase tracking-widest2 text-mute">
              Galeries existantes ({galleries.length})
            </h2>
            <div className="mt-4 divide-y divide-line border-t border-line">
              {galleries.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{g.title}</p>
                    <p className="text-xs text-mute">
                      {categoryLabel(g.category)} · {g.photo_count} photo
                      {g.photo_count > 1 ? "s" : ""} · code {g.code_hint} · expire le{" "}
                      {new Date(g.expires_at).toLocaleDateString("fr-BE")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/galeries/${g.id}`}
                      className="text-xs uppercase tracking-widest2 underline-hover"
                    >
                      Gérer →
                    </Link>
                    <DeleteGalleryButton id={g.id} />
                  </div>
                </div>
              ))}
              {galleries.length === 0 && (
                <p className="py-6 text-sm text-mute">Aucune galerie pour le moment.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
