"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROPERTY_TYPES } from "@/types/listing";

type SectorName = (typeof PROPERTY_TYPES)[number];

const DEFAULT_OVERLAY = "from-black/80 via-black/45 to-black/25";
/** Busy aerials: keep more photo visible while text stays readable. */
const LIGHT_OVERLAY = "from-black/58 via-black/28 to-black/12";

const SECTOR_COPY: Record<
  SectorName,
  {
    tagline: string;
    /** Set when a hero photo exists in `public/images/market-sectors/`. */
    imageSrc?: string;
    /** Optional `bg-gradient-to-t` stops; defaults to `DEFAULT_OVERLAY`. */
    overlayClassName?: string;
  }
> = {
  Retail: {
    tagline:
      "Strip centers, outparcels, and high-visibility locations built for traffic, tenancy, and durable cash flow.",
    imageSrc: "/images/market-sectors/retail.png",
  },
  Industrial: {
    tagline: "Flex, warehouse, and logistics facilities aligned with how goods and services move today.",
    imageSrc: "/images/market-sectors/industrial.png",
    overlayClassName: LIGHT_OVERLAY,
  },
  Office: {
    tagline: "Workspace and campus assets for companies growing their footprint in Central Ohio.",
    imageSrc: "/images/market-sectors/office.png",
  },
  Multifamily: {
    tagline: "Investment and workforce housing—from garden wrap to midrise—mapped with institutional rigor.",
    imageSrc: "/images/market-sectors/multifamily.png",
    overlayClassName: LIGHT_OVERLAY,
  },
  Land: {
    tagline: "Assemblage, entitlement, and development sites with clear paths from dirt to value.",
    imageSrc: "/images/market-sectors/land-v2.png",
  },
  Specialty: {
    tagline: "Niche product where the operator story matters as much as the dirt and the deal.",
    imageSrc: "/images/market-sectors/specialty.png",
  },
  Business: {
    tagline: "Operating companies and owner-user opportunities beyond a simple lease or sale memorandum.",
    imageSrc: "/images/market-sectors/business.png",
    overlayClassName: LIGHT_OVERLAY,
  },
  Residential: {
    tagline: "Single-family and residential inventory when your mandate crosses into living, not just working.",
    imageSrc: "/images/market-sectors/residential.png",
  },
};

export default function MarketSectors() {
  const [active, setActive] = useState<SectorName>("Retail");

  return (
    <section aria-labelledby="market-sectors-heading" className="relative z-10 border-b border-[var(--border)] bg-black">
      <h2 id="market-sectors-heading" className="sr-only">
        Market sectors
      </h2>

      <div className="relative min-h-[min(88vh,900px)] w-full overflow-hidden">
        {PROPERTY_TYPES.map((name) => {
          const { tagline, imageSrc, overlayClassName } = SECTOR_COPY[name];
          const isActive = active === name;
          const href = `/map?sector=${encodeURIComponent(name.toLowerCase())}`;

          return (
            <div
              key={name}
              role="tabpanel"
              id={`sector-panel-${name}`}
              aria-labelledby={`sector-tab-${name}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${isActive ? "z-[1] opacity-100" : "z-0 opacity-0 pointer-events-none"}`}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={name === "Retail"}
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#243047] to-[#121820]"
                  aria-hidden
                />
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${overlayClassName ?? DEFAULT_OVERLAY}`}
                aria-hidden
              />
              <div className="relative z-10 flex min-h-[min(88vh,900px)] flex-col justify-end px-5 pb-14 pt-36 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Market sectors
                </p>
                <h3 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {name}
                </h3>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
                  {tagline}
                </p>
                <Link
                  href={href}
                  className="group mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
                >
                  Explore on map
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] bg-gradient-to-b from-black/55 to-transparent pb-16 pt-4 sm:pt-5">
          <div className="pointer-events-auto mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              role="tablist"
              aria-label="Property types"
              className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center [&::-webkit-scrollbar]:hidden"
            >
              {PROPERTY_TYPES.map((name) => {
                const selected = active === name;
                return (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    id={`sector-tab-${name}`}
                    aria-selected={selected}
                    aria-controls={`sector-panel-${name}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(name)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors sm:text-[13px] ${
                      selected
                        ? "bg-white text-[var(--charcoal)]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
