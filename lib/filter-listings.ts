import type { Listing } from "@/types/listing";
import type { FilterState } from "@/components/listings/ListingsFilters";

function normalize(s: string): string {
  return (s ?? "").trim().toLowerCase();
}

export function filterListings(listings: Listing[], filters: FilterState): Listing[] {
  const propertyType = normalize(filters.propertyType);
  const listingType = normalize(filters.listingType);
  const city = normalize(filters.city);

  return listings.filter((listing) => {
    if (propertyType && normalize(listing.propertyType) !== propertyType) return false;
    if (listingType && normalize(listing.listingType) !== listingType) return false;
    if (city && normalize(listing.city) !== city) return false;
    if (filters.features.length > 0) {
      const hasAll = filters.features.every((f) => listing.features.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });
}
