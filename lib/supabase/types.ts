export type GalleryCategoryValue = string;

export type GalleryRow = {
  id: string;
  slug: string;
  title: string;
  category: GalleryCategoryValue;
  code_hash: string;
  code_hint: string | null;
  duration_days: number;
  expires_at: string;
  created_at: string;
};

export type GalleryPhotoRow = {
  id: string;
  gallery_id: string;
  storage_path: string;
  filename: string;
  content_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type ShopProductRow = {
  id: string;
  name: string;
  description: string | null;
  price_label: string | null;
  image_path: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};
