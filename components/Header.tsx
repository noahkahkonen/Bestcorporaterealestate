"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/types/listing";
import { propertyTypeToMapSector } from "@/lib/property-type-to-map-sector";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileListingsOpen, setMobileListingsOpen] = useState(false);

  const isListings = pathname === "/listings" || pathname === "/map";
  const isServices = pathname === "/services";
  const isTeam = pathname === "/team";
  const isNews = pathname === "/news";

  const linkClass = (active: boolean) =>
    `text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
      active ? "text-[var(--navy)] border-b-2 border-[var(--accent)] pb-1" : "text-[var(--charcoal-light)] hover:text-[var(--navy)]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--navy)]/10 bg-white">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/best-logo.png"
              alt="Best Corporate Real Estate"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
              unoptimized
            />
          </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-10">
          <Link href="/" className={`px-3 py-2 ${linkClass(pathname === "/")}`}>
            Home
          </Link>

          {/* Listings dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("listings")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-0.5 px-3 py-2 ${linkClass(isListings)}`}
              aria-expanded={openDropdown === "listings"}
              aria-haspopup="true"
            >
              Listings
              <svg className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "listings" && (
              <div className="absolute left-0 top-full pt-3">
                <div className="min-w-[420px] overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-2xl shadow-[var(--navy)]/10">
                  {/* Header */}
                  <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]/60 px-5 py-3">
                    <Link
                      href="/map"
                      className="group flex w-full items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)] transition-colors hover:text-[var(--navy)]"
                    >
                      View all
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Columns */}
                  <div className="grid grid-cols-2 gap-0">
                    {/* Listing type */}
                    <div className="border-r border-[var(--border)] p-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--charcoal-light)]">
                        Listing Type
                      </p>
                      <ul className="space-y-0.5">
                        {LISTING_TYPES.map((type) => (
                          <li key={type}>
                            <Link
                              href={`/map?listingType=${encodeURIComponent(type)}`}
                              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--navy)]/5 hover:text-[var(--navy)]"
                            >
                              <span className="flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] opacity-60 group-hover:opacity-100 group-hover:ring-2 group-hover:ring-[var(--accent)]/30" />
                              {type}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Asset type */}
                    <div className="p-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--charcoal-light)]">
                        Asset Type
                      </p>
                      <ul className="space-y-0.5">
                        {PROPERTY_TYPES.map((type) => {
                          const colorVar = type === "Retail" ? "var(--property-retail)"
                            : type === "Industrial" ? "var(--property-industrial)"
                            : type === "Office" ? "var(--property-office)"
                            : type === "Multifamily" ? "var(--property-multifamily)"
                            : type === "Land" ? "var(--property-land)"
                            : type === "Specialty" ? "var(--property-specialty)"
                            : "var(--property-business)";
                          const sector = propertyTypeToMapSector(type);
                          const href = sector ? `/map?sector=${sector}` : "/map";
                          return (
                            <li key={type}>
                              <Link
                                href={href}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--navy)]/5 hover:text-[var(--navy)]"
                              >
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full transition-all group-hover:scale-125 group-hover:ring-2 group-hover:ring-offset-1"
                                  style={{ backgroundColor: colorVar }}
                                />
                                {type}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Footer accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-[var(--navy)] via-[var(--accent)] to-[var(--navy)]" />
                </div>
              </div>
            )}
          </div>

          <Link href="/services" className={`px-3 py-2 ${linkClass(isServices)}`}>
            Services
          </Link>

          <Link href="/team" className={`px-3 py-2 ${linkClass(isTeam)}`}>
            Team
          </Link>

          <Link href="/news" className={`px-3 py-2 ${linkClass(isNews)}`}>
            News
          </Link>
        </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden bg-[var(--navy)] px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[var(--navy-light)] lg:inline-block"
          >
            Contact Us
          </Link>

          <button
            type="button"
            className="rounded p-2 text-[var(--charcoal)] hover:bg-[var(--surface-muted)] lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu with submenus */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-0">
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            {/* Listings - expandable */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-lg">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-[var(--navy)]"
                onClick={() => setMobileListingsOpen((o) => !o)}
                aria-expanded={mobileListingsOpen}
              >
                <span className="uppercase tracking-wider">Browse Listings</span>
                <svg
                  className={`h-4 w-4 text-[var(--accent)] transition-transform ${mobileListingsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileListingsOpen && (
                <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/40 p-4 space-y-4">
                  <Link
                    href="/map"
                    className="flex items-center gap-3 rounded-lg bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    View all listings
                  </Link>
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--charcoal-light)]">
                      Listing Type
                    </p>
                    <div className="space-y-0.5">
                      {LISTING_TYPES.map((type) => (
                        <Link
                          key={type}
                          href={`/map?listingType=${encodeURIComponent(type)}`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] transition-colors hover:bg-white hover:text-[var(--navy)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                          {type}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--charcoal-light)]">
                      Asset Type
                    </p>
                    <div className="space-y-0.5">
                      {PROPERTY_TYPES.map((type) => {
                        const colorVar = type === "Retail" ? "var(--property-retail)"
                          : type === "Industrial" ? "var(--property-industrial)"
                          : type === "Office" ? "var(--property-office)"
                          : type === "Multifamily" ? "var(--property-multifamily)"
                          : type === "Land" ? "var(--property-land)"
                          : type === "Specialty" ? "var(--property-specialty)"
                          : "var(--property-business)";
                        const sector = propertyTypeToMapSector(type);
                        const href = sector ? `/map?sector=${sector}` : "/map";
                        return (
                          <Link
                            key={type}
                            href={href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] transition-colors hover:bg-white hover:text-[var(--navy)]"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colorVar }} />
                            {type}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/services"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/team"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/news"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              News
            </Link>
            <Link
              href="/contact"
              className="mt-2 rounded bg-[var(--navy)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--navy-light)]"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
