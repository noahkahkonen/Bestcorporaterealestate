import type { Listing } from "@/types/listing";

/** Price / lease line for cards, map, and listing detail (matches map sidebar logic). */
export function formatListingDisplayPrice(listing: Listing): string | null {
  if (listing.priceNegotiable) return "Contact for pricing";

  const isForLease =
    listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  if (isForLease && listing.leasePricePerSf != null && listing.leaseType) {
    return `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`;
  }
  if (listing.price != null) return `$${listing.price.toLocaleString()}`;
  if (listing.investmentMetrics?.price != null) {
    return `$${listing.investmentMetrics.price.toLocaleString()}`;
  }
  return null;
}
