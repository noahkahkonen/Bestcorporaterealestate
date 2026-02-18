"use client";

import { useState } from "react";
import type { SitePlanUnit } from "@/types/site-plan";

// Actual image dimensions (1024×682 — verified)
const IMG_W = 1024;
const IMG_H = 682;

const OVERLAY_UNITS = [
  { id: "A", x: 389, y: 249, width: 139, height: 119 },
  { id: "B", x: 531, y: 247, width: 80, height: 114 },
  { id: "C", x: 609, y: 248, width: 83, height: 115 },
];

interface InteractiveSitePlanProps {
  units: SitePlanUnit[];
  imageSrc?: string;
}

export default function InteractiveSitePlan({ units, imageSrc = "/siteplans/Example.png" }: InteractiveSitePlanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Map overlay A→units[0], B→units[1], C→units[2]
  const selectedUnit = activeId && units[OVERLAY_UNITS.findIndex((u) => u.id === activeId)]
    ? units[OVERLAY_UNITS.findIndex((u) => u.id === activeId)]
    : null;

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Match SitePlanPhoto structure exactly — background-image + aspect-ratio for reliable coord alignment */}
      <div
        className="w-full rounded-xl bg-[var(--surface-muted)] bg-cover bg-center bg-no-repeat"
        style={{
          aspectRatio: `${IMG_W} / ${IMG_H}`,
          backgroundImage: `url("${imageSrc}")`,
        }}
        role="img"
        aria-label="Site plan"
      />

      <svg
        className="absolute inset-0 w-full h-full rounded-xl"
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: "none" }}
      >
        <g style={{ pointerEvents: "auto" }}>
          {OVERLAY_UNITS.map((u) => {
            const isSelected = activeId === u.id;
            return (
              <rect
                key={u.id}
                x={u.x}
                y={u.y}
                width={u.width}
                height={u.height}
                rx={10}
                fill={isSelected ? "rgba(4, 120, 87, 0.35)" : "transparent"}
                stroke={isSelected ? "#047857" : "transparent"}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer transition-all duration-200 hover:fill-[rgba(4,120,87,0.2)] hover:stroke-[rgba(4,120,87,0.8)]"
                style={{ pointerEvents: "auto" }}
                onClick={() => setActiveId((prev) => (prev === u.id ? null : u.id))}
              />
            );
          })}
        </g>
      </svg>

      {selectedUnit && (
        <div
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg p-4 sm:p-5"
          role="dialog"
          aria-label={`${selectedUnit.tenantName} details`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--charcoal)] truncate">{selectedUnit.tenantName}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-[var(--muted)]">Use</dt>
                  <dd className="font-medium text-[var(--charcoal)]">{selectedUnit.use}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Square footage</dt>
                  <dd className="text-[var(--charcoal)]">{selectedUnit.sizeSf.toLocaleString()} SF</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Rent PSF NNN</dt>
                  <dd className="text-[var(--charcoal)]">{selectedUnit.rentPsfNnn}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Lease expiration</dt>
                  <dd className="text-[var(--charcoal)]">{selectedUnit.leaseExpiration}</dd>
                </div>
              </dl>
            </div>
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--charcoal)] transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
