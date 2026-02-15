"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Listing } from "@/types/listing";
import PropertyTypeTag from "@/components/PropertyTypeTag";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export default function ListingCard({ listing, priority }: ListingCardProps) {
  const [imgError, setImgError] = useState(false);
  const stats = [
    listing.squareFeet && `${(listing.squareFeet / 1000).toFixed(1)}K SF`,
    listing.acreage && `${listing.acreage} Acres`,
    listing.propertyType,
    listing.listingType,
  ].filter(Boolean);
  const showRealImage = listing.heroImage.startsWith("/") && !imgError;

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/listings/${listing.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {showRealImage ? (
            <Image
              src={listing.heroImage}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="placeholder-img absolute inset-0 flex items-center justify-center text-sm font-medium text-[var(--charcoal-light)] transition-transform duration-300 group-hover:scale-105">
              Property Image
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--charcoal-light)] lg:text-sm">
            {listing.listingType} • <PropertyTypeTag propertyType={listing.propertyType} />
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)] lg:text-xl">
            {listing.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--charcoal-light)] lg:text-base">
            {listing.address}, {listing.city}, {listing.state}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.map((s) => (
              <span
                key={s}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-[var(--charcoal)]"
              >
                {s === listing.propertyType ? (
                  <PropertyTypeTag propertyType={listing.propertyType} className="font-medium" />
                ) : (
                  s
                )}
              </span>
            ))}
          </div>
          {listing.features.length > 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              {listing.features.slice(0, 3).join(" • ")}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
