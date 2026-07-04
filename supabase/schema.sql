-- BE112 — schéma Supabase
-- À exécuter une fois dans : Supabase Dashboard > SQL Editor > New query > Run
--
-- Sécurité : toutes les tables ont RLS activé et AUCUNE policy pour les rôles
-- anon/authenticated. Seule la clé "service_role" (utilisée uniquement côté
-- serveur, jamais exposée au navigateur) peut lire/écrire ces données — elle
-- contourne RLS par nature. Le site n'utilise jamais la clé anon pour ces
-- tables : tout passe par les Server Actions / Route Handlers Next.js.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Galeries privées (Section / Medical Team / Ambulanciers / Services / Autre)
-- ---------------------------------------------------------------------------
create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('section', 'medicalteam', 'ambulancier', 'services', 'autre')),
  code_hash text not null unique,
  code_hint text,
  duration_days integer not null check (duration_days > 0 and duration_days <= 365),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists galleries_expires_at_idx on galleries (expires_at);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries (id) on delete cascade,
  storage_path text not null,
  filename text not null,
  content_type text,
  size_bytes bigint,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_gallery_id_idx on gallery_photos (gallery_id);

alter table galleries enable row level security;
alter table gallery_photos enable row level security;

-- ---------------------------------------------------------------------------
-- Boutique (catalogue, sans paiement en ligne — demande par e-mail)
-- ---------------------------------------------------------------------------
create table if not exists shop_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_label text,
  image_path text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table shop_products enable row level security;

-- ---------------------------------------------------------------------------
-- Messages de contact
-- ---------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- ---------------------------------------------------------------------------
-- Storage buckets
--   - private-photos : galeries privées à code (jamais publiques, accès via
--     URL signée générée côté serveur avec la clé service_role)
--   - shop : visuels de la boutique (public, lecture directe par URL)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('private-photos', 'private-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('shop', 'shop', true)
on conflict (id) do nothing;
