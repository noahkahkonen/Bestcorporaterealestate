import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListings, getListingBySlug } from "@/lib/listings";
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

  const isForLease = listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  const leaseDisplay =
    isForLease && listing.leasePricePerSf != null && listing.leaseType
      ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
      : null;
  const salePriceDisplay =
    (listing.price != null || listing.investmentMetrics?.price != null || listing.priceNegotiable)
      ? listing.priceNegotiable
        ? "Negotiable"
        : `$${(listing.price ?? listing.investmentMetrics?.price ?? 0).toLocaleString()}`
      : null;

  const headerPrice = isForLease && leaseDisplay
    ? leaseDisplay
    : salePriceDisplay;

  const stats = [
    { label: "Listing Type", value: listing.listingType },
    {
      label: "Property Type",
      value: listing.propertyType === "Land" && listing.landSubcategory
        ? `${listing.propertyType} – ${listing.landSubcategory}`
        : listing.propertyType,
    },
    listing.squareFeet && { label: "Square Feet", value: `${listing.squareFeet.toLocaleString()} SF` },
    listing.acreage != null && { label: "Acres", value: `${listing.acreage}` },
    listing.investmentMetrics?.capRate != null && {
      label: "Cap Rate",
      value: `${(listing.investmentMetrics.capRate * 100).toFixed(1)}%`,
    },
    isForLease && listing.leaseType === "NNN" && listing.leaseNnnCharges != null && {
      label: "NNN charges",
      value: `$${Number(listing.leaseNnnCharges).toLocaleString()}/SF`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <PropertyGallery images={listing.galleryImages} title={listing.title} />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_410px] lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-row flex-nowrap items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 max-w-[50%] flex-1 sm:max-w-none">
                <h1 className="text-xl font-bold tracking-tight text-[var(--charcoal)] sm:text-2xl">
                  {listing.title}
                </h1>
                <p className="mt-1 text-base text-[var(--charcoal-light)] sm:mt-1 sm:text-2xl">
                  {listing.address},{" "}
                  <span className="whitespace-nowrap">
                    {listing.city}, {listing.state}
                    {listing.zipCode && ` ${listing.zipCode}`}
                  </span>
                </p>
              </div>
              {headerPrice && (
                <p className="shrink-0 text-right text-lg font-bold text-[var(--charcoal)] sm:text-3xl">
                  {headerPrice}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {stats.map(({ label, value }) => {
                const isLandWithSub = label === "Property Type" && value.includes(" – ");
                return (
                  <div key={label} className="w-fit rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      {label}
                    </p>
                    <p className={`mt-1 font-semibold text-[var(--charcoal)] ${isLandWithSub ? "flex flex-nowrap items-center justify-center gap-[5px]" : ""}`}>
                      {label === "Property Type" ? (
                        value.includes(" – ") ? (
                          <>
                            <PropertyTypeTag propertyType={value.split(" – ")[0]!} className="shrink-0" />
                            <PropertyTypeTag propertyType={value.split(" – ")[1]!} className="shrink-0" />
                          </>
                        ) : (
                          <PropertyTypeTag propertyType={value} />
                        )
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-[var(--charcoal)]">Description</h2>
              <p className="mt-3 leading-relaxed text-[var(--charcoal-light)]">
                {listing.description}
              </p>
            </div>

            {listing.features.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-[var(--charcoal)]">Features</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {listing.features.map((f) => (
                    <li
                      key={f}
                      className="rounded bg-[var(--surface-muted)] px-3 py-1.5 text-sm font-medium text-[var(--charcoal)]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-[var(--charcoal)]">Location</h2>
              <div className="mt-4">
                <PropertyMap listing={listing} />
              </div>
              <p className="mt-2 text-sm text-[var(--charcoal-light)]">
                Drag the pegman onto the map to view Street View.
              </p>
            </div>

            {slug === "sawmill-retail-investment" && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-[var(--charcoal)]">Site plan</h2>
                <p className="mt-2 text-sm text-[var(--charcoal-light)]">
                  Hover to highlight a unit; click for tenant details.
                </p>
                <div className="mt-4">
                  <InteractiveSitePlan units={SAWMILL_SITE_PLAN_UNITS} imageSrc="/siteplans/SawmillSitePlan.png" />
                </div>
              </div>
            )}

            {listing.youtubeLink && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-[var(--charcoal)]">Video</h2>
                <div className="mt-4 aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
                  <YouTubeEmbed url={listing.youtubeLink} />
                </div>
              </div>
            )}
          </div>

          <aside className="mt-10 min-w-0 space-y-6 lg:sticky lg:top-24 lg:mt-0 lg:grid lg:self-start lg:grid-cols-1">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-[10px] py-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                {listing.brokers && listing.brokers.length > 1 ? "Listing brokers" : "Listing broker"}
              </h3>
              {listing.brokers && listing.brokers.length > 0 ? (
                listing.brokers.map((broker, idx) => (
                  <div key={broker.id} className={idx > 0 ? "mt-5 border-t border-[var(--border)] pt-4" : "mt-4"}>
                    <div className="flex gap-5">
                      {broker.headshot ? (
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                          <Image
                            src={broker.headshot}
                            alt={broker.name}
                            fill
                            className="object-cover object-top"
                            sizes="96px"
                            quality={90}
                          />
                        </div>
                      ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-2xl font-semibold text-[var(--muted)]">
                          {broker.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="whitespace-nowrap text-lg font-semibold text-[var(--charcoal)]">
                          {broker.name}
                          {broker.credentials && (
                            <span className="ml-1 text-sm font-normal text-[var(--charcoal-light)]">
                              {broker.credentials}
                            </span>
                          )}
                        </p>
                        {broker.title && (
                          <p className="text-sm text-[var(--charcoal-light)]">{broker.title}</p>
                        )}
                        <dl className="mt-2 space-y-1.5">
                          {broker.phone && (
                            <div>
                              <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Phone</dt>
                              <dd>
                                <a href={`tel:+1${broker.phone.replace(/\D/g, "").slice(-10)}`} className="text-sm text-[var(--charcoal)] hover:text-[var(--navy)]">
                                  {formatPhone(broker.phone)}
                                  {broker.ext && ` Ext. ${broker.ext}`}
                                </a>
                              </dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</dt>
                            <dd>
                              <a href={`mailto:${broker.email}`} className="break-all text-sm text-[var(--charcoal)] hover:text-[var(--navy)]">
                                {broker.email}
                              </a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="mt-3 text-sm text-[var(--charcoal-light)]">
                    Contact our team for more information about this listing.
                  </p>
                  <dl className="mt-4 space-y-2" />
                </>
              )}
              <Link
                href={`/contact?listingSlug=${encodeURIComponent(slug)}&listingTitle=${encodeURIComponent(listing.title)}`}
                className="mt-6 flex w-full items-center justify-center rounded-md bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Send a message
              </Link>
              {listing.brochure ? (
                <a
                  href={listing.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center rounded-md border border-[var(--navy)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
                >
                  Download brochure
                </a>
              ) : (
                <div className="mt-3 flex w-full items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3 text-sm font-semibold text-[var(--muted)]">
                  Download brochure
                </div>
              )}
              {listing.financialDocPath && (
                <div className="mt-3">
                  <RequestFinancialsButton listingSlug={slug} listingTitle={listing.title} />
                </div>
              )}
              <Link
                href={`/contact?listingSlug=${encodeURIComponent(slug)}&listingTitle=${encodeURIComponent(listing.title)}`}
                className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Floorplan
              </Link>
            </div>
            {/* Mortgage calculator: Owner User or Owner User/Investment (For Sale / Sale/Lease) */}
            {(listing.listingType === "For Sale" || listing.listingType === "Sale/Lease") &&
              (listing.occupancy === "Owner User" || listing.occupancy === "Owner User/Investment") &&
              (listing.price != null || listing.investmentMetrics?.price != null) && (
              <MortgageCalculator purchasePrice={listing.price ?? listing.investmentMetrics?.price ?? 0} />
            )}
            {/* Investment calculator: Investment or Owner User/Investment (For Sale / Sale/Lease) */}
            {(listing.listingType === "For Sale" || listing.listingType === "Sale/Lease") &&
              (listing.occupancy === "Investment" || listing.occupancy === "Owner User/Investment") &&
              (listing.price != null || listing.investmentMetrics?.price != null) &&
              (listing.noi != null || listing.investmentMetrics?.noi != null) && (
              <CashOnCashCalculator
                listingPrice={listing.price ?? listing.investmentMetrics?.price ?? 0}
                noi={listing.noi ?? listing.investmentMetrics?.noi ?? 0}
              />
            )}
            {(listing.listingType === "For Lease" || listing.listingType === "Sale/Lease") && (
              <>
                {listing.leaseType === "NNN" && (
                  <MonthlyRentCalculator
                    baseRentPerSf={listing.leasePricePerSf ?? 0}
                    camPerSf={listing.leaseNnnCharges ?? 0}
                    squareFeet={listing.squareFeet ?? 0}
                  />
                )}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Interested in Leasing?
                  </h3>
                  <Link
                    href={`/listings/${slug}/apply`}
                    className="mt-6 flex w-full items-center justify-center rounded-md bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Apply Today
                  </Link>
                </div>
              </>
            )}
            {listing.features.includes("Investment") && listing.investmentMetrics && !listing.occupancy && (
              <InvestmentMetricsSection metrics={listing.investmentMetrics} />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
