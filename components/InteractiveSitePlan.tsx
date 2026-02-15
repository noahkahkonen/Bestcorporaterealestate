"use client";

import { useState } from "react";

// Same photo, same pixel dimensions — image-map coords are in this space
const BASE_COORD_W = 937;
const BASE_COORD_H = 624;

// Actual image file served from /public/siteplans/
const IMG_W = 937;
const IMG_H = 624;

// Scale factors
const sx = IMG_W / BASE_COORD_W;
const sy = IMG_H / BASE_COORD_H;

function toScaledRect([x1, y1, x2, y2]: [number, number, number, number]) {
  const x = Math.min(x1, x2) * sx;
  const y = Math.min(y1, y2) * sy;
  const w = Math.abs(x2 - x1) * sx;
  const h = Math.abs(y2 - y1) * sy;
  return { x, y, w, h };
}

const units = [
  { id: "A", label: "Unit A", coords: [278, 146, 409, 256] },
  { id: "B", label: "Unit B", coords: [411, 147, 484, 258] },
  { id: "C", label: "Unit C", coords: [486, 148, 558, 258] },
];

export default function InteractiveSitePlan() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <img
        src="/siteplans/Example.png"
        alt="Site Plan"
        className="block w-full h-auto rounded-xl shadow-lg"
      />

      {/* SVG Overlay — real image size so overlay stays aligned */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: "none" }}
      >
        {units.map((u) => {
          const r = toScaledRect(u.coords);

          return (
            <rect
              key={u.id}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={10}
              style={{ pointerEvents: "auto" }}
              className="cursor-pointer transition-all duration-200 fill-transparent hover:fill-blue-500/25 stroke-transparent hover:stroke-blue-600"
              strokeWidth={3}
              onClick={() => setActiveId(u.id)}
            />
          );
        })}
      </svg>
    </div>
  );
}
