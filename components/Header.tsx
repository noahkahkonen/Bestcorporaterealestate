"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SERVICES_MENU_CLOSE_DELAY_MS = 280;
import HeaderServicesFlyout from "@/components/services/HeaderServicesFlyout";
import { SERVICE_GROUPS } from "@/lib/service-groups";
import { getServiceBySlug } from "@/lib/services";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearServicesMenuCloseTimer = () => {
    if (servicesMenuCloseTimerRef.current) {
      clearTimeout(servicesMenuCloseTimerRef.current);
      servicesMenuCloseTimerRef.current = null;
    }
  };

  const openServicesMenu = () => {
    clearServicesMenuCloseTimer();
    setOpenDropdown("services");
  };

  const scheduleServicesMenuClose = () => {
    clearServicesMenuCloseTimer();
    servicesMenuCloseTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
      servicesMenuCloseTimerRef.current = null;
    }, SERVICES_MENU_CLOSE_DELAY_MS);
  };

  useEffect(() => () => clearServicesMenuCloseTimer(), []);

  const isListings = pathname === "/listings" || pathname === "/map";
  const isServices = pathname === "/services" || pathname.startsWith("/services/");
  const isTeam = pathname === "/team";
  const isNews = pathname === "/news";

  const linkClass = (active: boolean) =>
    `text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
      active ? "text-[var(--navy)] border-b-2 border-[var(--accent)] pb-1" : "text-[var(--charcoal-light)] hover:text-[var(--navy)]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--navy)]/10 bg-white">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-8 lg:gap-10">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/best-logo.png"
              alt="Best Corporate Real Estate"
              width={180}
              height={60}
              className="h-10 w-auto"
              priority
              unoptimized
            />
          </Link>

        <nav className="hidden min-w-0 lg:flex lg:items-center lg:gap-6">
          <Link href="/" className={`px-2 py-2 ${linkClass(pathname === "/")}`}>
            Home
          </Link>

          <Link href="/map" className={`px-2 py-2 ${linkClass(isListings)}`}>
            Listings
          </Link>

          <div className="relative" onMouseEnter={openServicesMenu} onMouseLeave={scheduleServicesMenuClose}>
            <Link
              href="/services"
              className={`flex items-center gap-0.5 px-2 py-2 ${linkClass(isServices)}`}
              aria-expanded={openDropdown === "services"}
              aria-haspopup="true"
            >
              Services
              <svg className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            {openDropdown === "services" && (
              <div className="fixed inset-x-0 top-[calc(4.25rem+1px)] z-[60] hidden pt-5 -mt-5 lg:block">
                <HeaderServicesFlyout />
              </div>
            )}
          </div>

          <Link href="/team" className={`px-2 py-2 ${linkClass(isTeam)}`}>
            Team
          </Link>

          <Link href="/news" className={`px-2 py-2 ${linkClass(isNews)}`}>
            News
          </Link>
        </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/contact"
            className="hidden bg-[var(--navy)] px-5 py-2.5 font-bold text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[var(--navy-light)] lg:inline-block"
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

            <Link
              href="/map"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
              onClick={() => setMobileOpen(false)}
            >
              Listings
            </Link>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-lg">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-[var(--navy)]"
                onClick={() => setMobileServicesOpen((o) => !o)}
                aria-expanded={mobileServicesOpen}
              >
                <span className="uppercase tracking-wider">Services</span>
                <svg
                  className={`h-4 w-4 text-[var(--accent)] transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/40 p-4 space-y-5">
                  <Link
                    href="/services"
                    className="flex items-center gap-3 rounded-lg bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileServicesOpen(false);
                    }}
                  >
                    Services overview
                  </Link>
                  {SERVICE_GROUPS.map((g) => (
                    <div key={g.id}>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--charcoal-light)]">
                        {g.label}
                      </p>
                      <div className="space-y-2">
                        {g.items.map((item) => {
                          const svc = getServiceBySlug(item.slug);
                          if (!svc) return null;
                          return (
                            <Link
                              key={item.slug}
                              href={`/services/${item.slug}`}
                              className="flex gap-3 rounded-lg border border-[var(--border)] bg-white p-3 transition-colors hover:bg-[var(--surface-muted)]"
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileServicesOpen(false);
                              }}
                            >
                              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={item.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[var(--charcoal)]">{svc.title}</p>
                                <p className="mt-0.5 text-xs text-[var(--charcoal-light)] line-clamp-2">{item.cardSummary}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
