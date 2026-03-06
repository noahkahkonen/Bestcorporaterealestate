import Link from "next/link";
import Image from "next/image";
import { getSoldListings } from "@/lib/listings";
import { getSoldLeasedLabel } from "@/lib/listings";

export const dynamic = "force-dynamic";

function getPropertyCategory(listing: { propertyType: string; listingType: string; transactionOutcome?: string | null }): string {
  const label = getSoldLeasedLabel(listing);
  return label === "Leased" ? `${listing.propertyType} Lease` : `${listing.propertyType} Sale`;
}

export default async function DealsPage() {
  const listings = await getSoldListings();

  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <section className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-20 sm:py-28">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8">
          <div className="mb-16">
            <span className="mb-4 block text-xs font-black uppercase tracking-[0.4em] text-[var(--navy)]">
              Proven Results
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--charcoal)] sm:text-5xl md:text-6xl">
              Recent Transactions
            </h1>
            <div className="mt-6 h-1 w-24 bg-[var(--accent)]" />
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {listings.map((listing) => {
                const isLeased = getSoldLeasedLabel(listing) === "Leased";
                const priceDisplay =
                  isLeased && listing.leasePricePerSf != null && listing.leaseType
                    ? `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`
                    : listing.soldPrice != null
                      ? `$${listing.soldPrice.toLocaleString()}`
                      : null;

                return (
                  <Link
                    key={listing.id}
                    href={`/deals/${listing.slug}`}
                    className="group flex flex-col overflow-hidden rounded-sm bg-[var(--surface)] shadow-xl transition-all duration-500 hover:-translate-y-2 xl:flex-row"
                  >
                    <div className="relative h-72 w-full shrink-0 overflow-hidden xl:h-auto xl:w-[350px]">
                      {(listing.heroImage.startsWith("/") || listing.heroImage.startsWith("https://")) ? (
                        <Image
                          src={listing.heroImage}
                          alt={listing.title}
                          fill
                          className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                          sizes="(max-width: 1280px) 100vw, 350px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
                          Property Image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <span className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                        {getPropertyCategory(listing)}
                      </span>
                      <h2 className="mb-4 font-display text-2xl font-bold text-[var(--charcoal)] transition-colors group-hover:text-[var(--navy)] sm:text-3xl">
                        {listing.title}
                      </h2>
                      <p className="mb-6 flex-1 text-base leading-relaxed text-[var(--charcoal-light)] line-clamp-3">
                        {listing.description?.slice(0, 180) || `${listing.address}, ${listing.city}`}
                        {listing.description && listing.description.length > 180 ? "…" : ""}
                      </p>
                      <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-tight text-[var(--charcoal-light)]">
                        {priceDisplay && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[var(--navy)]">Value</span>
                            <span>{priceDisplay}</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[var(--navy)]">Market</span>
                          <span>
                            {listing.city}
                            {listing.state ? `, ${listing.state}` : ""}
                          </span>
                        </div>
                        {listing.soldDate && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[var(--navy)]">Closed</span>
                            <span>
                              {new Date(listing.soldDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
              <p className="text-lg text-[var(--charcoal-light)]">
                Transactions will appear here once listings are marked as sold or leased.
              </p>
              <Link
                href="/listings"
                className="mt-6 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                View active listings →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
