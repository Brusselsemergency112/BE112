import "server-only";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ShopProductRow } from "@/lib/supabase/types";

const BUCKET = "shop";

export async function listActiveProducts(): Promise<ShopProductRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("shop_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listAllProducts(): Promise<ShopProductRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("shop_products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function productImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  const { data } = supabaseAdmin().storage.from(BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
}

export async function createProduct(input: {
  name: string;
  description: string;
  priceLabel: string;
  sortOrder: number;
  image?: File | null;
}): Promise<ShopProductRow> {
  const client = supabaseAdmin();
  let imagePath: string | null = null;

  if (input.image && input.image.size > 0) {
    const extension = input.image.name.includes(".") ? input.image.name.split(".").pop() : "jpg";
    imagePath = `${randomUUID()}.${extension}`;
    const buffer = await input.image.arrayBuffer();
    const { error: uploadError } = await client.storage.from(BUCKET).upload(imagePath, buffer, {
      contentType: input.image.type || "image/jpeg",
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }

  const { data, error } = await client
    .from("shop_products")
    .insert({
      name: input.name,
      description: input.description || null,
      price_label: input.priceLabel || null,
      sort_order: input.sortOrder,
      image_path: imagePath,
      active: true,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function toggleProductActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabaseAdmin().from("shop_products").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const client = supabaseAdmin();
  const { data: product, error: fetchError } = await client
    .from("shop_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw fetchError;

  if (product?.image_path) {
    await client.storage.from(BUCKET).remove([product.image_path]);
  }

  const { error } = await client.from("shop_products").delete().eq("id", id);
  if (error) throw error;
}
