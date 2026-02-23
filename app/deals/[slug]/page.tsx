import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSoldListingBySlug, getSoldLeasedLabel } from "@/lib/listings";
import PropertyGallery from "@/components/PropertyGallery";
import { formatPhone } from "@/lib/format-phone";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { getSoldListings } = await import("@/lib/listings");
    const listings = await getSoldListings();
    return listings.map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getSoldListingBySlug(slug);
  if (!listing) return { title: "Deal" };
  const label = getSoldLeasedLabel(listing);
  return {
    title: `${listing.title} | ${label} Deal`,
    description: listing.description.slice(0, 160),
  };
}

export default async function SoldDealPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getSoldListingBySlug(slug);
  if (!listing) notFound();

  const stats = [
    { label: "Property Type", value: listing.propertyType },
    listing.squareFeet && { label: "Square Feet", value: `${listing.squareFeet.toLocaleString()} SF` },
    listing.acreage != null && { label: "Acres", value: `${listing.acreage}` },
    listing.listingType && { label: "Transaction Type", value: listing.listingType },
    (() => {
      const label = getSoldLeasedLabel(listing);
      if (label === "Leased" && listing.leasePricePerSf != null && listing.leaseType) {
        return { label: "Sale/Lease Price", value: `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}` };
      }
      if (listing.soldPrice != null) {
        return { label: "Sale/Lease Price", value: `$${listing.soldPrice.toLocaleString()}` };
      }
      return null;
    })(),
    listing.soldDate && {
      label: "Closing Date",
      value: new Date(listing.soldDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--navy)] hover:underline"
        >
          ← Back to Home
        </Link>

        <PropertyGallery images={listing.galleryImages} title={listing.title} />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <span className="inline-block rounded bg-[var(--navy)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
              {getSoldLeasedLabel(listing)}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-2 text-lg text-[var(--charcoal-light)]">
              {listing.address}, {listing.city}, {listing.state}
              {listing.zipCode && ` ${listing.zipCode}`}
            </p>

            {(listing.soldPrice != null ||
              (getSoldLeasedLabel(listing) === "Leased" && listing.leasePricePerSf != null && listing.leaseType)) && (
              <p className="mt-4 text-xl font-semibold text-[var(--navy)]">
                {getSoldLeasedLabel(listing) === "Leased" && listing.leasePricePerSf != null && listing.leaseType
                  ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
                  : listing.soldPrice != null
                    ? `$${listing.soldPrice.toLocaleString()}`
                    : null}
              </p>
            )}

            {listing.soldDate && (
              <p className="mt-1 text-sm text-[var(--charcoal-light)]">
                Closed {new Date(listing.soldDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {listing.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-[var(--charcoal)]">
                  Property Overview
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-[var(--charcoal-light)]">
                  {listing.description}
                </p>
              </div>
            )}

            {listing.soldNotes && (
              <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Transaction Notes
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-[var(--charcoal)]">
                  {listing.soldNotes}
                </p>
              </div>
            )}

            {listing.features.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Features
                </h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {listing.features.map((f) => (
                    <li
                      key={f}
                      className="rounded bg-[var(--surface-muted)] px-2 py-1 text-sm text-[var(--charcoal)]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="w-full shrink-0 lg:w-fit">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Deal Summary
              </h2>
              <dl className="mt-4 space-y-3">
                {stats.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs text-[var(--charcoal-light)]">
                      {label}
                    </dt>
                    <dd className="mt-0.5 font-medium text-[var(--charcoal)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {listing.brokers && listing.brokers.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-semibold text-[var(--charcoal)]">
                    Represented by
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {listing.brokers.map((b) => (
                      <li key={b.id} className="flex items-center gap-3">
                        {b.headshot ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={b.headshot}
                              alt={b.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--navy)]">
                            {b.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-fit">
                          <p className="font-medium text-[var(--charcoal)]">
                            {b.name}
                          </p>
                          {b.title && (
                            <p className="text-xs text-[var(--charcoal-light)]">
                              {b.title}
                            </p>
                          )}
                          {b.phone && (
                            <a
                              href={`tel:${b.phone}`}
                              className="mt-0.5 block text-sm text-[var(--navy)] hover:underline"
                            >
                              {formatPhone(b.phone)}
                            </a>
                          )}
                          {b.email && (
                            <a
                              href={`mailto:${b.email}`}
                              className="mt-0.5 block whitespace-nowrap text-sm text-[var(--navy)] hover:underline"
                            >
                              {b.email}
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
