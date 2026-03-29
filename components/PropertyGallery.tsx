"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

function isRealImage(s: string) {
  return (s.startsWith("/") || s.startsWith("https://")) && s !== "/placeholder";
}

function PlaceholderTile() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-muted)] text-xs font-medium text-[var(--charcoal-light)]">
      —
    </div>
  );
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const displayImages = images.length ? images : ["/placeholder"];
  const realIndices = useMemo(() => {
    const list = images.length ? images : ["/placeholder"];
    return list.map((s, i) => (isRealImage(s) ? i : -1)).filter((i) => i >= 0);
  }, [images]);
  const hasRealImages = realIndices.length > 0;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  /** Position within realIndices (0 .. realIndices.length-1) */
  const [lightboxPos, setLightboxPos] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightboxAtDisplayIndex = useCallback(
    (displayIndex: number) => {
      if (!hasRealImages) return;
      const pos = realIndices.indexOf(displayIndex);
      if (pos < 0) return;
      setLightboxPos(pos);
      setLightboxOpen(true);
    },
    [hasRealImages, realIndices],
  );

  const openLightboxFirst = useCallback(() => {
    if (!hasRealImages) return;
    setLightboxPos(0);
    setLightboxOpen(true);
  }, [hasRealImages]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goPrevLightbox = useCallback(() => {
    setLightboxPos((p) => (p - 1 + realIndices.length) % realIndices.length);
  }, [realIndices.length]);

  const goNextLightbox = useCallback(() => {
    setLightboxPos((p) => (p + 1) % realIndices.length);
  }, [realIndices.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrevLightbox();
      if (e.key === "ArrowRight") goNextLightbox();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen, closeLightbox, goPrevLightbox, goNextLightbox]);

  const heroSrc = displayImages[0];
  const tile1 = displayImages[1];
  const tile2 = displayImages[2];
  const tile3 = displayImages[3];
  /** 4th square: prefer 5th photo under mask; else 4th; else hero */
  const tile4Bg =
    displayImages[4] && isRealImage(displayImages[4])
      ? displayImages[4]
      : displayImages[3] && isRealImage(displayImages[3])
        ? displayImages[3]
        : displayImages[0];

  const currentLightboxSrc = hasRealImages ? displayImages[realIndices[lightboxPos]!] : null;

  const lightboxModal =
    lightboxOpen &&
    mounted &&
    hasRealImages &&
    currentLightboxSrc &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a]"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} photo gallery`}
      >
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={closeLightbox}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pt-14 pb-2">
          {realIndices.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrevLightbox}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:left-6"
                aria-label="Previous photo"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNextLightbox}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:right-6"
                aria-label="Next photo"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}

          <div className="relative h-full w-full max-h-[min(78vh,900px)] max-w-[1400px]">
            <Image
              src={currentLightboxSrc}
              alt={`${title} – photo ${lightboxPos + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              quality={92}
              priority
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-black/60 px-4 py-4">
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {realIndices.map((displayIdx, pos) => (
              <button
                key={`${displayIdx}-${displayImages[displayIdx]}`}
                type="button"
                onClick={() => setLightboxPos(pos)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md sm:h-[72px] sm:w-[96px] ${
                  pos === lightboxPos ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Show photo ${pos + 1}`}
              >
                <Image
                  src={displayImages[displayIdx]!}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  quality={75}
                />
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        <button
          type="button"
          onClick={() => openLightboxAtDisplayIndex(0)}
          disabled={!hasRealImages || !isRealImage(heroSrc)}
          className="relative min-h-[220px] w-full flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-left md:min-h-0 md:min-w-0 disabled:cursor-default disabled:opacity-80"
          aria-label={isRealImage(heroSrc) ? "Open gallery, main photo" : undefined}
        >
          {isRealImage(heroSrc) ? (
            <div className="absolute inset-0">
              <Image
                src={heroSrc}
                alt={`${title} – main photo`}
                fill
                className="object-cover object-center transition hover:opacity-95"
                sizes="(max-width: 768px) 100vw, 60vw"
                quality={90}
                priority
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[var(--charcoal-light)]">
              Property image gallery
            </div>
          )}
        </button>

        <div className="grid w-full shrink-0 grid-cols-2 gap-3 md:w-[min(42%,420px)] md:max-w-md">
          {[
            { src: tile1, displayIdx: 1 },
            { src: tile2, displayIdx: 2 },
            { src: tile3, displayIdx: 3 },
          ].map(({ src, displayIdx }) => (
            <button
              key={displayIdx}
              type="button"
              onClick={() => openLightboxAtDisplayIndex(displayIdx)}
              disabled={!src || !isRealImage(src)}
              className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] disabled:pointer-events-none disabled:opacity-50"
              aria-label={src && isRealImage(src) ? `Open gallery, photo ${displayIdx + 1}` : undefined}
            >
              {src && isRealImage(src) ? (
                <Image
                  src={src}
                  alt={`${title} – photo ${displayIdx + 1}`}
                  fill
                  className="object-cover object-center transition hover:opacity-95"
                  sizes="200px"
                  quality={85}
                />
              ) : (
                <PlaceholderTile />
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={openLightboxFirst}
            className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]"
            aria-label="View all photos"
          >
            {tile4Bg && isRealImage(tile4Bg) ? (
              <Image
                src={tile4Bg}
                alt=""
                fill
                className="object-cover object-center"
                sizes="200px"
                quality={85}
              />
            ) : (
              <PlaceholderTile />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/75 px-2 backdrop-blur-[2px]">
              <span className="text-center text-sm font-extrabold uppercase tracking-wider text-[var(--charcoal)] sm:text-base">
                View all
              </span>
              {hasRealImages && realIndices.length > 1 && (
                <span className="text-xs font-medium text-[var(--charcoal-light)]">
                  {realIndices.length} photos
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {lightboxModal}
    </div>
  );
}
