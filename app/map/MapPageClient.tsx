"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ListingsMap from "@/components/listings/ListingsMap";
import { formatListingDisplayPrice } from "@/lib/format-listing-display-price";
import { getListingSpecTrio } from "@/lib/listing-spec-trio";
import type { Listing } from "@/types/listing";

const LISTING_KIND_FILTERS = [
  { value: "", label: "All" },
  { value: "For Sale", label: "For Sale" },
  { value: "For Lease", label: "For Lease" },
] as const;

const SECTOR_FILTERS = [
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "office", label: "Office" },
  { value: "multifamily", label: "Multifamily" },
  { value: "land", label: "Land" },
  { value: "specialty", label: "Specialty" },
  { value: "business", label: "Business" },
  { value: "residential", label: "Residential" },
] as const;

/** Matches PropertyTypeTag / globals --property-* (residential uses pillBtn, not tint) */
type SectorWithTint = Exclude<(typeof SECTOR_FILTERS)[number]["value"], "residential">;
const MAP_SECTOR_COLOR_VAR: Record<SectorWithTint, string> = {
  retail: "var(--property-retail)",
  industrial: "var(--property-industrial)",
  office: "var(--property-office)",
  multifamily: "var(--property-multifamily)",
  land: "var(--property-land)",
  specialty: "var(--property-specialty)",
  business: "var(--property-business)",
};

interface MapPageClientProps {
  listings: Listing[];
  initialSector: string;
  initialListingType?: string;
  initialCity?: string;
}

/** Scroll `node` to the top of `container` only (does not scroll the window). */
function scrollNodeToTopWithin(container: HTMLElement, node: HTMLElement): void {
  const top =
    node.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;
  container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedListing && !filtered.some((l) => l.id === selectedListing.id)) {
      setSelectedListing(null);
    }
  }, [filtered, selectedListing]);

  useEffect(() => {
    const container = sidebarScrollRef.current;
    if (!selectedListing || !container) return;
    const node = container.querySelector(`[data-map-listing="${selectedListing.id}"]`);
    if (node instanceof HTMLElement) {
      scrollNodeToTopWithin(container, node);
    }
  }, [selectedListing]);

  function handleSectorChange(value: string) {
    const turningOff = currentSector === value;
    const next = turningOff ? "" : value;
    setCurrentSector(next);
    const p = new URLSearchParams(searchParams.toString());
    if (next) p.set("sector", next);
    else p.delete("sector");
    const path = p.toString() ? `/map?${p.toString()}` : "/map";
    router.replace(path, { scroll: false });
  }

  function handleListingKindChange(value: string) {
    setListingTypeFilter(value);
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set("listingType", value);
    else p.delete("listingType");
    const path = p.toString() ? `/map?${p.toString()}` : "/map";
    router.replace(path, { scroll: false });
  }

  const pillBtn = (active: boolean) =>
    `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
      active
        ? "bg-[var(--navy)] text-white"
        : "bg-[var(--surface-muted)] text-[var(--charcoal-light)] hover:bg-[var(--surface-hover)]"
    }`;

  return (
    <div className="relative flex h-[calc(100vh-9rem)] w-full max-h-[820px] flex-col overflow-hidden sm:h-[calc(100vh-8rem)] md:max-h-[760px]">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Map */}
        <div className="relative min-w-0 flex-1">
          <div className="h-full w-full">
            <ListingsMap listings={filtered} onSelectListing={setSelectedListing} />
          </div>
        </div>

        {/* Sidebar Listings */}
        <aside className="flex w-full flex-col border-l border-[var(--border)] bg-[var(--surface)] md:w-[420px] lg:w-[480px]">
          <div className="border-b border-[var(--border)] px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-wrap gap-2">
              {LISTING_KIND_FILTERS.map(({ value, label }) => {
                const active =
                  value === "" ? !listingTypeFilter : listingTypeFilter === value;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleListingKindChange(value)}
                    className={pillBtn(active)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--charcoal-light)]">
              Type
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SECTOR_FILTERS.map(({ value, label }) => {
                const active = currentSector === value;
                if (value === "residential") {
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSectorChange(value)}
                      className={pillBtn(active)}
                    >
                      {label}
                    </button>
                  );
                }
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSectorChange(value)}
                    data-active={active ? "true" : undefined}
                    className="map-sector-pill rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
                    style={{ "--sector": MAP_SECTOR_COLOR_VAR[value] } as CSSProperties}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            ref={sidebarScrollRef}
            className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
          >
            {filtered.length === 0 ? (
              <p className="text-[var(--charcoal-light)]">
                No listings match these filters. Try adjusting your selection.
              </p>
            ) : (
              filtered.map((listing) => {
                const specs = getListingSpecTrio(listing);
                return (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.slug}`}
                    data-map-listing={listing.id}
                    className="group block scroll-mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 transition-colors hover:border-[var(--navy)]/30"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <div className="relative aspect-[4/3] w-full min-h-[9rem] overflow-hidden sm:min-h-[10rem]">
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
                      <span className="absolute bottom-3 right-3 z-10 rounded-md bg-[var(--navy)]/90 px-3 py-1.5 text-xs font-bold text-white sm:text-sm">
                        {formatListingDisplayPrice(listing) ?? "—"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-bold text-[var(--charcoal)]">
                        {listing.title}
                      </h4>
                      <p className="mt-1 text-xs text-[var(--charcoal-light)]">
                        {listing.address}, {listing.city}, {listing.state}
                      </p>
                      <div
                        className={`mt-3 grid gap-2 border-y border-[var(--border)] py-3 ${
                          specs.length > 3 ? "grid-cols-2" : "grid-cols-3"
                        }`}
                      >
                        {specs.map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[10px] uppercase text-[var(--charcoal-light)]">
                              {label}
                            </p>
                            <p
                              className={`text-sm font-bold ${
                                label === "Cap Rate" ? "text-[var(--navy)]" : "text-[var(--charcoal)]"
                              }`}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
