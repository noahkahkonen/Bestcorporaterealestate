# Best Corporate Real Estate – Columbus, Ohio

A modern commercial real estate brokerage website built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. Designed for high-end, corporate aesthetic similar to Newmark/CBRE.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Maps JavaScript API** (listings map with markers and clustering)
- **Vercel**-ready deployment

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Database (PostgreSQL)**

   Create a PostgreSQL database. Options:

   - **[Neon](https://neon.tech)** – Free tier, works with Vercel. Create a project and copy the connection string.
   - **[Supabase](https://supabase.com)** – Free tier. Project Settings → Database → Connection string.
   - **Local Postgres** – Run `postgresql://user:password@localhost:5432/bestcre`.

   Add `DATABASE_URL` to `.env.local`, then run migrations:

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

3. **Environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`. Get a key at [Google Cloud Console](https://developers.google.com/maps/documentation/javascript/get-api-key).

4. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/` – App Router pages and layouts
- `components/` – Reusable UI (Header, Footer, ListingCard, Map, Filters, etc.)
- `data/listings.json` – Listing data (replace with real listings)
- `types/` – TypeScript types
- `lib/` – Utilities (e.g. filter-listings)

## Pages

| Route        | Description                          |
| ------------ | ------------------------------------ |
| `/`          | Home (hero, about, featured listings, news, testimonials) |
| `/listings`  | Listings with Google Map, filters, and grid |
| `/listings/[slug]` | Property detail (gallery, stats, description, CTAs) |
| `/services`  | Service cards (Seller, Landlord, Buyer, Tenant Rep) |
| `/team`      | Team grid (placeholder headshots/bios) |
| `/news`      | News & insights (placeholder articles) |
| `/contact`   | Contact form (submits to `/api/contact`) |

## Listings Data

Edit `data/listings.json` to add or update listings. Each listing includes:

- `id`, `slug`, `title`, `address`, `city`, `state`
- `latitude`, `longitude` (for map markers)
- `propertyType`, `listingType`, `squareFeet`, `acreage`, `features[]`
- `heroImage`, `galleryImages[]`, `description`

Filter options (Property Type, Listing Type, City, Features) are driven by this data.

## Deployment (Vercel)

1. Push the repo to GitHub and import the project in Vercel.
2. Add a **PostgreSQL database** (Vercel Postgres, Neon, or Supabase) and set `DATABASE_URL` in Vercel Environment Variables.
3. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and other required env vars (see `.env.example`).
4. Deploy. Migrations run automatically on build if configured, or run `npx prisma migrate deploy` in a post-deploy script.

## Placeholders

- Logo and hero/skyline images: replace with final assets.
- Team headshots and bios: update in `app/team/page.tsx` and data/cms as needed.
- Contact form: `/api/contact` is a placeholder; wire to your CRM or email service.

## License

Private – Best Corporate Real Estate.
