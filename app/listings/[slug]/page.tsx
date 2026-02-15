import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import listingsData from "@/data/listings.json";
import type { Listing } from "@/types/listing";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyTypeTag from "@/components/PropertyTypeTag";
import InvestmentMetricsSection from "@/components/InvestmentMetricsSection";
import SitePlanPhoto from "@/components/SitePlanPhoto";
import { SAWMILL_SITE_PLAN_UNITS } from "@/data/sawmill-site-plan-units";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const listings = listingsData as Listing[];
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = listingsData as Listing[];
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) return { title: "Property" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const listings = listingsData as Listing[];
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const stats = [
    listing.squareFeet && { label: "Square Feet", value: `${listing.squareFeet.toLocaleString()} SF` },
    listing.acreage != null && { label: "Acres", value: `${listing.acreage}` },
    { label: "Property Type", value: listing.propertyType },
    { label: "Listing Type", value: listing.listingType },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="pb-16">
      <PropertyGallery images={listing.galleryImages} title={listing.title} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-10">
          <div>
            <p className="text-sm font-medium text-[var(--charcoal-light)]">
              {listing.listingType} • <PropertyTypeTag propertyType={listing.propertyType} />
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-2 text-lg text-[var(--charcoal-light)]">
              {listing.address}, {listing.city}, {listing.state}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-[var(--border)] bg-gray-50/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    {label}
                  </p>
                  <p className="mt-1 font-semibold text-[var(--charcoal)]">
                    {label === "Property Type" ? (
                      <PropertyTypeTag propertyType={value} />
                    ) : (
                      value
                    )}
                  </p>
                </div>
              ))}
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
                      className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-[var(--charcoal)]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {slug === "sawmill-retail-investment" && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-[var(--charcoal)]">Site plan</h2>
                <p className="mt-2 text-sm text-[var(--charcoal-light)]">
                  Hover to highlight a unit; click for tenant details.
                </p>
                <div className="mt-4">
                  <SitePlanPhoto units={SAWMILL_SITE_PLAN_UNITS} imageSrc="/siteplans/SawmillSitePlan.png" />
                </div>
              </div>
            )}
          </div>

          <aside className="mt-10 space-y-6 lg:sticky lg:top-24 lg:mt-0 lg:grid lg:self-start lg:grid-cols-1">
            <div className="rounded-lg border border-[var(--border)] bg-gray-50/50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Listing broker
              </h3>
              <p className="mt-3 text-lg font-semibold text-[var(--charcoal)]">
                Broker Name
              </p>
              <p className="mt-1 text-sm text-[var(--charcoal-light)]">
                Senior Advisor
              </p>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Phone</dt>
                  <dd>
                    <a href="tel:+16145593350" className="text-[var(--charcoal)] hover:text-[var(--navy)]">
                      614-559-3350
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</dt>
                  <dd>
                    <a href="mailto:broker@bestcre.com" className="text-[var(--charcoal)] hover:text-[var(--navy)]">
                      broker@bestcre.com
                    </a>
                  </dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-6 flex w-full items-center justify-center rounded-md bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Send a message
              </Link>
              <button
                type="button"
                className="mt-3 w-full rounded-md border border-[var(--navy)] bg-white px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
              >
                Download brochure
              </button>
              <Link
                href="/contact"
                className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Floorplan
              </Link>
            </div>
            {listing.features.includes("Investment") && listing.investmentMetrics && (
              <InvestmentMetricsSection metrics={listing.investmentMetrics} />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
