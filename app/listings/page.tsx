import type { Metadata } from "next";
import { Suspense } from "react";
import { getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";
import type { Listing } from "@/types/listing";
import ListingsClient from "./ListingsClient";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Commercial real estate listings in Columbus and Central Ohio. Office, retail, industrial, multifamily, and land.",
};

type Props = { searchParams: Promise<{ listingType?: string; propertyType?: string; city?: string }> };

export default async function ListingsPage({ searchParams }: Props) {
  const listings = await getListings();
  const params = await searchParams;
  const initialFilters = {
    listingType: params.listingType ?? "",
    propertyType: params.propertyType ?? "",
    city: params.city ?? "",
    features: [] as string[],
  };

  return (
    <div className="pb-16">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-[var(--charcoal-light)]">Loading...</div>}>
        <ListingsClient listings={listings} initialFilters={initialFilters} />
      </Suspense>
    </div>
  );
}
