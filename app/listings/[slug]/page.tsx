import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListings, getListingBySlug, getSimilarListings } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import InvestmentMetricsSection from "@/components/InvestmentMetricsSection";
import CashOnCashCalculator from "@/components/CashOnCashCalculator";
import MonthlyRentCalculator from "@/components/MonthlyRentCalculator";
import InteractiveSitePlan from "@/components/InteractiveSitePlan";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import RequestFinancialsButton from "@/components/RequestFinancialsButton";
import ListingCard from "@/components/ListingCard";
import ShareListingButton from "@/components/ShareListingButton";
import NnnChargesInfoTag from "@/components/NnnChargesInfoTag";
import { formatPhone } from "@/lib/format-phone";
import { SAWMILL_SITE_PLAN_UNITS } from "@/data/sawmill-site-plan-units";
import { formatListingDisplayPrice } from "@/lib/format-listing-display-price";
import { getListingSpecTrio } from "@/lib/listing-spec-trio";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try {
    const listings = await getListings();
    return listings.map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Property" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const similar = await getSimilarListings(slug, listing.propertyType);
  const listing_ = listing;

  const specs = getListingSpecTrio(listing_);
  const priceLine = formatListingDisplayPrice(listing_);

  return (
    <div className="pb-16">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Photo Gallery */}
        <div className="mb-8 sm:mb-10">
          <PropertyGallery images={listing_.galleryImages} title={listing_.title} />
        </div>

        {/* Property Info Header – Stitch style */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4 sm:gap-4">
            <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] font-bold uppercase leading-snug tracking-wide text-[var(--navy)] sm:gap-x-1.5 sm:text-xs sm:tracking-widest">
              <Link href="/listings" className="shrink-0 hover:underline">
                Listings
              </Link>
              <span aria-hidden className="shrink-0 opacity-60">
                ›
              </span>
              <span className="min-w-0">{listing_.city}</span>
              {listing_.propertyType && (
                <>
                  <span aria-hidden className="shrink-0 opacity-60">
                    ›
                  </span>
                  <span className="min-w-0">{listing_.propertyType}</span>
                </>
              )}
            </nav>
            <ShareListingButton
              slug={slug}
              className="shrink-0 px-2.5 py-1.5 text-[10px] sm:px-6 sm:py-3 sm:text-base [&_svg]:h-3.5 [&_svg]:w-3.5 sm:[&_svg]:h-5 sm:[&_svg]:w-5"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-snug text-[var(--charcoal)] sm:text-3xl sm:leading-tight md:text-4xl lg:text-5xl">
              {listing_.title}
            </h1>
            <a
              href="#listing-location"
              className="group mt-2 inline-flex max-w-full items-center gap-2 text-[var(--charcoal-light)] transition-colors hover:text-[var(--navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
              aria-label="View property on map below"
            >
              <svg
                className="h-4 w-4 shrink-0 text-[var(--navy)] transition-colors group-hover:text-[var(--accent)] sm:h-5 sm:w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="min-w-0 text-base leading-snug underline decoration-transparent underline-offset-2 transition-[text-decoration-color] group-hover:decoration-[var(--navy)] sm:text-lg">
                {listing_.address}, {listing_.city}, {listing_.state}
                {listing_.zipCode && ` ${listing_.zipCode}`}
              </span>
            </a>
            {priceLine && (
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--navy)] tabular-nums sm:mt-4 sm:text-2xl md:text-3xl">
                {priceLine}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column – Details */}
          <div className="space-y-12 lg:col-span-2">
            {/* Specs Grid – Stitch style */}
            {specs.length > 0 && (
              <div className="rounded-xl border border-[var(--navy)]/10 bg-[var(--surface-muted)] p-4 shadow-sm sm:p-5 md:p-6">
                <div className="grid grid-cols-3 gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-4">
                  {specs.map(({ label, value, nnnChargesInfo }) => (
                    <div key={label} className="flex min-w-0 flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase leading-tight tracking-wide text-[var(--charcoal-light)] sm:text-xs">
                        {label}
                        {nnnChargesInfo ? <NnnChargesInfoTag /> : null}
                      </span>
                      <span
                        className={`text-base font-extrabold tabular-nums leading-tight sm:text-xl md:text-2xl ${label === "Cap Rate" ? "text-[var(--navy)]" : "text-[var(--charcoal)]"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Overview – Stitch style */}
            <section>
              <h3 className="mb-6 w-fit border-b-2 border-[var(--accent)] pb-1 text-2xl font-extrabold text-[var(--charcoal)]">
                Property Overview
              </h3>
              <div className="prose prose-slate max-w-none text-lg leading-relaxed text-[var(--charcoal-light)]">
                <p className="whitespace-pre-wrap">{listing_.description}</p>
              </div>
            </section>

            {/* Investment Highlights – from features, Stitch style */}
            {listing_.features.length > 0 && (
              <section>
                <h3 className="mb-4 text-xl font-extrabold text-[var(--charcoal)] sm:mb-6 sm:text-2xl">
                  Investment Highlights
                </h3>
                <ul className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-4">
                  {listing_.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 rounded-lg border-l-4 border-[var(--navy)] bg-[var(--surface)] p-2.5 shadow-sm sm:gap-3 sm:p-4"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--navy)] sm:mt-1 sm:h-6 sm:w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span className="text-xs font-medium leading-snug text-[var(--charcoal)] sm:text-base">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Location */}
            <section id="listing-location" className="scroll-mt-24 md:scroll-mt-28">
              <h3 className="mb-4 text-xl font-extrabold text-[var(--charcoal)]">Location</h3>
              <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                <PropertyMap listing={listing_} />
              </div>
              <p className="mt-2 text-sm text-[var(--charcoal-light)]">
                Drag the pegman onto the map to view Street View.
              </p>
            </section>

            {slug === "sawmill-retail-investment" && (
              <section>
                <h3 className="mb-2 text-xl font-extrabold text-[var(--charcoal)]">Site plan</h3>
                <p className="mb-4 text-sm text-[var(--charcoal-light)]">
                  Hover to highlight a unit; click for tenant details.
                </p>
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <InteractiveSitePlan units={SAWMILL_SITE_PLAN_UNITS} imageSrc="/siteplans/SawmillSitePlan.png" />
                </div>
              </section>
            )}

            {listing_.youtubeLink && (
              <section>
                <h3 className="mb-4 text-xl font-extrabold text-[var(--charcoal)]">Video</h3>
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border)]">
                  <YouTubeEmbed url={listing_.youtubeLink} />
                </div>
              </section>
            )}
          </div>

          {/* Right Column – Sidebar (Stitch style) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Action Card – "Interested in this property?" */}
              <div className="rounded-xl border border-[var(--navy)]/20 bg-[var(--surface-muted)] p-6 shadow-lg">
                <h4 className="mb-4 text-xl font-extrabold text-[var(--charcoal)]">
                  Interested in this property?
                </h4>
                <div className="flex flex-col gap-4">
                  {listing_.brochure ? (
                    <a
                      href={listing_.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--navy)] py-4 font-extrabold text-white transition-opacity hover:opacity-90"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Offering Memorandum
                    </a>
                  ) : (
                    <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] py-4 font-medium text-[var(--muted)]">
                      Brochure not available
                    </div>
                  )}
                  <Link
                    href={`/contact?listingSlug=${encodeURIComponent(slug)}&listingTitle=${encodeURIComponent(listing_.title)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--surface)] py-4 font-extrabold text-[var(--navy)] transition-opacity hover:opacity-90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Inquire
                  </Link>
                </div>

                {/* Contact Representative */}
                <div className="mt-8 border-t border-[var(--navy)]/10 pt-8">
                  <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--charcoal-light)]">
                    Contact Representative
                  </h5>
                  {listing_.brokers && listing_.brokers.length > 0 ? (
                    <>
                      {listing_.brokers.map((broker) => (
                        <div key={broker.id} className="mb-6 flex items-center gap-4">
                          {broker.headshot ? (
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={broker.headshot}
                                alt={broker.name}
                                fill
                                className="object-cover object-top"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-lg font-bold text-[var(--navy)]">
                              {broker.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-extrabold text-[var(--charcoal)]">{broker.name}</p>
                            <p className="text-xs font-medium text-[var(--charcoal-light)]">
                              {broker.title || "Broker"}
                            </p>
                            {broker.phone && (
                              <a
                                href={`tel:+1${broker.phone.replace(/\D/g, "").slice(-10)}`}
                                className="mt-0.5 block text-sm text-[var(--navy)] hover:underline"
                              >
                                {formatPhone(broker.phone)}
                                {broker.ext && ` Ext. ${broker.ext}`}
                              </a>
                            )}
                            <a
                              href={`mailto:${broker.email}`}
                              className="block text-sm text-[var(--navy)] hover:underline"
                            >
                              {broker.email}
                            </a>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-[var(--charcoal-light)]">
                      Contact our team for more information.
                    </p>
                  )}
                </div>
              </div>

              {listing_.financialDocPath && (
                <RequestFinancialsButton listingSlug={slug} listingTitle={listing_.title} />
              )}

              {/* Cash-on-Cash / Rent calculators */}
              {(listing_.listingType === "For Sale" || listing_.listingType === "Sale/Lease") &&
                (listing_.occupancy === "Investment" || listing_.occupancy === "Owner User/Investment") &&
                (listing_.price != null || listing_.investmentMetrics?.price != null) &&
                (listing_.noi != null || listing_.investmentMetrics?.noi != null) && (
                <CashOnCashCalculator
                  listingPrice={listing_.price ?? listing_.investmentMetrics?.price ?? 0}
                  noi={listing_.noi ?? listing_.investmentMetrics?.noi ?? 0}
                />
              )}
              {(listing_.listingType === "For Lease" || listing_.listingType === "Sale/Lease") && (
                <>
                  <MonthlyRentCalculator
                    baseRentPerSf={listing_.leasePricePerSf ?? 0}
                    camPerSf={
                      listing_.leaseType === "NNN" ? listing_.leaseNnnCharges ?? 0 : 0
                    }
                    squareFeet={listing_.squareFeet ?? 0}
                  />
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Interested in Leasing?
                    </h3>
                    <Link
                      href={`/listings/${slug}/apply`}
                      className="mt-4 flex w-full items-center justify-center rounded-lg bg-[var(--navy)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Apply Today
                    </Link>
                  </div>
                </>
              )}
              {listing_.features.includes("Investment") && listing_.investmentMetrics && !listing_.occupancy && (
                <InvestmentMetricsSection metrics={listing_.investmentMetrics} />
              )}
            </div>
          </aside>
        </div>

        {/* Similar Listings – Stitch style */}
        {similar.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-3xl font-extrabold text-[var(--charcoal)]">
                  Similar Investment Opportunities
                </h3>
                <p className="mt-2 text-[var(--charcoal-light)]">
                  Curated listings based on {listing_.title} profile
                </p>
              </div>
              <Link
                href="/listings"
                className="flex items-center gap-2 font-bold text-[var(--navy)] hover:underline"
              >
                View all listings
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} showApplyButton={false} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
