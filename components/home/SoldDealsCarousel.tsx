"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/types/listing";
import { getSoldLeasedLabel } from "@/lib/listings";

const ROTATE_INTERVAL_MS = 4500;
const CARD_GAP = 24;

interface SoldDealsCarouselProps {
  listings: Listing[];
}

function SoldDealCard({ listing }: { listing: Listing }) {
  const [imgError, setImgError] = useState(false);
  const showRealImage = (listing.heroImage.startsWith("/") || listing.heroImage.startsWith("https://")) && !imgError;
  const stats = [
    listing.squareFeet && `${(listing.squareFeet / 1000).toFixed(1)}K SF`,
    listing.acreage && `${listing.acreage} Acreage`,
  ].filter(Boolean);

  const isLeased = getSoldLeasedLabel(listing) === "Leased";
  const priceDisplay = isLeased && listing.leasePricePerSf != null && listing.leaseType
    ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
    : listing.soldPrice != null
      ? `$${listing.soldPrice.toLocaleString()}`
      : listing.price != null
        ? `$${listing.price.toLocaleString()}`
        : null;

  return (
    <Link
      href={`/deals/${listing.slug}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all hover:border-[var(--navy)]/30 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--surface-muted)]">
        {showRealImage ? (
          <Image
            src={listing.heroImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="320px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[var(--charcoal-light)]">
            Property Image
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-[var(--navy)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          {getSoldLeasedLabel(listing)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
          {listing.title}
        </h3>
        <p className="mt-0.5 text-sm text-[var(--charcoal-light)]">
          {listing.address}, {listing.city}
        </p>
        {stats.length > 0 && (
          <p className="mt-2 text-xs text-[var(--muted)]">{stats.join(" • ")}</p>
        )}
        {priceDisplay && (
          <p className="mt-2 text-sm font-semibold text-[var(--navy)]">
            {priceDisplay}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function SoldDealsCarousel({ listings }: SoldDealsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (listings.length <= 1) return;
    setActiveIndex((i) => (i + 1) % listings.length);
  }, [listings.length]);

  useEffect(() => {
    if (listings.length <= 1 || isPaused) return;
    const id = setInterval(goNext, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [listings.length, isPaused, goNext]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || listings.length <= 1) return;
    const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
    const cardWidth = firstCard ? firstCard.offsetWidth : (el.clientWidth - 2 * CARD_GAP) / 3;
    const scrollLeft = activeIndex * (cardWidth + CARD_GAP);
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeIndex, listings.length]);

  const hasDeals = listings.length > 0;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
          Transactions & Testimonials
        </h2>
        <p className="mt-2 text-base text-[var(--charcoal-light)] lg:text-lg">
          Past deals we&apos;ve completed and what clients say.
        </p>

        <div
          className="mt-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="flex flex-col gap-10">
            <div>
              {hasDeals ? (
                <>
                  <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide"
                    style={{ scrollSnapType: "x mandatory" }}
                  >
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        data-carousel-card
                        className="shrink-0 w-[280px] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-2*1.5rem)/3)]"
                        style={{ scrollSnapAlign: "start" }}
                      >
                        <SoldDealCard listing={listing} />
                      </div>
                    ))}
                  </div>
                  {listings.length > 1 && (
                    <div className="mt-4 flex justify-center gap-1.5">
                      {listings.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setActiveIndex(i);
                            setIsPaused(true);
                          }}
                          aria-label={`View deal ${i + 1}`}
                          className={`h-2 rounded-full transition-all ${
                            activeIndex === i
                              ? "w-6 bg-[var(--navy)]"
                              : "w-2 bg-[var(--border)] hover:bg-[var(--charcoal-light)]"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                  <p className="text-[var(--charcoal-light)]">
                    Transactions will appear here once listings are marked as sold or leased.
                  </p>
                </div>
              )}
            </div>

            <div className="w-full">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                What Clients Say
              </h3>
              <div className="mt-4 flex flex-col gap-6">
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
                  <blockquote
                    key={i}
                    className="border-l-2 border-[var(--navy)] pl-4"
                  >
                    <p className="text-[var(--charcoal)]">&quot;{t.quote}&quot;</p>
                    <footer className="mt-2 text-sm text-[var(--charcoal-light)]">
                      — {t.author}, {t.context}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
