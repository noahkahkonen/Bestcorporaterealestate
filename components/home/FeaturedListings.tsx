"use client";

import { useState } from "react";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/types/listing";

const INITIAL_COUNT = 3;
const EXPAND_COUNT = 2;

interface FeaturedListingsProps {
  listings: Listing[];
}

export default function FeaturedListings({ listings }: FeaturedListingsProps) {
  const [showCount, setShowCount] = useState(INITIAL_COUNT);
  const displayed = listings.slice(0, showCount);
  const hasMore = listings.length > showCount;

  if (listings.length === 0) return null;

  return (
    <section className="relative z-10 border-b border-[var(--border)] bg-[var(--surface-muted)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
              Premium Listings
            </h2>
            <p className="mt-2 text-base text-[var(--charcoal-light)] lg:text-lg">
              Exclusive commercial opportunities selected for performance and potential.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)] transition-all hover:gap-3 hover:underline"
            >
              View on Map
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/listings"
              className="text-sm font-semibold text-[var(--navy)] hover:underline"
            >
              View all listings →
            </Link>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              priority={i < 3}
              showApplyButton={false}
              showSizeBadges={false}
            />
          ))}
        </div>
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowCount((c) => c + EXPAND_COUNT)}
              className="rounded-md border border-[var(--navy)] bg-[var(--surface)] px-6 py-2.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
