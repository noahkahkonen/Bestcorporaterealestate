"use client";

import { useState } from "react";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import listingsData from "@/data/listings.json";
import type { Listing } from "@/types/listing";

const INITIAL_COUNT = 3;
const EXPAND_COUNT = 2;

export default function FeaturedListings() {
  const listings = listingsData as Listing[];
  const [showCount, setShowCount] = useState(INITIAL_COUNT);
  const displayed = listings.slice(0, showCount);
  const hasMore = listings.length > showCount;

  return (
    <section className="border-b border-[var(--border)] bg-gray-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-2 text-base text-[var(--charcoal-light)] lg:text-lg">
              Select opportunities across Columbus and Central Ohio.
            </p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-[var(--navy)] hover:underline"
          >
            View all listings →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              priority={i < 3}
            />
          ))}
        </div>
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowCount((c) => c + EXPAND_COUNT)}
              className="rounded-md border border-[var(--navy)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
