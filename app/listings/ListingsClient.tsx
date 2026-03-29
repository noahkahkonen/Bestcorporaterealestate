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
  // Sync filters from URL when URL changes (navigation, back/forward, or programmatic)
  useEffect(() => {
    const propertyType = searchParams.get("propertyType") ?? "";
    const listingType = searchParams.get("listingType") ?? "";
    const city = searchParams.get("city") ?? "";
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const minRent = searchParams.get("minRent") ?? "";
    const maxRent = searchParams.get("maxRent") ?? "";
    const minSqFt = searchParams.get("minSqFt") ?? "";
    const maxSqFt = searchParams.get("maxSqFt") ?? "";
    const minAcres = searchParams.get("minAcres") ?? "";
    const maxAcres = searchParams.get("maxAcres") ?? "";
    setFilters((prev) => {
      if (
        prev.propertyType === propertyType &&
        prev.listingType === listingType &&
        prev.city === city &&
        prev.minPrice === minPrice &&
        prev.maxPrice === maxPrice &&
        prev.minRent === minRent &&
        prev.maxRent === maxRent &&
        prev.minSqFt === minSqFt &&
        prev.maxSqFt === maxSqFt &&
        prev.minAcres === minAcres &&
        prev.maxAcres === maxAcres
      ) {
        return prev;
      }
      return {
        ...prev,
        propertyType,
        listingType,
        city,
        minPrice,
        maxPrice,
        minRent,
        maxRent,
        minSqFt,
        maxSqFt,
        minAcres,
        maxAcres,
        ...(propertyType || listingType ? { features: [] } : {}),
      };
    });
  }, [searchParams]);

  const filtered = useMemo(
    () => filterListings(listings, filters),
    [listings, filters]
  );

  function handleFiltersChange(next: FilterState) {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.propertyType) params.set("propertyType", next.propertyType);
    if (next.listingType) params.set("listingType", next.listingType);
    if (next.city) params.set("city", next.city);
    if (next.minPrice.trim()) params.set("minPrice", next.minPrice.trim());
    if (next.maxPrice.trim()) params.set("maxPrice", next.maxPrice.trim());
    if (next.minRent.trim()) params.set("minRent", next.minRent.trim());
    if (next.maxRent.trim()) params.set("maxRent", next.maxRent.trim());
    if (next.minSqFt.trim()) params.set("minSqFt", next.minSqFt.trim());
    if (next.maxSqFt.trim()) params.set("maxSqFt", next.maxSqFt.trim());
    if (next.minAcres.trim()) params.set("minAcres", next.minAcres.trim());
    if (next.maxAcres.trim()) params.set("maxAcres", next.maxAcres.trim());
    const query = params.toString();
    router.replace(query ? `/listings?${query}` : "/listings", { scroll: false });
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
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
      {filters.propertyType !== "Business" && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="h-[480px] w-full lg:h-[580px] rounded-lg overflow-hidden">
            <ListingsMap listings={filtered} onSelectListing={() => {}} />
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-[var(--charcoal)]">
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
