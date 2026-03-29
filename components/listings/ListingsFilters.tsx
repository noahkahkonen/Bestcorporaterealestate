"use client";

import { useMemo } from "react";
import type { Listing } from "@/types/listing";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/types/listing";

export interface FilterState {
  propertyType: string;
  listingType: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minRent: string;
  maxRent: string;
  minSqFt: string;
  maxSqFt: string;
  minAcres: string;
  maxAcres: string;
  features: string[];
}

const DEFAULT_FILTERS: FilterState = {
  propertyType: "",
  listingType: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  minRent: "",
  maxRent: "",
  minSqFt: "",
  maxSqFt: "",
  minAcres: "",
  maxAcres: "",
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
    const next = { ...filters, ...partial };
    if ("propertyType" in partial || "listingType" in partial) {
      next.features = [];
    }
    onFiltersChange(next);
  };

  const selectedFeature = filters.features[0] ?? "";

  const selectBase =
    "min-h-[40px] min-w-[140px] max-w-[220px] rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-3 pr-8 text-sm text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";
  const labelClass = "mb-1.5 block text-xs font-medium text-[var(--charcoal-light)]";
  const noSpin =
    "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const numberClass =
    `min-h-[40px] w-full min-w-[100px] max-w-[140px] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm tabular-nums text-[var(--charcoal)] placeholder:text-[var(--charcoal-light)]/45 focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)] ${noSpin}`;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        <div>
          <label htmlFor="property-type" className={labelClass}>
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
          <label htmlFor="listing-type" className={labelClass}>
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
          <label htmlFor="city" className={labelClass}>
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
            <label htmlFor="features" className={labelClass}>
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
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--charcoal-light)]">List price ($)</p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
              className={numberClass}
              aria-label="Minimum list price"
            />
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
              className={numberClass}
              aria-label="Maximum list price"
            />
          </div>
        </div>
        <div title="Estimated monthly rent (same formula as listing calculator)">
          <p className="mb-2 text-xs font-medium text-[var(--charcoal-light)]">Est. monthly rent ($)</p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Min"
              value={filters.minRent}
              onChange={(e) => update({ minRent: e.target.value })}
              className={numberClass}
              aria-label="Minimum estimated monthly rent"
            />
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Max"
              value={filters.maxRent}
              onChange={(e) => update({ maxRent: e.target.value })}
              className={numberClass}
              aria-label="Maximum estimated monthly rent"
            />
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-[var(--charcoal-light)]">Size</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-[var(--charcoal-light)]">Sq ft</span>
            <input
              id="min-sqft"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              value={filters.minSqFt}
              onChange={(e) => update({ minSqFt: e.target.value })}
              className={numberClass}
              aria-label="Minimum square feet"
            />
            <input
              id="max-sqft"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxSqFt}
              onChange={(e) => update({ maxSqFt: e.target.value })}
              className={numberClass}
              aria-label="Maximum square feet"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-[var(--charcoal-light)]">Acres</span>
            <input
              id="min-acres"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="Min"
              value={filters.minAcres}
              onChange={(e) => update({ minAcres: e.target.value })}
              className={numberClass}
              aria-label="Minimum acres"
            />
            <input
              id="max-acres"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="Max"
              value={filters.maxAcres}
              onChange={(e) => update({ maxAcres: e.target.value })}
              className={numberClass}
              aria-label="Maximum acres"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
