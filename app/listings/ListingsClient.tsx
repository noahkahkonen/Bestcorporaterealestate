"use client";

import { useMemo, useState } from "react";
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
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilters(),
    ...initialFilters,
  }));
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const filtered = useMemo(
    () => filterListings(listings, filters),
    [listings, filters]
  );

  return (
    <div className="flex flex-col">
      <div className="h-[420px] w-full lg:h-[500px]">
        <ListingsMap
          listings={filtered}
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
        />
      </div>
      <ListingsFilters
        listings={listings}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
