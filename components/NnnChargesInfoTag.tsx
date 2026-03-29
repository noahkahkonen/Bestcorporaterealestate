"use client";

import { NNN_CHARGES_DISCLAIMER_BODY } from "@/lib/nnn-charges-disclaimer";

type NnnChargesInfoTagProps = {
  /** Extra classes on the outer wrapper (alignment, etc.). */
  className?: string;
  /** Size variant for dense UIs (e.g. map cards). */
  size?: "default" | "compact";
};

export default function NnnChargesInfoTag({ className = "", size = "default" }: NnnChargesInfoTagProps) {
  const isCompact = size === "compact";
  return (
    <span className={`relative inline-block align-middle ${className}`}>
      <button
        type="button"
        className={
          isCompact
            ? "peer inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[var(--charcoal-light)]/40 bg-[var(--surface)] text-[8px] font-bold leading-none text-[var(--charcoal-light)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-1"
            : "peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--charcoal-light)]/35 bg-[var(--surface)] text-[10px] font-bold leading-none text-[var(--charcoal-light)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-1"
        }
        aria-label="Information about NNN charges (disclaimer; not legal advice)"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+6px)] left-1/2 z-[200] max-h-64 w-[min(calc(100vw-2rem),20rem)] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-left text-[10px] font-light normal-case leading-relaxed text-[var(--charcoal)] opacity-0 shadow-lg transition-[opacity,visibility] duration-100 ease-out peer-hover:visible peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100 sm:w-72"
      >
        {NNN_CHARGES_DISCLAIMER_BODY}
      </span>
    </span>
  );
}

/** Label text + info control for form fields. */
export function NnnChargesLabelWithInfo({
  className = "",
  labelClassName = "",
}: {
  className?: string;
  labelClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={labelClassName}>NNN charges</span>
      <NnnChargesInfoTag />
    </span>
  );
}
