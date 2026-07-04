"use server";

import { revalidatePath } from "next/cache";
import { createProduct, deleteProduct, toggleProductActive } from "@/lib/data/products";

export type CreateProductState = { status: "idle" | "error" | "success"; message?: string };

export async function createProductAction(
  _prev: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceLabel = String(formData.get("priceLabel") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const image = formData.get("image");

  if (!name || name.length > 200) {
    return { status: "error", message: "Nom invalide." };
  }

  try {
    await createProduct({
      name,
      description,
      priceLabel,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      image: image instanceof File ? image : null,
    });
    revalidatePath("/admin/boutique");
    revalidatePath("/boutique");
    return { status: "success" };
  } catch (err) {
    console.error("createProduct failed", err);
    return { status: "error", message: "Erreur lors de la création du produit." };
  }
}

export async function toggleProductAction(id: string, active: boolean): Promise<void> {
  await toggleProductActive(id, active);
  revalidatePath("/admin/boutique");
  revalidatePath("/boutique");
}

export async function deleteProductAction(id: string): Promise<void> {
  await deleteProduct(id);
  revalidatePath("/admin/boutique");
  revalidatePath("/boutique");
}
