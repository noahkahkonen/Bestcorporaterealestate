import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListings, getListingBySlug, getSimilarListings } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import PropertyTypeTag from "@/components/PropertyTypeTag";
import InvestmentMetricsSection from "@/components/InvestmentMetricsSection";
import MortgageCalculator from "@/components/MortgageCalculator";
import CashOnCashCalculator from "@/components/CashOnCashCalculator";
import MonthlyRentCalculator from "@/components/MonthlyRentCalculator";
import InteractiveSitePlan from "@/components/InteractiveSitePlan";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import RequestFinancialsButton from "@/components/RequestFinancialsButton";
import ListingCard from "@/components/ListingCard";
import ShareListingButton from "@/components/ShareListingButton";
import { formatPhone } from "@/lib/format-phone";
import { SAWMILL_SITE_PLAN_UNITS } from "@/data/sawmill-site-plan-units";

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

  const isForLease = listing_.listingType === "For Lease" || listing_.listingType === "Sale/Lease";
  const leaseDisplay =
    isForLease && listing_.leasePricePerSf != null && listing_.leaseType
      ? `$${Number(listing_.leasePricePerSf).toLocaleString()}/SF ${listing_.leaseType}`
      : null;
  const salePriceDisplay =
    (listing_.price != null || listing_.investmentMetrics?.price != null || listing_.priceNegotiable)
      ? listing_.priceNegotiable
        ? "Negotiable"
        : `$${(listing_.price ?? listing_.investmentMetrics?.price ?? 0).toLocaleString()}`
      : null;

  const headerPrice = isForLease && leaseDisplay ? leaseDisplay : salePriceDisplay;

  // Specs grid – Stitch style (Total SF, Acreage, Cap Rate, Occupancy)
  const specs = [
    listing_.squareFeet && {
      label: "Total SF",
      value: listing_.squareFeet.toLocaleString(),
    },
    listing_.acreage != null && {
      label: "Lot Size",
      value: `${listing_.acreage} AC`,
    },
    listing_.investmentMetrics?.capRate != null && {
      label: "Cap Rate",
      value: `${(listing_.investmentMetrics.capRate * 100).toFixed(1)}%`,
    },
    listing_.occupancy && {
      label: "Occupancy",
      value: listing_.occupancy,
    },
    isForLease && listing_.leasePricePerSf != null && listing_.leaseType && {
      label: "Lease Rate",
      value: `$${Number(listing_.leasePricePerSf).toLocaleString()}/SF ${listing_.leaseType}`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="pb-16">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Photo Gallery */}
        <div className="mb-10">
          <PropertyGallery images={listing_.galleryImages} title={listing_.title} />
        </div>

        {/* Property Info Header – Stitch style */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
              <Link href="/listings" className="hover:underline">Listings</Link>
              <span aria-hidden>›</span>
              <span>{listing_.city}</span>
              {listing_.propertyType && (
                <>
                  <span aria-hidden>›</span>
                  <span>{listing_.propertyType}</span>
                </>
              )}
            </nav>
            <h1 className="text-4xl font-extrabold leading-tight text-[var(--charcoal)] sm:text-5xl">
              {listing_.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[var(--charcoal-light)]">
              <svg className="h-5 w-5 shrink-0 text-[var(--navy)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <p className="text-lg">
                {listing_.address}, {listing_.city}, {listing_.state}
                {listing_.zipCode && ` ${listing_.zipCode}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-3">
            <ShareListingButton slug={slug} />
            <Link
              href={`/contact?listingSlug=${encodeURIComponent(slug)}&listingTitle=${encodeURIComponent(listing_.title)}`}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-bold transition-colors hover:bg-[var(--surface-muted)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Save / Inquire
            </Link>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column – Details */}
          <div className="space-y-12 lg:col-span-2">
            {/* Specs Grid – Stitch style */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-6 rounded-xl border border-[var(--navy)]/10 bg-[var(--surface-muted)] p-8 shadow-sm md:grid-cols-4">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--charcoal-light)]">
                      {label}
                    </span>
                    <span className="text-2xl font-extrabold text-[var(--charcoal)]">{value}</span>
                  </div>
                ))}
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
                <h3 className="mb-6 text-2xl font-extrabold text-[var(--charcoal)]">
                  Investment Highlights
                </h3>
                <ul className="grid gap-4 md:grid-cols-2">
                  {listing_.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 rounded-lg border-l-4 border-[var(--navy)] bg-[var(--surface)] p-4 shadow-sm"
                    >
                      <svg
                        className="mt-1 h-6 w-6 shrink-0 text-[var(--navy)]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span className="font-medium text-[var(--charcoal)]">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Location */}
            <section>
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

            {/* Full Gallery – carousel for all photos */}
            {listing_.galleryImages.length > 1 && (
              <section id="gallery">
                <h3 className="mb-4 text-xl font-extrabold text-[var(--charcoal)]">All Photos</h3>
                <PropertyGallery images={listing_.galleryImages} title={listing_.title} />
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
                <div className="space-y-4">
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--navy)]/20 bg-[var(--surface)] py-4 font-extrabold text-[var(--charcoal)] transition-opacity hover:opacity-90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule a Tour
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
                  <Link
                    href={`/contact?listingSlug=${encodeURIComponent(slug)}&listingTitle=${encodeURIComponent(listing_.title)}`}
                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-[var(--navy)] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Send Inquiry
                  </Link>
                </div>
              </div>

              {listing_.financialDocPath && (
                <RequestFinancialsButton listingSlug={slug} listingTitle={listing_.title} />
              )}

              {/* Mortgage / Cash-on-Cash / Rent calculators */}
              {(listing_.listingType === "For Sale" || listing_.listingType === "Sale/Lease") &&
                (listing_.occupancy === "Owner User" || listing_.occupancy === "Owner User/Investment") &&
                (listing_.price != null || listing_.investmentMetrics?.price != null) && (
                <MortgageCalculator purchasePrice={listing_.price ?? listing_.investmentMetrics?.price ?? 0} />
              )}
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
                  {listing_.leaseType === "NNN" && (
                    <MonthlyRentCalculator
                      baseRentPerSf={listing_.leasePricePerSf ?? 0}
                      camPerSf={listing_.leaseNnnCharges ?? 0}
                      squareFeet={listing_.squareFeet ?? 0}
                    />
                  )}
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
