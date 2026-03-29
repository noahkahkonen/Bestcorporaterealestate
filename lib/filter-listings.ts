import type { Listing } from "@/types/listing";
import type { FilterState } from "@/components/listings/ListingsFilters";
import { parseCurrencyInput } from "@/lib/filter-currency";
import { getListingEstimatedMonthlyRent } from "@/lib/listing-estimated-monthly-rent";

function normalize(s: string): string {
  return (s ?? "").trim().toLowerCase();
}

function parseNonNegInt(s: string): number | null {
  const t = (s ?? "").trim();
  if (!t) return null;
  const n = parseInt(t, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseNonNegNumber(s: string): number | null {
  const t = (s ?? "").trim();
  if (!t) return null;
  const n = parseFloat(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function filterListings(listings: Listing[], filters: FilterState): Listing[] {
  const propertyType = normalize(filters.propertyType);
  const listingType = normalize(filters.listingType);
  const city = normalize(filters.city);
  const minPrice = parseCurrencyInput(filters.minPrice);
  const maxPrice = parseCurrencyInput(filters.maxPrice);
  const minRent = parseCurrencyInput(filters.minRent);
  const maxRent = parseCurrencyInput(filters.maxRent);
  const minSqFt = parseNonNegInt(filters.minSqFt);
  const maxSqFt = parseNonNegInt(filters.maxSqFt);
  const minAcres = parseNonNegNumber(filters.minAcres);
  const maxAcres = parseNonNegNumber(filters.maxAcres);

  return listings.filter((listing) => {
    if (propertyType && normalize(listing.propertyType) !== propertyType) return false;
    if (listingType && normalize(listing.listingType) !== listingType) return false;
    if (city && normalize(listing.city) !== city) return false;
    if (minPrice != null) {
      if (listing.price == null || listing.price < minPrice) return false;
    }
    if (maxPrice != null) {
      if (listing.price == null || listing.price > maxPrice) return false;
    }
    if (minRent != null) {
      const r = getListingEstimatedMonthlyRent(listing);
      if (r == null || r < minRent) return false;
    }
    if (maxRent != null) {
      const r = getListingEstimatedMonthlyRent(listing);
      if (r == null || r > maxRent) return false;
    }
    if (minSqFt != null) {
      if (listing.squareFeet == null || listing.squareFeet < minSqFt) return false;
    }
    if (maxSqFt != null) {
      if (listing.squareFeet == null || listing.squareFeet > maxSqFt) return false;
    }
    if (minAcres != null) {
      if (listing.acreage == null || listing.acreage < minAcres) return false;
    }
    if (maxAcres != null) {
      if (listing.acreage == null || listing.acreage > maxAcres) return false;
    }
    if (filters.features.length > 0) {
      const hasAll = filters.features.every((f) => listing.features.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });
}
