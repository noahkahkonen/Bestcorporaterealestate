import type { Listing } from "@/types/listing";
import type { FilterState } from "@/components/listings/ListingsFilters";

export function filterListings(listings: Listing[], filters: FilterState): Listing[] {
  return listings.filter((listing) => {
    if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
    if (filters.listingType && listing.listingType !== filters.listingType) return false;
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.features.length > 0) {
      const hasAll = filters.features.every((f) => listing.features.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });
}
