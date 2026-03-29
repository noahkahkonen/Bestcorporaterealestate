"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NNN_CHARGES_DISCLAIMER_BODY } from "@/lib/nnn-charges-disclaimer";

const HOVER_OPEN_MS = 4000;

type NnnChargesInfoTagProps = {
  /** Extra classes on the outer wrapper (alignment, etc.). */
  className?: string;
  /** Size variant for dense UIs (e.g. map cards). */
  size?: "default" | "compact";
};

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

export default function NnnChargesInfoTag({ className = "", size = "default" }: NnnChargesInfoTagProps) {
  const isCompact = size === "compact";
  const isCoarsePointer = useCoarsePointer();
  const tooltipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current != null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    if (isCoarsePointer) return;
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => setOpen(true), HOVER_OPEN_MS);
  }, [isCoarsePointer, clearHoverTimer]);

  const onPointerEnter = () => {
    scheduleOpen();
  };

  const onPointerLeave = () => {
    if (isCoarsePointer) return;
    clearHoverTimer();
    setOpen(false);
  };

  const onClick = () => {
    if (!isCoarsePointer) return;
    setOpen((v) => !v);
  };

  const onFocus = () => {
    if (isCoarsePointer) return;
    clearHoverTimer();
    setOpen(true);
  };

  const onBlur = () => {
    if (isCoarsePointer) return;
    clearHoverTimer();
    setOpen(false);
  };

  useEffect(() => {
    if (!isCoarsePointer || !open) return;
    const close = (e: Event) => {
      const n = e.target as Node | null;
      if (n && rootRef.current?.contains(n)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isCoarsePointer, open]);

  useEffect(() => () => clearHoverTimer(), [clearHoverTimer]);

  const btnClass = isCompact
    ? "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[var(--charcoal-light)]/40 bg-[var(--surface)] text-[8px] font-bold leading-none text-[var(--charcoal-light)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-1"
    : "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--charcoal-light)]/35 bg-[var(--surface)] text-[10px] font-bold leading-none text-[var(--charcoal-light)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-1";

  const panelOpen = open;
  const pointerEventsClass =
    isCoarsePointer && panelOpen ? "pointer-events-auto" : "pointer-events-none";

  return (
    <span ref={rootRef} className={`relative inline-block align-middle ${className}`}>
      <button
        type="button"
        className={btnClass}
        aria-label="Information about NNN charges (disclaimer; not legal advice)"
        aria-describedby={panelOpen ? tooltipId : undefined}
        aria-expanded={isCoarsePointer ? panelOpen : undefined}
        aria-controls={isCoarsePointer ? tooltipId : undefined}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        i
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute bottom-[calc(100%+6px)] left-1/2 z-[200] max-h-64 w-[min(calc(100vw-2rem),20rem)] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-left text-[10px] font-light normal-case leading-relaxed text-[var(--charcoal)] shadow-lg transition-[opacity,visibility] duration-100 ease-out sm:w-72 ${pointerEventsClass} ${
          panelOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
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
