"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Listing } from "@/types/listing";
import PropertyTypeTag from "@/components/PropertyTypeTag";
import { getSoldLeasedLabel } from "@/lib/listings";
import { formatListingDisplayPrice } from "@/lib/format-listing-display-price";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
  showApplyButton?: boolean;
  /** When false, hides SF / acreage badges (e.g. homepage Featured Listings). */
  showSizeBadges?: boolean;
  /** Show list / lease price in card body (e.g. homepage featured). */
  showPrice?: boolean;
  /** Larger price typography (e.g. featured listings). */
  emphasizePriceOnMobile?: boolean;
}

export default function ListingCard({
  listing,
  priority,
  showApplyButton = true,
  showSizeBadges = true,
  showPrice = false,
  emphasizePriceOnMobile = false,
}: ListingCardProps) {
  const [imgError, setImgError] = useState(false);
  const priceLine = formatListingDisplayPrice(listing);
  const stats = [
    listing.squareFeet && `${(listing.squareFeet / 1000).toFixed(1)}K SF`,
    listing.acreage && `${listing.acreage} Acreage`,
  ].filter(Boolean);
  const showRealImage = (listing.heroImage.startsWith("/") || listing.heroImage.startsWith("https://")) && !imgError;
  const isForLease = listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/listings/${listing.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[2.35/1] max-sm:min-h-0 shrink-0 overflow-hidden bg-[var(--surface-muted)] sm:aspect-[4/3]">
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
          {showPrice ? (
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-left">
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
                    {listing.status === "Sold" ? getSoldLeasedLabel(listing) : listing.status}
                  </span>
                )}
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--charcoal-light)] lg:text-sm">
                  {listing.listingType}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex max-w-[min(100%,12rem)] flex-wrap items-center justify-end gap-x-1 sm:max-w-none">
                  {listing.propertyType === "Land" && listing.landSubcategory ? (
                    <>
                      <PropertyTypeTag propertyType={listing.propertyType} />
                      <PropertyTypeTag propertyType={listing.landSubcategory} />
                    </>
                  ) : (
                    <PropertyTypeTag propertyType={listing.propertyType} />
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
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
                    {listing.status === "Sold" ? getSoldLeasedLabel(listing) : listing.status}
                  </span>
                )}
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--charcoal-light)] lg:text-sm">
                  {listing.listingType}
                </span>
              </div>
              <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--charcoal-light)] lg:text-sm">
                {listing.propertyType === "Land" && listing.landSubcategory ? (
                  <>
                    <PropertyTypeTag propertyType={listing.propertyType} />
                    <span className="mx-1" />
                    <PropertyTypeTag propertyType={listing.landSubcategory} />
                  </>
                ) : (
                  <PropertyTypeTag propertyType={listing.propertyType} />
                )}
              </span>
            </div>
          )}
          <div
            className={`text-left ${showPrice && priceLine ? "mt-4" : "mt-1"}`}
          >
            {showPrice && priceLine ? (
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 flex-1 text-lg font-semibold leading-snug text-[var(--charcoal)] group-hover:text-[var(--navy)] lg:text-xl">
                  {listing.title}
                </h2>
                <p
                  className={`shrink-0 pl-2 text-right font-extrabold tabular-nums leading-snug text-[var(--navy)] ${
                    emphasizePriceOnMobile ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg lg:text-xl"
                  }`}
                >
                  {priceLine}
                </p>
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)] lg:text-xl">
                {listing.title}
              </h2>
            )}
            <p className="mt-1 text-sm text-[var(--charcoal-light)] lg:text-base">
              {listing.address}, {listing.city}, {listing.state}
              {listing.zipCode && ` ${listing.zipCode}`}
            </p>
          </div>
          {showSizeBadges && stats.length > 0 && (
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
            <p className="mt-3 text-left text-xs text-[var(--muted)]">
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
