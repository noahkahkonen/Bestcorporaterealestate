"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Listing } from "@/types/listing";
import PropertyTypeTag from "@/components/PropertyTypeTag";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
  showApplyButton?: boolean;
}

export default function ListingCard({ listing, priority, showApplyButton = true }: ListingCardProps) {
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

  const priceBlocks = [salePriceDisplay, leaseDisplay].filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/listings/${listing.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--surface-muted)]">
          {showRealImage ? (
            <Image
              src={listing.heroImage}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              quality={90}
              priority={priority}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="placeholder-img absolute inset-0 flex items-center justify-center text-sm font-medium text-[var(--charcoal-light)] transition-transform duration-300 group-hover:scale-105">
              Property Image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {listing.status && listing.status !== "Active" && (
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    listing.status === "Sold"
                      ? "bg-[var(--navy)]/15 text-[var(--navy)]"
                      : listing.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-[var(--surface-muted)] text-[var(--charcoal-light)]"
                  }`}
                >
                  {listing.status}
                </span>
              )}
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--charcoal-light)] lg:text-sm">
              {listing.listingType} •{" "}
              {listing.propertyType === "Land" && listing.landSubcategory ? (
                <>
                  <PropertyTypeTag propertyType={listing.propertyType} />
                  <span className="mx-1" />
                  <PropertyTypeTag propertyType={listing.landSubcategory} />
                </>
              ) : (
                <PropertyTypeTag propertyType={listing.propertyType} />
              )}
              </p>
            </div>
            {priceBlocks.length > 0 && (
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                {priceBlocks.map((p, i) => (
                  <span key={i} className="text-sm font-semibold text-[var(--charcoal)] whitespace-nowrap">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h2 className="mt-1 text-lg font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)] lg:text-xl">
            {listing.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--charcoal-light)] lg:text-base">
            {listing.address}, {listing.city}, {listing.state}
            {listing.zipCode && ` ${listing.zipCode}`}
          </p>
          {stats.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {stats.map((s) => (
                <span
                  key={s}
                  className="rounded bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-medium text-[var(--charcoal)]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          {listing.features.length > 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              {listing.features.slice(0, 3).join(" • ")}
            </p>
          )}
        </div>
      </Link>
      {showApplyButton && isForLease && (
        <div className="border-t border-[var(--border)] px-4 py-3 sm:px-5">
          <Link
            href={`/listings/${listing.slug}/apply`}
            className="flex w-full items-center justify-center rounded-md bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Apply Now
          </Link>
        </div>
      )}
    </article>
  );
}
