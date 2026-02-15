"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/types/listing";

const SERVICE_LINKS = [
  { href: "/services#seller-representation", label: "Seller Representation" },
  { href: "/services#landlord-representation", label: "Landlord Representation" },
  { href: "/services#buyer-representation", label: "Buyer Representation" },
  { href: "/services#tenant-representation", label: "Tenant Representation" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isListings = pathname === "/listings";
  const isServices = pathname === "/services";
  const isTeam = pathname === "/team";
  const isNews = pathname === "/news";

  const linkClass = (active: boolean) =>
    `text-sm font-medium transition-colors hover:text-[var(--navy)] ${
      active ? "text-[var(--navy)]" : "text-[var(--charcoal-light)]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-[var(--navy)]"
        >
          <span className="h-8 w-8 rounded bg-[var(--navy)]" aria-hidden />
          Best Corporate Real Estate
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
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
              <div className="absolute left-0 top-full pt-1">
                <div className="min-w-[220px] rounded-lg border border-[var(--border)] bg-white py-2 shadow-lg">
                  <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Listing type
                  </p>
                  {LISTING_TYPES.map((type) => (
                    <Link
                      key={type}
                      href={`/listings?listingType=${encodeURIComponent(type)}`}
                      className="block px-4 py-2 text-sm text-[var(--charcoal)] hover:bg-gray-50 hover:text-[var(--navy)]"
                    >
                      {type}
                    </Link>
                  ))}
                  <div className="my-2 border-t border-[var(--border)]" />
                  <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    By asset type
                  </p>
                  {PROPERTY_TYPES.map((type) => (
                    <Link
                      key={type}
                      href={`/listings?propertyType=${encodeURIComponent(type)}`}
                      className="block px-4 py-2 text-sm text-[var(--charcoal)] hover:bg-gray-50 hover:text-[var(--navy)]"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("services")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-0.5 px-3 py-2 ${linkClass(isServices)}`}
              aria-expanded={openDropdown === "services"}
              aria-haspopup="true"
            >
              Services
              <svg className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "services" && (
              <div className="absolute left-0 top-full pt-1">
                <div className="min-w-[220px] rounded-lg border border-[var(--border)] bg-white py-2 shadow-lg">
                  {SERVICE_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-sm text-[var(--charcoal)] hover:bg-gray-50 hover:text-[var(--navy)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Team dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("team")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-0.5 px-3 py-2 ${linkClass(isTeam)}`}
              aria-expanded={openDropdown === "team"}
              aria-haspopup="true"
            >
              Team
              <svg className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "team" && (
              <div className="absolute left-0 top-full pt-1">
                <div className="min-w-[180px] rounded-lg border border-[var(--border)] bg-white py-2 shadow-lg">
                  <Link
                    href="/team"
                    className="block px-4 py-2 text-sm text-[var(--charcoal)] hover:bg-gray-50 hover:text-[var(--navy)]"
                  >
                    Our Team
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* News dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("news")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-0.5 px-3 py-2 ${linkClass(isNews)}`}
              aria-expanded={openDropdown === "news"}
              aria-haspopup="true"
            >
              News
              <svg className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "news" && (
              <div className="absolute left-0 top-full pt-1">
                <div className="min-w-[180px] rounded-lg border border-[var(--border)] bg-white py-2 shadow-lg">
                  <Link
                    href="/news"
                    className="block px-4 py-2 text-sm text-[var(--charcoal)] hover:bg-gray-50 hover:text-[var(--navy)]"
                  >
                    News & Insights
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`px-3 py-2 ${linkClass(pathname === "/contact")}`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden rounded-md bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 md:inline-block"
          >
            Contact Us
          </Link>

          <button
            type="button"
            className="rounded p-2 text-[var(--charcoal)] hover:bg-gray-100 md:hidden"
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

      {/* Mobile menu with dropdowns */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className="rounded px-3 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <div className="rounded px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Listings</p>
              <Link href="/listings" className="block py-1.5 pl-2 text-sm text-[var(--charcoal)] hover:text-[var(--navy)]" onClick={() => setMobileOpen(false)}>All Listings</Link>
              <p className="mt-2 text-xs text-[var(--muted)]">By listing type</p>
              {LISTING_TYPES.map((type) => (
                <Link
                  key={type}
                  href={`/listings?listingType=${encodeURIComponent(type)}`}
                  className="block py-1.5 pl-2 text-sm text-[var(--charcoal)] hover:text-[var(--navy)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {type}
                </Link>
              ))}
              <p className="mt-2 text-xs text-[var(--muted)]">By asset type</p>
              {PROPERTY_TYPES.map((type) => (
                <Link
                  key={type}
                  href={`/listings?propertyType=${encodeURIComponent(type)}`}
                  className="block py-1.5 pl-2 text-sm text-[var(--charcoal)] hover:text-[var(--navy)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {type}
                </Link>
              ))}
            </div>
            <div className="rounded px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Services</p>
              {SERVICE_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-1.5 pl-2 text-sm text-[var(--charcoal)] hover:text-[var(--navy)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link href="/team" className="rounded px-3 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Team</Link>
            <Link href="/news" className="rounded px-3 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-gray-50" onClick={() => setMobileOpen(false)}>News</Link>
            <Link href="/contact" className="rounded px-3 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link
              href="/contact"
              className="mt-2 rounded-md bg-[var(--navy)] px-4 py-2.5 text-center text-sm font-medium text-white"
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
