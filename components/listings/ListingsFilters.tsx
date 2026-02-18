"use client";

import { useMemo } from "react";
import type { Listing } from "@/types/listing";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/types/listing";

export interface FilterState {
  propertyType: string;
  listingType: string;
  city: string;
  features: string[];
}

const DEFAULT_FILTERS: FilterState = {
  propertyType: "",
  listingType: "",
  city: "",
  features: [],
};

export function getDefaultFilters(): FilterState {
  return { ...DEFAULT_FILTERS };
}

function getCitiesByFrequency(listings: Listing[]): { city: string; count: number }[] {
  const counts: Record<string, number> = {};
  listings.forEach((l) => {
    counts[l.city] = (counts[l.city] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
}

function getAllFeatures(listings: Listing[]): string[] {
  const set = new Set<string>();
  listings.forEach((l) => l.features.forEach((f) => set.add(f)));
  return Array.from(set).sort();
}

interface ListingsFiltersProps {
  listings: Listing[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export default function ListingsFilters({
  listings,
  filters,
  onFiltersChange,
}: ListingsFiltersProps) {
  const citiesByFreq = useMemo(() => getCitiesByFrequency(listings), [listings]);
  const allFeatures = useMemo(() => getAllFeatures(listings), [listings]);

  const update = (partial: Partial<FilterState>) => {
    // When changing property type or listing type, clear features to avoid over-filtering
    const next = { ...filters, ...partial };
    if ("propertyType" in partial || "listingType" in partial) {
      next.features = [];
    }
    onFiltersChange(next);
  };

  const selectedFeature = filters.features[0] ?? "";

  const selectBase =
    "min-h-[48px] min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-4 pr-10 text-base text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]";

  return (
    <div className="flex flex-wrap items-end gap-4 sm:gap-5">
      <div>
            <label htmlFor="property-type" className="mb-2 block text-sm font-medium text-[var(--charcoal-light)]">
              Property Type
            </label>
            <select
              id="property-type"
              value={filters.propertyType}
              onChange={(e) => update({ propertyType: e.target.value })}
              className={selectBase}
            >
              <option value="">All</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
      </div>
      <div>
            <label htmlFor="listing-type" className="mb-2 block text-sm font-medium text-[var(--charcoal-light)]">
              Listing Type
            </label>
            <select
              id="listing-type"
              value={filters.listingType}
              onChange={(e) => update({ listingType: e.target.value })}
              className={selectBase}
            >
              <option value="">All</option>
              {LISTING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
      </div>
      <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium text-[var(--charcoal-light)]">
              City
            </label>
            <select
              id="city"
              value={filters.city}
              onChange={(e) => update({ city: e.target.value })}
              className={selectBase}
            >
              <option value="">All Cities</option>
              {citiesByFreq.map(({ city, count }) => (
                <option key={city} value={city}>
                  {city} ({count})
                </option>
              ))}
            </select>
          </div>
          {allFeatures.length > 0 && (
            <div>
              <label htmlFor="features" className="mb-2 block text-sm font-medium text-[var(--charcoal-light)]">
                Features
              </label>
              <select
                id="features"
                value={selectedFeature}
                onChange={(e) => update({ features: e.target.value ? [e.target.value] : [] })}
                className={selectBase}
              >
                <option value="">All Features</option>
                {allFeatures.map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
            </div>
          )}
    </div>
  );
}
