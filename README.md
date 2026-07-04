# BE112  Ilias Remchani

Site photographe (portfolio, galeries privées à code, boutique) construit avec Next.js 16
(App Router), Tailwind CSS v4 et Supabase.

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil |
| `/biographie` | Biographie |
| `/galerie` | Galerie publique (fil Instagram + sélection d'œuvres) |
| `/galerie-privee` | Espace privé à code (Section, Medical Team, Ambulanciers, Services…) |
| `/boutique` | Boutique (catalogue, demande par e-mail) |
| `/contact` | Contact + confidentialité / RGPD |
| `/confidentialite` | Politique de confidentialité complète |
| `/admin` | Administration (protégée par mot de passe) |

## Stack

- **Next.js 16** (App Router, Server Actions) + TypeScript + Tailwind CSS v4
- **Supabase** : base de données Postgres (galeries, codes, produits, messages) + Storage
  (photos privées, visuels boutique)
- **Vercel** : hébergement + Cron Job quotidien pour la suppression automatique des galeries
  expirées

Aucune donnée sensible (clé Supabase, secrets) n'est jamais exposée au navigateur : toutes les
opérations passent par des Server Actions / Route Handlers exécutés côté serveur.

## 1. Créer le projet Supabase

1. Crée un compte / projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, ouvre une nouvelle requête, colle le contenu de
   [`supabase/schema.sql`](./supabase/schema.sql) et exécute-la. Cela crée les tables
   (`galleries`, `gallery_photos`, `shop_products`, `contact_messages`), active la sécurité au
   niveau des lignes (RLS) et crée les buckets de stockage `private-photos` (privé) et `shop`
   (public).
3. Dans **Project Settings > API**, note :
   - `Project URL` → variable `SUPABASE_URL`
   - `service_role` key → variable `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secrète, ne jamais la mettre
     dans une variable `NEXT_PUBLIC_*`)

## 2. Variables d'environnement

Copie `.env.example` vers `.env.local` et complète-le :

```bash
cp .env.example .env.local
```

- `SESSION_SECRET` et `CRON_SECRET` : génère des chaînes aléatoires avec
  `openssl rand -hex 32`
- `ADMIN_PASSWORD` : le mot de passe de connexion à `/admin`
- `NEXT_PUBLIC_CONTACT_EMAIL` : l'adresse affichée en contact et utilisée pour les demandes
  boutique

## 3. Connecter Instagram (galerie principale)

Le fil Instagram est affiché comme galerie principale sur l'accueil et la galerie publique via
un widget d'intégration (pas d'API Meta à configurer) :

1. Crée un compte sur [Behold.so](https://behold.so) (recommandé, design personnalisable) ou
   [SnapWidget](https://snapwidget.com), connecte ton compte Instagram et crée un widget.
2. Récupère l'identifiant du widget (feed id).
3. Renseigne :
   - `NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER=behold` (ou `snapwidget`)
   - `NEXT_PUBLIC_INSTAGRAM_WIDGET_ID=<identifiant>`

Sans ces variables, le site affiche un espace réservé propre indiquant que le fil n'est pas
encore connecté (le site reste fonctionnel).

## 4. Développement local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Connecte-toi à `/admin` avec le mot de
passe défini dans `ADMIN_PASSWORD`.

## 5. Déployer sur Vercel

1. Importe le dépôt sur [vercel.com/new](https://vercel.com/new).
2. Ajoute toutes les variables de `.env.example` dans **Settings > Environment Variables**.
3. Déploie. Le fichier [`vercel.json`](./vercel.json) active automatiquement un Cron Job
   quotidien (`/api/cron/cleanup`) qui supprime les galeries privées expirées (fichiers +
   métadonnées) — disponible sur le plan Hobby de Vercel.

## Utiliser l'administration (`/admin`)

- **Galeries privées** : crée une galerie (titre, catégorie, durée avant suppression
  automatique configurable par galerie), un code d'accès est généré et affiché **une seule
  fois** — communique-le immédiatement à l'équipe concernée. Ajoute ensuite les photos ; chaque
  membre pourra les consulter et les télécharger (individuellement ou en `.zip`) jusqu'à
  l'expiration.
- **Boutique** : ajoute des produits (visuel, description, prix indicatif). Le bouton
  « Demander » ouvre un e-mail pré-rempli — aucun paiement en ligne géré par le site.
- **Messages** : consulte les demandes envoyées via le formulaire de contact.

## Personnaliser la biographie

Le texte de la page `/biographie` (et l'extrait affiché en accueil) se trouve dans
[`content/biographie.ts`](./content/biographie.ts) — modifie librement les paragraphes, les
informations clés et le portrait (`public/works/...` ou toute autre image placée dans
`public/`).

## Sécurité & RGPD

- Les tables Supabase ont RLS activé sans policy publique : seule la clé `service_role`,
  utilisée uniquement côté serveur, peut y accéder.
- Les codes d'accès aux galeries ne sont jamais stockés en clair (hachage HMAC).
- Les sessions admin et galerie privée utilisent des cookies signés, `httpOnly`, à expiration
  courte.
- La suppression automatique des galeries privées est gérée par le Cron Job quotidien — voir la
  page [Confidentialité](./app/confidentialite/page.tsx) pour le détail exposé aux visiteurs.
