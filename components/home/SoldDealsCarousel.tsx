"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/types/listing";
import { getSoldLeasedLabel } from "@/lib/listings";

interface SoldDealsCarouselProps {
  listings: Listing[];
}

function SoldDealCard({ listing }: { listing: Listing }) {
  const [imgError, setImgError] = useState(false);
  const showRealImage = (listing.heroImage.startsWith("/") || listing.heroImage.startsWith("https://")) && !imgError;

  const isLeased = getSoldLeasedLabel(listing) === "Leased";
  const priceDisplay =
    isLeased && listing.leasePricePerSf != null && listing.leaseType
      ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
      : listing.soldPrice != null
        ? `$${listing.soldPrice.toLocaleString()}`
        : listing.price != null
          ? `$${listing.price.toLocaleString()}`
          : null;

  function getPropertyCategory() {
    const label = getSoldLeasedLabel(listing);
    return label === "Leased" ? `${listing.propertyType} Lease` : `${listing.propertyType} Sale`;
  }

  return (
    <Link
      href={`/deals/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-[var(--surface)] shadow-xl transition-all duration-500 hover:-translate-y-2 xl:flex-row"
    >
      <div className="relative aspect-[2.2/1] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-72 xl:h-auto xl:w-[350px]">
        {showRealImage ? (
          <Image
            src={listing.heroImage}
            alt={listing.title}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            sizes="(max-width: 1280px) 100vw, 350px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-sm font-medium text-[var(--charcoal-light)]">
            Property Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-8">
        <span className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">
          {getPropertyCategory()}
        </span>
        <h3 className="mb-4 font-display text-2xl font-bold text-[var(--charcoal)] transition-colors group-hover:text-[var(--navy)] sm:text-3xl">
          {listing.title}
        </h3>
        <p className="mb-6 flex-1 text-base leading-relaxed text-[var(--charcoal-light)] line-clamp-3">
          {listing.description?.slice(0, 180) || `${listing.address}, ${listing.city}`}
          {listing.description && listing.description.length > 180 ? "…" : ""}
        </p>
        <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-tight text-[var(--charcoal-light)] max-sm:gap-6">
          {priceDisplay && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--navy)]">Value</span>
              <span className="text-base font-extrabold normal-case tracking-normal text-[var(--charcoal)] tabular-nums sm:text-xs sm:font-bold sm:uppercase sm:tracking-tight sm:text-[var(--charcoal-light)]">
                {priceDisplay}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--navy)]">Market</span>
            <span>
              {listing.city}
              {listing.state ? `, ${listing.state}` : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SoldDealsCarousel({ listings }: SoldDealsCarouselProps) {
  const hasDeals = listings.length > 0;
  const displayListings = listings.slice(0, 4);

  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface-muted)] py-12 sm:py-16">
      <div className="absolute right-0 top-0 h-96 w-96 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #004733 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.4em] text-[var(--navy)]">
              Proven Results
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-[var(--charcoal)] sm:text-5xl md:text-6xl">
              Recent Deals
            </h2>
            <div className="mt-4 h-1 w-24 bg-[var(--accent)]" />
          </div>
          <Link
            href="/deals"
            className="hidden shrink-0 border-b-2 border-[var(--accent)] pb-2 text-xs font-black uppercase tracking-widest text-[var(--navy)] transition-colors hover:text-[var(--navy)]/80 lg:block"
          >
            View Transactions
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {hasDeals ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {displayListings.map((listing) => (
                <SoldDealCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
              <p className="text-lg text-[var(--charcoal-light)]">
                Transactions will appear here once listings are marked as sold or leased.
              </p>
            </div>
          )}

          <div className="mt-2 pt-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              What Clients Say
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  quote:
                    "Best Corporate Real Estate delivered a seamless sale process and achieved above our expectations.",
                  author: "Private Owner",
                  context: "Industrial disposition, Columbus",
                },
                {
                  quote:
                    "Their knowledge of the Central Ohio market and attention to detail made our lease negotiation efficient and successful.",
                  author: "Corporate Tenant",
                  context: "Office lease, Arena District",
                },
              ].map((t, i) => (
                <blockquote key={i} className="border-l-2 border-[var(--navy)] pl-4">
                  <p className="text-[var(--charcoal)]">&quot;{t.quote}&quot;</p>
                  <footer className="mt-2 text-sm text-[var(--charcoal-light)]">
                    — {t.author}, {t.context}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>

        {hasDeals && (
          <div className="mt-8 text-center lg:hidden">
            <Link
              href="/deals"
              className="group inline-flex items-center gap-2 border-b-2 border-[var(--accent)] pb-2 text-sm font-black uppercase tracking-widest text-[var(--navy)]"
            >
              View Transactions
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
