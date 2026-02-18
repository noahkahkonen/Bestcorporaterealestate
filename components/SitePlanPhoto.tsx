"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SitePlanUnit } from "@/types/site-plan";

// Actual image dimensions (verified via sips)
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 682;

// Overlay rects for units 1–3 (Unit A, B, C) — from coordinate picker
const UNIT_RECTS: { id: string; x: number; y: number; width: number; height: number }[] = [
  { id: "1", x: 389, y: 307, width: 139, height: 119 }, // Unit A
  { id: "2", x: 531, y: 310, width: 80, height: 114 },  // Unit B
  { id: "3", x: 609, y: 311, width: 83, height: 115 }, // Unit C
];

interface SitePlanPhotoProps {
  units: SitePlanUnit[];
  imageSrc: string;
}

export default function SitePlanPhoto({ units, imageSrc }: SitePlanPhotoProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const searchParams = useSearchParams();
  const coordPicker = searchParams.get("coordPicker") === "1";

  // Coordinate picker state: 2 clicks to define a rect (top-left, bottom-right)
  const [pickerPoints, setPickerPoints] = useState<{ x: number; y: number }[]>([]);
  const [pickerRect, setPickerRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
  const selectedUnit = selectedId ? unitById[selectedId] : null;

  const handleRectClick = (id: string) => {
    if (coordPicker) return;
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!coordPicker || !svgRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const x = Math.round(svgPt.x);
    const y = Math.round(svgPt.y);

    if (pickerPoints.length === 0) {
      setPickerPoints([{ x, y }]);
      setPickerRect(null);
    } else {
      const [p1] = pickerPoints;
      const x1 = Math.min(p1.x, x);
      const y1 = Math.min(p1.y, y);
      const width = Math.abs(x - p1.x);
      const height = Math.abs(y - p1.y);
      const rect = { x: x1, y: y1, width, height };
      setPickerRect(rect);
      setPickerPoints([]);
    }
  };

  const copyRect = () => {
    if (!pickerRect) return;
    const str = `{ id: "X", x: ${pickerRect.x}, y: ${pickerRect.y}, width: ${pickerRect.width}, height: ${pickerRect.height} },`;
    navigator.clipboard.writeText(str);
  };

  const resetPicker = () => {
    setPickerPoints([]);
    setPickerRect(null);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {coordPicker && (
        <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          <p className="font-medium">Coordinate picker mode</p>
          <p className="mt-1 text-amber-800 dark:text-amber-300">
            Click once for top-left corner, then again for bottom-right. Copy the rect and add to UNIT_RECTS.
          </p>
        </div>
      )}

      <div
        className="w-full rounded-xl bg-[var(--surface-muted)] bg-cover bg-center bg-no-repeat"
        style={{
          aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
          backgroundImage: `url("${imageSrc}")`,
        }}
        role="img"
        aria-label="Site plan"
      />
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full rounded-xl"
        viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: coordPicker ? "auto" : "none" }}
        onClick={handleSvgClick}
      >
        {coordPicker && (
          <rect
            x={0}
            y={0}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            fill="transparent"
            style={{ pointerEvents: "auto", cursor: "crosshair" }}
          />
        )}
        <g style={{ pointerEvents: coordPicker ? "none" : "auto" }}>
          {units.map((u) => {
            const rect = UNIT_RECTS.find((r) => r.id === u.id);
            if (!rect) return null;
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
                onClick={(e) => {
                  handleRectClick(rect.id);
                  e.stopPropagation();
                }}
                aria-label={`${u.tenantName} – ${u.use}`}
              />
            );
          })}
        </g>
        {coordPicker && pickerPoints.length > 0 && (
          <circle
            cx={pickerPoints[0].x}
            cy={pickerPoints[0].y}
            r={6}
            fill="rgb(245 158 11)"
            stroke="white"
            strokeWidth={2}
          />
        )}
        {coordPicker && pickerRect && (
          <rect
            x={pickerRect.x}
            y={pickerRect.y}
            width={pickerRect.width}
            height={pickerRect.height}
            fill="rgba(245, 158, 11, 0.2)"
            stroke="rgb(245 158 11)"
            strokeWidth={2}
          />
        )}
      </svg>

      {coordPicker && (pickerRect || pickerPoints.length > 0) && (
        <div className="absolute left-4 top-4 z-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
          {pickerPoints.length === 1 && (
            <p className="text-sm text-[var(--charcoal-light)]">
              Point 1: ({pickerPoints[0].x}, {pickerPoints[0].y}) — click for bottom-right
            </p>
          )}
          {pickerRect && (
            <>
              <p className="font-mono text-sm text-[var(--charcoal)]">
                x: {pickerRect.x}, y: {pickerRect.y}, w: {pickerRect.width}, h: {pickerRect.height}
              </p>
              <p className="mt-2 font-mono text-xs text-[var(--charcoal-light)]">
                {`{ id: "X", x: ${pickerRect.x}, y: ${pickerRect.y}, width: ${pickerRect.width}, height: ${pickerRect.height} },`}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={copyRect}
                  className="rounded bg-[var(--navy)] px-3 py-1.5 text-sm text-white hover:opacity-90"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={resetPicker}
                  className="rounded border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--charcoal)] hover:bg-[var(--surface-hover)]"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {selectedUnit && !coordPicker && (
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
              onClick={() => setSelectedId(null)}
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
