"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Listing } from "@/types/listing";
interface FeaturedListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export default function FeaturedListingCard({ listing, priority }: FeaturedListingCardProps) {
  const [imgError, setImgError] = useState(false);
  const stats = [
    listing.squareFeet && `${(listing.squareFeet / 1000).toFixed(1)}K SF`,
    listing.acreage && `${listing.acreage} Acres`,
  ].filter(Boolean);
  const showRealImage = listing.heroImage.startsWith("/") && !imgError;
  const isForLease = listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";

  const salePriceDisplay =
    (listing.price != null || listing.investmentMetrics?.price != null || listing.priceNegotiable) &&
    (listing.listingType === "For Sale" || listing.listingType === "Sale/Lease")
      ? listing.priceNegotiable ? "Negotiable" : `$${(listing.price ?? listing.investmentMetrics?.price ?? 0).toLocaleString()}`
      : null;

  const leaseDisplay =
    isForLease && listing.leasePricePerSf != null && listing.leaseType
      ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
      : null;

  const priceDisplay = salePriceDisplay || leaseDisplay;

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-lg hover:border-[var(--navy)]/30"
    >
      {/* Image with overlay strip */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
        {showRealImage ? (
          <Image
            src={listing.heroImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            quality={90}
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="placeholder-img absolute inset-0 flex items-center justify-center text-sm font-medium text-[var(--charcoal-light)]">
            Property Image
          </div>
        )}
        {/* Info strip overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white">
            <span>{listing.listingType}</span>
            <span className="opacity-70">•</span>
            {listing.propertyType === "Land" && listing.landSubcategory ? (
              <>
                <span>{listing.propertyType}</span>
                <span className="opacity-70">–</span>
                <span>{listing.landSubcategory}</span>
              </>
            ) : (
              <span>{listing.propertyType}</span>
            )}
            {priceDisplay && (
              <>
                <span className="opacity-70">•</span>
                <span className="font-semibold">{priceDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h2 className="text-lg font-bold text-[var(--charcoal)] transition-colors group-hover:text-[var(--navy)] sm:text-xl">
          {listing.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--charcoal-light)]">
          {listing.address}, {listing.city}, {listing.state}
          {listing.zipCode && ` ${listing.zipCode}`}
        </p>
        {(stats.length > 0 || listing.features.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.map((s) => (
              <span
                key={s}
                className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-medium text-[var(--charcoal)]"
              >
                {s}
              </span>
            ))}
            {listing.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
