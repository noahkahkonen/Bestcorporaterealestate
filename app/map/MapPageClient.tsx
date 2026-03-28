"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ListingsMap from "@/components/listings/ListingsMap";
import type { Listing } from "@/types/listing";

const SECTOR_FILTERS = [
  { value: "all", label: "All" },
  { value: "office", label: "Office" },
  { value: "industrial", label: "Industrial" },
  { value: "retail", label: "Retail" },
  { value: "multifamily", label: "Multifamily" },
  { value: "land", label: "Land" },
] as const;

interface MapPageClientProps {
  listings: Listing[];
  initialSector: string;
  initialListingType?: string;
  initialCity?: string;
}

function formatPrice(listing: Listing): string {
  const isForLease =
    listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  if (isForLease && listing.leasePricePerSf != null && listing.leaseType) {
    return `$${Number(listing.leasePricePerSf).toLocaleString()}/SF ${listing.leaseType}`;
  }
  if (listing.price != null) return `$${listing.price.toLocaleString()}`;
  if (listing.investmentMetrics?.price != null)
    return `$${listing.investmentMetrics.price.toLocaleString()}`;
  return "—";
}

function formatCapRate(listing: Listing): string {
  if (listing.investmentMetrics?.capRate != null)
    return `${(listing.investmentMetrics.capRate * 100).toFixed(1)}%`;
  return "-";
}

export default function MapPageClient({
  listings,
  initialSector,
  initialListingType = "",
  initialCity = "",
}: MapPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSector, setCurrentSector] = useState(
    () => (initialSector?.toLowerCase() === "all" || !initialSector ? "" : initialSector.toLowerCase())
  );
  const [listingTypeFilter, setListingTypeFilter] = useState(initialListingType);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const sector = searchParams.get("sector")?.toLowerCase() ?? "";
    setCurrentSector(sector);
    setListingTypeFilter(searchParams.get("listingType") ?? "");
    setCityFilter(searchParams.get("city") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = listings.filter((l) => l.status !== "Sold");
    const active = currentSector === "all" || !currentSector;
    if (!active) {
      list = list.filter((l) => l.propertyType.toLowerCase() === currentSector);
    }
    if (listingTypeFilter) {
      list = list.filter((l) => l.listingType === listingTypeFilter);
    }
    if (cityFilter.trim()) {
      const c = cityFilter.trim().toLowerCase();
      list = list.filter((l) => l.city.toLowerCase().includes(c));
    }
    return list;
  }, [listings, currentSector, listingTypeFilter, cityFilter]);

  function handleSectorChange(value: string) {
    const next = value === "all" ? "" : value;
    setCurrentSector(next);
    const p = new URLSearchParams(searchParams.toString());
    if (next) p.set("sector", next);
    else p.delete("sector");
    const path = p.toString() ? `/map?${p.toString()}` : "/map";
    router.replace(path, { scroll: false });
  }

  const isAllActive = currentSector === "all" || !currentSector;

  return (
    <div className="relative flex h-[calc(100vh-6rem)] w-full flex-col overflow-hidden sm:h-[calc(100vh-5rem)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="relative min-w-0 flex-1">
          <div className="h-full w-full">
            <ListingsMap
              listings={filtered}
              selectedListing={selectedListing}
              onSelectListing={setSelectedListing}
            />
          </div>
        </div>

        {/* Sidebar Listings */}
        <aside className="flex w-full flex-col border-l border-[var(--border)] bg-[var(--surface)] md:w-[420px] lg:w-[480px]">
          <div className="border-b border-[var(--border)] p-6">
            <h3 className="text-lg font-bold text-[var(--charcoal)]">
              Commercial Listings
            </h3>
            <p className="mt-1 text-sm text-[var(--charcoal-light)]">
              {filtered.length} {filtered.length === 1 ? "Property" : "Properties"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SECTOR_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSectorChange(value)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    value === "all"
                      ? isAllActive
                        ? "bg-[var(--navy)] text-white"
                        : "bg-[var(--surface-muted)] text-[var(--charcoal-light)] hover:bg-[var(--surface-hover)]"
                      : currentSector === value
                        ? "bg-[var(--navy)] text-white"
                        : "bg-[var(--surface-muted)] text-[var(--charcoal-light)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
            {filtered.length === 0 ? (
              <p className="text-[var(--charcoal-light)]">
                No listings match this sector. Try another filter.
              </p>
            ) : (
              filtered.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.slug}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 transition-colors hover:border-[var(--navy)]/30"
                  onClick={() => setSelectedListing(listing)}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <span className="absolute left-3 top-3 z-10 rounded px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      {listing.propertyType}
                    </span>
                    {listing.heroImage.startsWith("http") ||
                    listing.heroImage.startsWith("/") ? (
                      <Image
                        src={listing.heroImage}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="480px"
                      />
                    ) : (
                      <div className="placeholder-img h-full w-full" />
                    )}
                    <span className="absolute bottom-3 right-3 z-10 rounded bg-[var(--navy)]/90 px-3 py-1.5 text-xs font-bold text-white">
                      {formatPrice(listing)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-bold text-[var(--charcoal)]">
                      {listing.title}
                    </h4>
                    <p className="mt-1 text-xs text-[var(--charcoal-light)]">
                      {listing.address}, {listing.city}, {listing.state}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2 border-y border-[var(--border)] py-3">
                      <div className="text-center">
                        <p className="text-[10px] uppercase text-[var(--charcoal-light)]">
                          Cap Rate
                        </p>
                        <p className="text-sm font-bold text-[var(--navy)]">
                          {formatCapRate(listing)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase text-[var(--charcoal-light)]">
                          Sq Ft
                        </p>
                        <p className="text-sm font-bold text-[var(--charcoal)]">
                          {(listing.squareFeet ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase text-[var(--charcoal-light)]">
                          Occupancy
                        </p>
                        <p className="text-sm font-bold text-[var(--charcoal)]">
                          {listing.occupancy ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
