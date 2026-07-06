import CreateProductForm from "./create-product-form";
import ProductRow from "./product-row";
import { listAllProducts, productImageUrl } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function AdminBoutiquePage() {
  let products: Awaited<ReturnType<typeof listAllProducts>> = [];
  let error = false;

  try {
    products = await listAllProducts();
  } catch (err) {
    console.error("listAllProducts failed", err);
    error = true;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl">Boutique</h1>
        <p className="mt-2 text-sm text-mute">Gère le catalogue affiché sur la page publique.</p>
      </div>

      {error ? (
        <p className="border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
          Supabase n&apos;est pas configuré, renseigne les variables d&apos;environnement pour
          activer la boutique.
        </p>
      ) : (
        <>
          <CreateProductForm />
          <div className="divide-y divide-line border-t border-line">
            {products.map((p) => (
              <ProductRow key={p.id} product={p} imageUrl={productImageUrl(p.image_path)} />
            ))}
            {products.length === 0 && <p className="py-6 text-sm text-mute">Aucun produit pour le moment.</p>}
          </div>
        </>
      )}
    </div>
  );
}
