import type { Listing } from "@/types/listing";

/**
 * Same formula as MonthlyRentCalculator: (base $/SF/yr + NNN $/SF/yr when applicable) × SF ÷ 12.
 */
export function getListingEstimatedMonthlyRent(listing: Listing): number | null {
  const sqft = listing.squareFeet;
  if (sqft == null || sqft <= 0) return null;
  const base = listing.leasePricePerSf;
  if (base == null || !(base > 0)) return null;
  const cam = listing.leaseType === "NNN" ? (listing.leaseNnnCharges ?? 0) : 0;
  return ((base + cam) * sqft) / 12;
}
