import type { Metadata } from "next";
import { Suspense } from "react";
import { getListings } from "@/lib/listings";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Explore commercial real estate listings across Columbus and Central Ohio on the map. Filter by sector: retail, office, industrial, land, multifamily.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    sector?: string;
    listingType?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    minRent?: string;
    maxRent?: string;
    minSqFt?: string;
    maxSqFt?: string;
    minAcres?: string;
    maxAcres?: string;
  }>;
};

export default async function MapPage({ searchParams }: Props) {
  const listings = await getListings();
  const params = await searchParams;
  const initialSector = params.sector ?? "";
  const initialListingType = params.listingType ?? "";
  const initialCity = params.city ?? "";

  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-4.25rem-12px)] min-h-[320px] items-center justify-center bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
          Loading map...
        </div>
      }
    >
      <MapPageClient
        listings={listings}
        initialSector={initialSector}
        initialListingType={initialListingType}
        initialCity={initialCity}
        initialMinPrice={params.minPrice ?? ""}
        initialMaxPrice={params.maxPrice ?? ""}
        initialMinRent={params.minRent ?? ""}
        initialMaxRent={params.maxRent ?? ""}
        initialMinSqFt={params.minSqFt ?? ""}
        initialMaxSqFt={params.maxSqFt ?? ""}
        initialMinAcres={params.minAcres ?? ""}
        initialMaxAcres={params.maxAcres ?? ""}
      />
    </Suspense>
  );
}
