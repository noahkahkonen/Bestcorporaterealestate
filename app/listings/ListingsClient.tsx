"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ListingsMap from "@/components/listings/ListingsMap";
import ListingsFilters, {
  getDefaultFilters,
  type FilterState,
} from "@/components/listings/ListingsFilters";
import ListingCard from "@/components/ListingCard";
import { filterListings } from "@/lib/filter-listings";
import type { Listing } from "@/types/listing";

interface ListingsClientProps {
  listings: Listing[];
  initialFilters?: Partial<FilterState>;
}

export default function ListingsClient({ listings, initialFilters }: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilters(),
    ...initialFilters,
  }));
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Sync filters from URL when URL changes (navigation, back/forward, or programmatic)
  useEffect(() => {
    const propertyType = searchParams.get("propertyType") ?? "";
    const listingType = searchParams.get("listingType") ?? "";
    const city = searchParams.get("city") ?? "";
    setFilters((prev) => {
      if (prev.propertyType === propertyType && prev.listingType === listingType && prev.city === city) return prev;
      return {
        ...prev,
        propertyType,
        listingType,
        city,
        ...(propertyType || listingType ? { features: [] } : {}),
      };
    });
  }, [searchParams]);

  const filtered = useMemo(
    () => filterListings(listings, filters),
    [listings, filters]
  );

  // Clear selected listing when it's no longer in filtered results
  useEffect(() => {
    if (selectedListing && !filtered.some((l) => l.id === selectedListing.id)) {
      setSelectedListing(null);
    }
  }, [filtered, selectedListing]);

  function handleFiltersChange(next: FilterState) {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.propertyType) params.set("propertyType", next.propertyType);
    if (next.listingType) params.set("listingType", next.listingType);
    if (next.city) params.set("city", next.city);
    const query = params.toString();
    router.replace(query ? `/listings?${query}` : "/listings", { scroll: false });
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Listings
          </h1>
          <p className="mt-2 text-[var(--charcoal-light)]">
            Explore commercial properties across Columbus and Central Ohio.
          </p>
          <div className="mt-6 pl-1">
            <ListingsFilters
              listings={listings}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="h-[480px] w-full lg:h-[580px] rounded-lg overflow-hidden">
          <ListingsMap
            listings={filtered}
            selectedListing={selectedListing}
            onSelectListing={setSelectedListing}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[var(--charcoal)]">
          Listings {filtered.length > 0 && `(${filtered.length})`}
        </h2>
        {filtered.length === 0 ? (
          <p className="mt-4 text-[var(--charcoal-light)]">
            No listings match your filters. Try adjusting your selection.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
