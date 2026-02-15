import type { Metadata } from "next";
import listingsData from "@/data/listings.json";
import type { Listing } from "@/types/listing";
import ListingsClient from "./ListingsClient";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Commercial real estate listings in Columbus and Central Ohio. Office, retail, industrial, multifamily, and land.",
};

type Props = { searchParams: Promise<{ listingType?: string; propertyType?: string }> };

export default async function ListingsPage({ searchParams }: Props) {
  const listings = listingsData as Listing[];
  const params = await searchParams;
  const initialFilters = {
    listingType: params.listingType ?? "",
    propertyType: params.propertyType ?? "",
    city: "",
    features: [] as string[],
  };

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Listings
          </h1>
          <p className="mt-2 text-[var(--charcoal-light)]">
            Explore commercial properties across Columbus and Central Ohio.
          </p>
        </div>
      </div>
      <ListingsClient listings={listings} initialFilters={initialFilters} />
    </div>
  );
}
