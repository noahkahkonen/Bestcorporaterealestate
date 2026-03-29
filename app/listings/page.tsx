import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ listingType?: string; propertyType?: string; city?: string }> };

/** Listings route opens the interactive map with the same filters (/map?sector= matches listing propertyType). */
export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const pt = params.propertyType?.trim();
  if (pt) qs.set("sector", pt.toLowerCase());
  if (params.listingType) qs.set("listingType", params.listingType);
  if (params.city) qs.set("city", params.city);
  const query = qs.toString();
  redirect(query ? `/map?${query}` : "/map");
}
