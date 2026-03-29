import type { Listing } from "@/types/listing";

export type ListingSpecTrioItem = {
  label: string;
  value: string;
  /** Renders legal disclaimer control next to label (NNN charges). */
  nnnChargesInfo?: boolean;
};

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
  if (listing.capRatePricingCall) return null;
  const m = listing.investmentMetrics?.capRate ?? listing.capRate;
  return m != null && !Number.isNaN(m) ? m : null;
}

function formatCapRate(listing: Listing): string {
  if (listing.capRatePricingCall) return "Call";
  const cr = capRateDecimal(listing);
  if (cr == null) return "—";
  return `${(cr * 100).toFixed(1)}%`;
}

function showCapRateInSaleSpecs(listing: Listing): boolean {
  return capRateDecimal(listing) != null || listing.capRatePricingCall === true;
}

function formatNnn(listing: Listing): string {
  if (listing.leaseNnnCharges != null) {
    return `$${Number(listing.leaseNnnCharges).toLocaleString()}/SF`;
  }
  return "—";
}

function zoningValue(listing: Listing): string {
  const z = listing.zoning?.trim() || getZoningFromFeatures(listing.features);
  if (!z) return "—";
  return z;
}

/** Adds a Zoning column when admin/DB (or features) has a value but the trio above omitted it (e.g. lease, investment). */
function appendZoningIfMissing(specs: ListingSpecTrioItem[], listing: Listing): ListingSpecTrioItem[] {
  const z = zoningValue(listing);
  if (z === "—") return specs;
  if (specs.some((s) => s.label === "Zoning")) return specs;
  return [...specs, { label: "Zoning", value: z }];
}

/**
 * Three headline stats for listing cards / detail specs, by listing type and occupancy.
 */
export function getListingSpecTrio(listing: Listing): ListingSpecTrioItem[] {
  const occ = (listing.occupancy ?? "").trim();
  const isLand = listing.propertyType === "Land";
  const isForLeaseOnly = listing.listingType === "For Lease";
  const isForSale = listing.listingType === "For Sale" || listing.listingType === "Sale/Lease";

  let specs: ListingSpecTrioItem[];

  if (isLand) {
    const sub = listing.landSubcategory?.trim() || "—";
    specs = [
      { label: "Acres", value: formatAcres(listing) },
      { label: "Zoning", value: zoningValue(listing) },
      { label: "Type", value: sub },
    ];
    return specs;
  }

  if (isForLeaseOnly) {
    return appendZoningIfMissing(
      [
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Occupancy", value: dash(listing.occupancy) },
        { label: "NNN charges", value: formatNnn(listing), nnnChargesInfo: true },
      ],
      listing,
    );
  }

  if (isForSale) {
    if (occ === "Owner User") {
      specs = [
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
        { label: "Zoning", value: zoningValue(listing) },
      ];
      return specs;
    }
    if (occ === "Investment" || occ === "Owner User/Investment") {
      specs = [
        { label: "Cap Rate", value: formatCapRate(listing) },
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
      ];
      return appendZoningIfMissing(specs, listing);
    }
    if (showCapRateInSaleSpecs(listing)) {
      specs = [
        { label: "Cap Rate", value: formatCapRate(listing) },
        { label: "Sq Ft", value: formatSqFt(listing) },
        { label: "Acres", value: formatAcres(listing) },
      ];
      return appendZoningIfMissing(specs, listing);
    }
    specs = [
      { label: "Sq Ft", value: formatSqFt(listing) },
      { label: "Acres", value: formatAcres(listing) },
      { label: "Zoning", value: zoningValue(listing) },
    ];
    return specs;
  }

  specs = [
    { label: "Sq Ft", value: formatSqFt(listing) },
    { label: "Acres", value: formatAcres(listing) },
    { label: "Occupancy", value: dash(listing.occupancy) },
  ];
  return appendZoningIfMissing(specs, listing);
}
