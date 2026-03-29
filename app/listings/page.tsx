import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    listingType?: string;
    propertyType?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    minRent?: string;
    maxRent?: string;
    minSqFt?: string;
    maxSqFt?: string;
    minAcres?: string;
    maxAcres?: string;
  }>;
};

/** Listings route opens the interactive map with the same filters (/map?sector= matches listing propertyType). */
export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const pt = params.propertyType?.trim();
  if (pt) qs.set("sector", pt.toLowerCase());
  if (params.listingType) qs.set("listingType", params.listingType);
  if (params.city) qs.set("city", params.city);
  if (params.minPrice) qs.set("minPrice", params.minPrice);
  if (params.maxPrice) qs.set("maxPrice", params.maxPrice);
  if (params.minRent) qs.set("minRent", params.minRent);
  if (params.maxRent) qs.set("maxRent", params.maxRent);
  if (params.minSqFt) qs.set("minSqFt", params.minSqFt);
  if (params.maxSqFt) qs.set("maxSqFt", params.maxSqFt);
  if (params.minAcres) qs.set("minAcres", params.minAcres);
  if (params.maxAcres) qs.set("maxAcres", params.maxAcres);
  const query = qs.toString();
  redirect(query ? `/map?${query}` : "/map");
}
