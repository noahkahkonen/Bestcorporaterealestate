"use client";

import { useState } from "react";
import type { SitePlanUnit } from "@/types/site-plan";

interface SitePlanProps {
  units: SitePlanUnit[];
  roadName?: string;
}

// Kings Highway–style layout: road on west (left), building north (3 units), drive-thru north & east, main parking south
const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 320;
const ROAD_WIDTH = 44;
const SITE_LEFT = 44;
const DRIVE_THRU_TOP = 8;
const BUILDING_TOP = 56;
const BUILDING_HEIGHT = 70;
const BUILDING_BOTTOM = BUILDING_TOP + BUILDING_HEIGHT;
const BUILDING_LEFT = 52;
const BUILDING_WIDTH = 280;
const BUILDING_RIGHT = BUILDING_LEFT + BUILDING_WIDTH;
const DRIVE_THRU_RIGHT = VIEW_WIDTH - 8;
const PARKING_TOP = BUILDING_BOTTOM;
const PARKING_BOTTOM = VIEW_HEIGHT - 8;

// Unit widths by SF ratio (2400 : 1300 : 1300) => 48% : 26% : 26%
const U1_WIDTH = BUILDING_WIDTH * 0.48;
const U2_WIDTH = BUILDING_WIDTH * 0.26;
const U3_WIDTH = BUILDING_WIDTH * 0.26;

export default function SitePlan({ units, roadName = "Kings Highway Cut-Off" }: SitePlanProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
  const selectedUnit = selectedId ? unitById[selectedId] : null;

  const unitPaths: { id: string; d: string }[] = [
    { id: "1", d: `M ${BUILDING_LEFT} ${BUILDING_TOP} L ${BUILDING_LEFT + U1_WIDTH} ${BUILDING_TOP} L ${BUILDING_LEFT + U1_WIDTH} ${BUILDING_BOTTOM} L ${BUILDING_LEFT} ${BUILDING_BOTTOM} Z` },
    { id: "2", d: `M ${BUILDING_LEFT + U1_WIDTH} ${BUILDING_TOP} L ${BUILDING_LEFT + U1_WIDTH + U2_WIDTH} ${BUILDING_TOP} L ${BUILDING_LEFT + U1_WIDTH + U2_WIDTH} ${BUILDING_BOTTOM} L ${BUILDING_LEFT + U1_WIDTH} ${BUILDING_BOTTOM} Z` },
    { id: "3", d: `M ${BUILDING_LEFT + U1_WIDTH + U2_WIDTH} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${BUILDING_BOTTOM} L ${BUILDING_LEFT + U1_WIDTH + U2_WIDTH} ${BUILDING_BOTTOM} Z` },
  ];

  // Parking grid in main lot (south of building)
  const PARK_W = 34;
  const PARK_H = 14;
  const COLS = 8;
  const ROWS = 5;
  const parkSpaces: { x: number; y: number; accessible?: boolean; van?: boolean }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isAcc = row === 0 && (col === 0 || col === 1);
      parkSpaces.push({
        x: BUILDING_LEFT + 4 + col * (PARK_W + 2),
        y: PARKING_TOP + 4 + row * (PARK_H + 2),
        accessible: isAcc,
        van: isAcc && col === 1,
      });
    }
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full max-w-2xl rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--charcoal)]"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
      >
        {/* Road (west boundary – Kings Highway Cut-Off) */}
        <rect x={0} y={0} width={ROAD_WIDTH} height={VIEW_HEIGHT} fill="#4a5568" />
        <text
          x={ROAD_WIDTH / 2}
          y={VIEW_HEIGHT / 2}
          textAnchor="middle"
          className="fill-white text-[10px] font-medium"
          fill="white"
          transform={`rotate(-90, ${ROAD_WIDTH / 2}, ${VIEW_HEIGHT / 2})`}
        >
          {roadName}
        </text>

        {/* Curbing: site perimeter and drive-thru / building / parking edges */}
        <path
          d={`M ${SITE_LEFT} ${DRIVE_THRU_TOP} L ${DRIVE_THRU_RIGHT} ${DRIVE_THRU_TOP} L ${DRIVE_THRU_RIGHT} ${PARKING_BOTTOM} L ${SITE_LEFT} ${PARKING_BOTTOM} Z`}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
        />
        <path
          d={`M ${BUILDING_LEFT} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${BUILDING_BOTTOM} L ${BUILDING_LEFT} ${BUILDING_BOTTOM} Z`}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Drive-thru lane curb (north and east of building) */}
        <path
          d={`M ${BUILDING_LEFT} ${DRIVE_THRU_TOP} L ${BUILDING_LEFT} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${BUILDING_TOP} L ${BUILDING_RIGHT} ${DRIVE_THRU_TOP} L ${DRIVE_THRU_RIGHT} ${DRIVE_THRU_TOP} L ${DRIVE_THRU_RIGHT} ${BUILDING_BOTTOM} L ${BUILDING_RIGHT} ${BUILDING_BOTTOM} L ${BUILDING_RIGHT} ${PARKING_TOP} L ${BUILDING_LEFT} ${PARKING_TOP} L ${BUILDING_LEFT} ${BUILDING_BOTTOM}`}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Drive-thru area (north and east of building) */}
        <rect x={BUILDING_LEFT} y={DRIVE_THRU_TOP} width={BUILDING_WIDTH} height={BUILDING_TOP - DRIVE_THRU_TOP} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x={BUILDING_RIGHT} y={BUILDING_TOP} width={DRIVE_THRU_RIGHT - BUILDING_RIGHT} height={BUILDING_HEIGHT} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />

        {/* Main parking grid */}
        <g fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5">
          {parkSpaces.map((s, i) => (
            <g key={i}>
              <rect
                x={s.x}
                y={s.y}
                width={s.accessible ? PARK_W + 4 : PARK_W}
                height={s.accessible ? PARK_H + 2 : PARK_H}
                rx={1}
                fill={s.accessible ? "#dbeafe" : "#e2e8f0"}
              />
              {s.accessible && (
                <text x={s.x + (s.accessible ? PARK_W + 4 : PARK_W) / 2} y={s.y + (PARK_H + 2) / 2 + 3} textAnchor="middle" className="fill-[var(--charcoal-light)] text-[8px]" fill="currentColor">
                  {s.van ? "VAN" : "♿"}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Building outline */}
        <rect
          x={BUILDING_LEFT}
          y={BUILDING_TOP}
          width={BUILDING_WIDTH}
          height={BUILDING_HEIGHT}
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Unit outlines (hover/click) */}
        {unitPaths.map(({ id, d }) => (
          <path
            key={id}
            d={d}
            fill={hoveredId === id ? "rgba(4, 120, 87, 0.25)" : "rgba(255,255,255,0.6)"}
            stroke={hoveredId === id || selectedId === id ? "#047857" : "#94a3b8"}
            strokeWidth={selectedId === id ? 2.5 : 1}
            className="cursor-pointer transition-colors"
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(id)}
          />
        ))}

        {/* Unit labels */}
        {unitPaths.map(({ id }) => {
          const idx = Number(id);
          const cx = BUILDING_LEFT + (idx === 1 ? U1_WIDTH / 2 : idx === 2 ? U1_WIDTH + U2_WIDTH / 2 : U1_WIDTH + U2_WIDTH + U3_WIDTH / 2);
          const cy = BUILDING_TOP + BUILDING_HEIGHT / 2;
          return (
            <text key={`label-${id}`} x={cx} y={cy} textAnchor="middle" className="pointer-events-none fill-[var(--charcoal-light)] text-[11px] font-medium" dominantBaseline="middle">
              {id}
            </text>
          );
        })}
      </svg>

      {/* Popup */}
      {selectedUnit && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setSelectedId(null)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
            <div className="flex justify-between">
              <h4 className="font-semibold text-[var(--charcoal)]">Unit {selectedUnit.id}</h4>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--charcoal)]"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Tenant</dt>
                <dd className="font-medium text-[var(--charcoal)]">{selectedUnit.tenantName}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Use</dt>
                <dd className="text-[var(--charcoal)]">{selectedUnit.use}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Size</dt>
                <dd className="text-[var(--charcoal)]">{selectedUnit.sizeSf.toLocaleString()} SF</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Rent (PSF NNN)</dt>
                <dd className="text-[var(--charcoal)]">{selectedUnit.rentPsfNnn}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Lease expiration</dt>
                <dd className="text-[var(--charcoal)]">{selectedUnit.leaseExpiration}</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </div>
  );
}
