import { redirect } from "next/navigation";
import { propertyTypeToMapSector } from "@/lib/property-type-to-map-sector";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ listingType?: string; propertyType?: string; city?: string }> };

/** Listings route opens the interactive map (same as /map). */
export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const sector = params.propertyType ? propertyTypeToMapSector(params.propertyType) : null;
  if (sector) qs.set("sector", sector);
  if (params.listingType) qs.set("listingType", params.listingType);
  if (params.city) qs.set("city", params.city);
  const query = qs.toString();
  redirect(query ? `/map?${query}` : "/map");
}
