import type { Listing } from "@/types/listing";

/** Pull a human zoning value from free-form feature bullets (e.g. "Zoning: C-3"). */
export function getZoningFromFeatures(features: string[]): string | null {
  for (const raw of features) {
    const f = raw.trim();
    const colon = /^zoning\s*[:]\s*(.+)$/i.exec(f);
    if (colon) return colon[1].trim();
    const dash = /^zoning\s*[-–]\s*(.+)$/i.exec(f);
    if (dash) return dash[1].trim();
    const loose = /zoning\s*[:]\s*([^,]+)/i.exec(f);
    if (loose) return loose[1].trim();
  }
  return null;
}

function dash(v: string | null | undefined): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function formatSqFt(listing: Listing): string {
  if (listing.squareFeet == null) return "—";
  return listing.squareFeet.toLocaleString();
}

function formatAcres(listing: Listing): string {
  if (listing.acreage == null) return "—";
  return `${listing.acreage} AC`;
}

function capRateDecimal(listing: Listing): number | null {
  const m = listing.investmentMetrics?.capRate ?? listing.capRate;
  return m != null && !Number.isNaN(m) ? m : null;
}

function formatCapRate(listing: Listing): string {
  const cr = capRateDecimal(listing);
  if (cr == null) return "—";
  return `${(cr * 100).toFixed(1)}%`;
}

function formatNnn(listing: Listing): string {
  if (listing.leaseNnnCharges != null) {
    return `$${Number(listing.leaseNnnCharges).toLocaleString()}/SF`;
  }
  return "—";
}

/**
 * Three headline stats for listing cards / detail specs, by listing type and occupancy.
 */
export function getListingSpecTrio(listing: Listing): { label: string; value: string }[] {
  const occ = (listing.occupancy ?? "").trim();
  const isLand = listing.propertyType === "Land";
  const isForLeaseOnly = listing.listingType === "For Lease";
  const isForSale = listing.listingType === "For Sale" || listing.listingType === "Sale/Lease";
  const zoning = getZoningFromFeatures(listing.features);

  if (isLand) {
    const sub = listing.landSubcategory?.trim() || "—";
    return [
      { label: "Acres", value: formatAcres(listing) },
      { label: "Zoning", value: zoning ?? "—" },
      { label: "Land subcategory", value: sub },
    ];
  }

  if (isForLeaseOnly) {
    return [
      { label: "Sq Ft", value: formatSqFt(listing) },
      { label: "Occupancy", value: dash(listing.occupancy) },
      { label: "NNN charges", value: formatNnn(listing) },
    ];
  }

  if (isForSale) {
    if (occ === "Owner User") {
      return [
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
        { label: "Zoning", value: zoning ?? "—" },
      ];
    }
    if (occ === "Investment" || occ === "Owner User/Investment") {
      return [
        { label: "Cap Rate", value: formatCapRate(listing) },
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
      ];
    }
    if (capRateDecimal(listing) != null) {
      return [
        { label: "Cap Rate", value: formatCapRate(listing) },
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
      ];
    }
    return [
      { label: "Sq Ft", value: formatSqFt(listing) },
      { label: "Acres", value: formatAcres(listing) },
      { label: "Zoning", value: zoning ?? "—" },
    ];
  }

  return [
    { label: "Sq Ft", value: formatSqFt(listing) },
    { label: "Acres", value: formatAcres(listing) },
    { label: "Occupancy", value: dash(listing.occupancy) },
  ];
}
