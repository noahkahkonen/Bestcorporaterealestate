import { prisma } from "@/lib/prisma";
import type { Listing } from "@/types/listing";
import listingsFallback from "@/data/listings.json";

/** Returns "Sold" or "Leased" based on listing type and transaction outcome. */
export function getSoldLeasedLabel(listing: { listingType: string; transactionOutcome?: string | null }): string {
  if (listing.listingType === "For Lease") return "Leased";
  if (listing.listingType === "For Sale") return "Sold";
  if (listing.listingType === "Sale/Lease") return listing.transactionOutcome === "Leased" ? "Leased" : "Sold";
  return "Sold";
}

export async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const rows = await prisma.listing.findMany({
      where: { published: true, featured: true, status: { not: "Sold" } },
      orderBy: { createdAt: "desc" },
      include: { brokers: { include: { agent: true } } },
    });
    return rows.map(dbToListing);
  } catch (err) {
    console.error("getFeaturedListings error:", err);
    return [];
  }
}

export async function getListings(): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: { published: true, status: { not: "Sold" } },
    orderBy: { createdAt: "desc" },
    include: { brokers: { include: { agent: true } } },
  });

  if (rows.length === 0) {
    return listingsFallback as Listing[];
  }

  return rows.map(dbToListing);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const row = await prisma.listing.findFirst({
    where: { slug, published: true },
    include: { brokers: { include: { agent: true } } },
  });
  if (!row) return null;
  return dbToListing(row);
}

export async function getSoldListings(): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: { published: true, status: "Sold" },
    orderBy: [{ soldDate: "desc" }, { createdAt: "desc" }],
    include: { brokers: { include: { agent: true } } },
  });
  return rows.map(dbToListing);
}

export async function getSoldListingBySlug(slug: string): Promise<Listing | null> {
  const row = await prisma.listing.findFirst({
    where: { slug, published: true, status: "Sold" },
    include: { brokers: { include: { agent: true } } },
  });
  if (!row) return null;
  return dbToListing(row);
}

function dbToListing(row: {
  id: string;
  featured?: boolean;
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  latitude: number;
  longitude: number;
  listingType: string;
  propertyType: string;
  landSubcategory?: string | null;
  squareFeet: number | null;
  acreage: number | null;
  description: string;
  featuresJson: string;
  heroImage: string | null;
  galleryImagesJson: string | null;
  brochure: string | null;
  financialDocPath?: string | null;
  youtubeLink: string | null;
  noi: number | null;
  price: number | null;
  priceNegotiable?: boolean;
  occupancy?: string | null;
  leaseType: string | null;
  leasePricePerSf: number | null;
  leaseNnnCharges: number | null;
  capRate: number | null;
  status?: string;
  transactionOutcome?: string | null;
  soldPrice?: number | null;
  soldDate?: Date | null;
  soldNotes?: string | null;
  brokers?: Array<{ agent: { id: string; name: string; title: string | null; email: string; phone: string | null; ext: string | null; credentials: string | null; headshot: string | null } }>;
}): Listing {
  const features: string[] = [];
  try {
    const parsed = JSON.parse(row.featuresJson);
    if (Array.isArray(parsed)) features.push(...parsed);
  } catch {
    // ignore
  }

  const galleryImages: string[] = [];
  try {
    if (row.galleryImagesJson) {
      const parsed = JSON.parse(row.galleryImagesJson);
      if (Array.isArray(parsed)) galleryImages.push(...parsed);
    }
  } catch {
    // ignore
  }

  const heroImage = row.heroImage || "/images/placeholders/listing-6.jpg";
  const rawLat = row.latitude;
  const rawLng = row.longitude;
  const invalidCoord =
    rawLat == null || rawLng == null ||
    Number.isNaN(rawLat) || Number.isNaN(rawLng) ||
    (rawLat === 0 && rawLng === 0);
  const latitude = invalidCoord ? 39.9612 : rawLat;
  const longitude = invalidCoord ? -83.0007 : rawLng;
  const listing: Listing = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    address: row.address,
    city: row.city,
    state: row.state,
    zipCode: row.zipCode ?? undefined,
    latitude,
    longitude,
    propertyType: row.propertyType,
    landSubcategory: row.landSubcategory ?? undefined,
    listingType: row.listingType,
    price: row.price ?? undefined,
    priceNegotiable: row.priceNegotiable,
    noi: row.noi ?? undefined,
    leaseType: row.leaseType ?? undefined,
    leasePricePerSf: row.leasePricePerSf ?? undefined,
    leaseNnnCharges: row.leaseNnnCharges ?? undefined,
    occupancy: row.occupancy ?? undefined,
    squareFeet: row.squareFeet,
    acreage: row.acreage,
    features,
    heroImage,
    galleryImages: galleryImages.length ? galleryImages : [heroImage],
    youtubeLink: row.youtubeLink ?? undefined,
    brochure: row.brochure ?? undefined,
    financialDocPath: row.financialDocPath ?? undefined,
    description: row.description,
    status: (row.status === "Pending" || row.status === "Sold" ? row.status : "Active") as Listing["status"],
    transactionOutcome: row.transactionOutcome === "Sold" || row.transactionOutcome === "Leased" ? row.transactionOutcome : undefined,
    soldPrice: row.soldPrice ?? undefined,
    soldDate: row.soldDate ? row.soldDate.toISOString().slice(0, 10) : undefined,
    soldNotes: row.soldNotes ?? undefined,
  };

  if (row.noi != null && row.price != null && row.capRate != null) {
    listing.investmentMetrics = {
      noi: row.noi,
      price: row.price,
      capRate: row.capRate,
    };
  }

  if (row.brokers && row.brokers.length > 0) {
    listing.brokers = row.brokers.map(({ agent }) => ({
      id: agent.id,
      name: agent.name,
      title: agent.title,
      email: agent.email,
      phone: agent.phone,
      ext: agent.ext,
      credentials: agent.credentials,
      headshot: agent.headshot,
    }));
  }

  return listing;
}
