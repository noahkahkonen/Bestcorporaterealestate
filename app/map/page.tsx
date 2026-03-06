import type { Metadata } from "next";
import { Suspense } from "react";
import { getListings } from "@/lib/listings";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Interactive Map",
  description:
    "Explore commercial real estate listings across Columbus and Central Ohio. Filter by sector: retail, office, industrial, land, multifamily.",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ sector?: string }> };

export default async function MapPage({ searchParams }: Props) {
  const listings = await getListings();
  const params = await searchParams;
  const initialSector = params.sector ?? "";

  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-6rem)] items-center justify-center bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
          Loading map...
        </div>
      }
    >
      <MapPageClient listings={listings} initialSector={initialSector} />
    </Suspense>
  );
}
