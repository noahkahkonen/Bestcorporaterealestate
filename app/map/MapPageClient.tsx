"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ListingsMap from "@/components/listings/ListingsMap";
import { formatListingDisplayPrice } from "@/lib/format-listing-display-price";
import { getListingEstimatedMonthlyRent } from "@/lib/listing-estimated-monthly-rent";
import { getListingSpecTrio } from "@/lib/listing-spec-trio";
import type { Listing } from "@/types/listing";
import NnnChargesInfoTag from "@/components/NnnChargesInfoTag";

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
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialMinRent?: string;
  initialMaxRent?: string;
  initialMinSqFt?: string;
  initialMaxSqFt?: string;
  initialMinAcres?: string;
  initialMaxAcres?: string;
}

function parseNonNegInt(s: string | null | undefined): number | null {
  if (s == null || String(s).trim() === "") return null;
  const n = parseInt(String(s), 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function parseNonNegNumber(s: string | null | undefined): number | null {
  if (s == null || String(s).trim() === "") return null;
  const n = parseFloat(String(s));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function citiesByFrequency(listings: Listing[]): { city: string; count: number }[] {
  const counts: Record<string, number> = {};
  listings.filter((l) => l.status !== "Sold").forEach((l) => {
    counts[l.city] = (counts[l.city] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city));
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
  initialMinPrice = "",
  initialMaxPrice = "",
  initialMinRent = "",
  initialMaxRent = "",
  initialMinSqFt = "",
  initialMaxSqFt = "",
  initialMinAcres = "",
  initialMaxAcres = "",
}: MapPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSector, setCurrentSector] = useState(
    () => (initialSector?.toLowerCase() === "all" || !initialSector ? "" : initialSector.toLowerCase())
  );
  const [listingTypeFilter, setListingTypeFilter] = useState(initialListingType);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const filtersPopoverRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  const [priceMinInput, setPriceMinInput] = useState(initialMinPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(initialMaxPrice);
  const [rentMinInput, setRentMinInput] = useState(initialMinRent);
  const [rentMaxInput, setRentMaxInput] = useState(initialMaxRent);
  const [sqFtMinInput, setSqFtMinInput] = useState(initialMinSqFt);
  const [sqFtMaxInput, setSqFtMaxInput] = useState(initialMaxSqFt);
  const [acresMinInput, setAcresMinInput] = useState(initialMinAcres);
  const [acresMaxInput, setAcresMaxInput] = useState(initialMaxAcres);

  useEffect(() => {
    const sector = searchParams.get("sector")?.toLowerCase() ?? "";
    setCurrentSector(sector);
    setListingTypeFilter(searchParams.get("listingType") ?? "");
    setCityFilter(searchParams.get("city") ?? "");
    setPriceMinInput(searchParams.get("minPrice") ?? "");
    setPriceMaxInput(searchParams.get("maxPrice") ?? "");
    setRentMinInput(searchParams.get("minRent") ?? "");
    setRentMaxInput(searchParams.get("maxRent") ?? "");
    setSqFtMinInput(searchParams.get("minSqFt") ?? "");
    setSqFtMaxInput(searchParams.get("maxSqFt") ?? "");
    setAcresMinInput(searchParams.get("minAcres") ?? "");
    setAcresMaxInput(searchParams.get("maxAcres") ?? "");
  }, [searchParams]);

  const cityOptions = useMemo(() => citiesByFrequency(listings), [listings]);

  const commitNumericFiltersToUrl = () => {
    const p = new URLSearchParams(searchParams.toString());
    const setOrDel = (key: string, raw: string) => {
      const t = raw.trim();
      if (!t) p.delete(key);
      else p.set(key, t);
    };
    setOrDel("minPrice", priceMinInput);
    setOrDel("maxPrice", priceMaxInput);
    setOrDel("minRent", rentMinInput);
    setOrDel("maxRent", rentMaxInput);
    setOrDel("minSqFt", sqFtMinInput);
    setOrDel("maxSqFt", sqFtMaxInput);
    setOrDel("minAcres", acresMinInput);
    setOrDel("maxAcres", acresMaxInput);
    const path = p.toString() ? `/map?${p.toString()}` : "/map";
    router.replace(path, { scroll: false });
  };

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
      list = list.filter((l) => l.city.toLowerCase() === c);
    }

    const minPrice = parseNonNegNumber(searchParams.get("minPrice"));
    const maxPrice = parseNonNegNumber(searchParams.get("maxPrice"));
    const minRent = parseNonNegNumber(searchParams.get("minRent"));
    const maxRent = parseNonNegNumber(searchParams.get("maxRent"));
    const minSqFt = parseNonNegInt(searchParams.get("minSqFt"));
    const maxSqFt = parseNonNegInt(searchParams.get("maxSqFt"));
    const minAcres = parseNonNegNumber(searchParams.get("minAcres"));
    const maxAcres = parseNonNegNumber(searchParams.get("maxAcres"));

    if (minPrice != null) {
      list = list.filter((l) => l.price != null && l.price >= minPrice);
    }
    if (maxPrice != null) {
      list = list.filter((l) => l.price != null && l.price <= maxPrice);
    }
    if (minRent != null) {
      list = list.filter((l) => {
        const r = getListingEstimatedMonthlyRent(l);
        return r != null && r >= minRent;
      });
    }
    if (maxRent != null) {
      list = list.filter((l) => {
        const r = getListingEstimatedMonthlyRent(l);
        return r != null && r <= maxRent;
      });
    }

    if (minSqFt != null) {
      list = list.filter((l) => l.squareFeet != null && l.squareFeet >= minSqFt);
    }
    if (maxSqFt != null) {
      list = list.filter((l) => l.squareFeet != null && l.squareFeet <= maxSqFt);
    }
    if (minAcres != null) {
      list = list.filter((l) => l.acreage != null && l.acreage >= minAcres);
    }
    if (maxAcres != null) {
      list = list.filter((l) => l.acreage != null && l.acreage <= maxAcres);
    }

    return list;
  }, [
    listings,
    currentSector,
    listingTypeFilter,
    cityFilter,
    searchParams,
  ]);

  useEffect(() => {
    if (selectedListing && !filtered.some((l) => l.id === selectedListing.id)) {
      setSelectedListing(null);
    }
  }, [filtered, selectedListing]);

  useEffect(() => {
    if (!filtersPanelOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFiltersPanelOpen(false);
    }
    function onPointerDown(e: MouseEvent) {
      const el = filtersPopoverRef.current;
      if (el && !el.contains(e.target as Node)) setFiltersPanelOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [filtersPanelOpen]);

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

  function handleCityChange(city: string) {
    setCityFilter(city);
    const p = new URLSearchParams(searchParams.toString());
    if (city) p.set("city", city);
    else p.delete("city");
    const path = p.toString() ? `/map?${p.toString()}` : "/map";
    router.replace(path, { scroll: false });
  }

  const pillBtn = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors sm:px-3.5 sm:py-1.5 sm:text-[11px] ${
      active
        ? "bg-[var(--navy)] text-white"
        : "bg-[var(--surface-muted)] text-[var(--charcoal-light)] hover:bg-[var(--surface-hover)]"
    }`;

  const noSpin =
    "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const numInputClass =
    `min-h-[34px] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs tabular-nums text-[var(--charcoal)] placeholder:text-[var(--charcoal-light)]/45 focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)] ${noSpin}`;
  const numInputInline = `${numInputClass} w-[4.5rem] shrink-0 sm:w-[5.25rem]`;
  const numInputSize = `${numInputClass} min-w-[4.5rem] flex-1 sm:max-w-[7rem]`;
  const filterMetaClass =
    "text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--charcoal-light)]";
  const sizeRowLabelClass = "w-[3.25rem] shrink-0 text-[10px] font-medium text-[var(--charcoal-light)]";
  const selectClass =
    "w-full min-h-[34px] rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-2 pr-8 text-xs text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

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
          <div
            ref={filtersPopoverRef}
            className="relative z-20 border-b border-[var(--border)] px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="flex flex-wrap gap-1.5">
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

            <p className={`mt-2.5 ${filterMetaClass} tracking-[0.18em]`}>Type</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
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
                    className="map-sector-pill rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide sm:px-3.5 sm:text-[11px]"
                    style={{ "--sector": MAP_SECTOR_COLOR_VAR[value] } as CSSProperties}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex justify-end">
              <div className="relative w-full min-w-0">
                <div className="flex justify-end">
                  <button
                    type="button"
                    id="map-filters-toggle"
                    aria-expanded={filtersPanelOpen}
                    aria-controls="map-detail-filters-panel"
                    onClick={() => setFiltersPanelOpen((o) => !o)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(0,42,74,0.22)] transition-[filter] hover:brightness-110 active:brightness-95"
                  >
                    Filters
                    <svg
                      className={`h-3 w-3 shrink-0 text-white/90 transition-transform ${filtersPanelOpen ? "-rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {filtersPanelOpen ? (
                  <div
                    id="map-detail-filters-panel"
                    role="region"
                    aria-label="Price, rent, size, and city filters"
                    className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[min(70vh,32rem)] space-y-3 overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.2)] [-webkit-overflow-scrolling:touch] sm:left-auto sm:right-0 sm:w-[min(100%,20rem)]"
                  >
                  <div
                    className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
                    title="List price ($)"
                  >
                    <span className={`${filterMetaClass} whitespace-nowrap`}>Price</span>
                    <input
                      id="map-min-price"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      placeholder="Min"
                      value={priceMinInput}
                      onChange={(e) => setPriceMinInput(e.target.value)}
                      onBlur={commitNumericFiltersToUrl}
                      className={numInputInline}
                      aria-label="Minimum list price"
                    />
                    <input
                      id="map-max-price"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      placeholder="Max"
                      value={priceMaxInput}
                      onChange={(e) => setPriceMaxInput(e.target.value)}
                      onBlur={commitNumericFiltersToUrl}
                      className={numInputInline}
                      aria-label="Maximum list price"
                    />
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
                    title="Estimated monthly rent: (lease $/SF/yr + NNN when applicable) × SF ÷ 12"
                  >
                    <span className={`${filterMetaClass} whitespace-nowrap`}>Rent/mo</span>
                    <input
                      id="map-min-rent"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      placeholder="Min"
                      value={rentMinInput}
                      onChange={(e) => setRentMinInput(e.target.value)}
                      onBlur={commitNumericFiltersToUrl}
                      className={numInputInline}
                      aria-label="Minimum estimated monthly rent"
                    />
                    <input
                      id="map-max-rent"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      placeholder="Max"
                      value={rentMaxInput}
                      onChange={(e) => setRentMaxInput(e.target.value)}
                      onBlur={commitNumericFiltersToUrl}
                      className={numInputInline}
                      aria-label="Maximum estimated monthly rent"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className={`${filterMetaClass} tracking-[0.18em]`}>Size</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:max-w-none">
                        <span className={sizeRowLabelClass}>Sq ft</span>
                        <input
                          id="map-min-sqft"
                          type="number"
                          min={0}
                          inputMode="numeric"
                          placeholder="Min"
                          value={sqFtMinInput}
                          onChange={(e) => setSqFtMinInput(e.target.value)}
                          onBlur={commitNumericFiltersToUrl}
                          className={numInputSize}
                          aria-label="Minimum square feet"
                        />
                        <input
                          id="map-max-sqft"
                          type="number"
                          min={0}
                          inputMode="numeric"
                          placeholder="Max"
                          value={sqFtMaxInput}
                          onChange={(e) => setSqFtMaxInput(e.target.value)}
                          onBlur={commitNumericFiltersToUrl}
                          className={numInputSize}
                          aria-label="Maximum square feet"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:max-w-none">
                        <span className={sizeRowLabelClass}>Acres</span>
                        <input
                          id="map-min-acres"
                          type="number"
                          min={0}
                          step="any"
                          inputMode="decimal"
                          placeholder="Min"
                          value={acresMinInput}
                          onChange={(e) => setAcresMinInput(e.target.value)}
                          onBlur={commitNumericFiltersToUrl}
                          className={numInputSize}
                          aria-label="Minimum acres"
                        />
                        <input
                          id="map-max-acres"
                          type="number"
                          min={0}
                          step="any"
                          inputMode="decimal"
                          placeholder="Max"
                          value={acresMaxInput}
                          onChange={(e) => setAcresMaxInput(e.target.value)}
                          onBlur={commitNumericFiltersToUrl}
                          className={numInputSize}
                          aria-label="Maximum acres"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-3">
                    <label htmlFor="map-filter-city" className={`mb-1 block ${filterMetaClass} tracking-[0.18em]`}>
                      City
                    </label>
                    <select
                      id="map-filter-city"
                      value={cityFilter}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">All cities</option>
                      {cityOptions.map(({ city, count }) => (
                        <option key={city} value={city}>
                          {city} ({count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                ) : null}
              </div>
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
                        {specs.map(({ label, value, nnnChargesInfo }) => (
                          <div key={label} className="text-center">
                            <p className="flex items-center justify-center gap-0.5 text-[10px] uppercase text-[var(--charcoal-light)]">
                              <span>{label}</span>
                              {nnnChargesInfo ? <NnnChargesInfoTag size="compact" /> : null}
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
