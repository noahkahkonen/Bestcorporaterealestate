"use client";

import { useState } from "react";
import type { SitePlanUnit } from "@/types/site-plan";

const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 1000;

// Overlay rects for units 1–3 (from image-map coords: 684,432,929,644 etc.)
const UNIT_RECTS: { id: string; x: number; y: number; width: number; height: number }[] = [
  { id: "1", x: 684, y: 432, width: 245, height: 212 },
  { id: "2", x: 930, y: 429, width: 142, height: 216 },
  { id: "3", x: 1073, y: 431, width: 139, height: 211 },
];

interface SitePlanPhotoProps {
  units: SitePlanUnit[];
  imageSrc: string;
}

export default function SitePlanPhoto({ units, imageSrc }: SitePlanPhotoProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
  const selectedUnit = selectedId ? unitById[selectedId] : null;

  const handleRectClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div
        className="w-full rounded-xl bg-gray-200 bg-cover bg-center bg-no-repeat"
        style={{
          aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
          backgroundImage: `url("${imageSrc}")`,
        }}
        role="img"
        aria-label="Site plan"
      />
      <svg
        className="absolute inset-0 w-full h-full rounded-xl"
        viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: "none" }}
      >
        <g style={{ pointerEvents: "auto" }}>
          {UNIT_RECTS.map((rect) => {
            const unit = unitById[rect.id];
            if (!unit) return null;
            const isHovered = hoveredId === rect.id;
            const isSelected = selectedId === rect.id;
            return (
              <rect
                key={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={isSelected ? "rgba(4, 120, 87, 0.35)" : isHovered ? "rgba(4, 120, 87, 0.2)" : "transparent"}
                stroke={isSelected ? "#047857" : isHovered ? "rgba(4, 120, 87, 0.8)" : "transparent"}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer transition-all duration-200"
                style={{ pointerEvents: "auto", cursor: "pointer" }}
                onMouseEnter={() => setHoveredId(rect.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleRectClick(rect.id)}
                aria-label={`${unit.tenantName} – ${unit.use}`}
              />
            );
          })}
        </g>
      </svg>

      {selectedUnit && (
        <div
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 rounded-xl border border-gray-200 bg-white shadow-lg p-4 sm:p-5"
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
              onClick={() => setSelectedId(null)}
              className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-gray-100 hover:text-[var(--charcoal)] transition-colors"
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
