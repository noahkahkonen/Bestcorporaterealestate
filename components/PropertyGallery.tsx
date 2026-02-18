"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const displayImages = images.length ? images : ["/placeholder"];
  const currentSrc = displayImages[index % displayImages.length];
  const hasRealImages = displayImages.some((s) => s.startsWith("/") && s !== "/placeholder");

  const goPrev = () => setIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  const goNext = () => setIndex((i) => (i + 1) % displayImages.length);

  return (
    <div className="w-full space-y-3">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-[#065f46]">
        {hasRealImages && currentSrc.startsWith("/") && currentSrc !== "/placeholder" ? (
          <Image
            src={currentSrc}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1440px) 100vw, 1440px"
            quality={90}
            priority
          />
      ) : (
        <div className="placeholder-img absolute inset-0 flex items-center justify-center text-white/60">
          Property image gallery
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--surface)]/90 p-2 text-[var(--charcoal)] shadow hover:bg-[var(--surface)]"
        aria-label="Previous image"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--surface)]/90 p-2 text-[var(--charcoal)] shadow hover:bg-[var(--surface)]"
        aria-label="Next image"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </div>

      {displayImages.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {displayImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative block h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === index
                  ? "border-[var(--navy)] ring-2 ring-[var(--navy)]/30"
                  : "border-transparent hover:border-[var(--border)]"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {src.startsWith("/") && src !== "/placeholder" ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="96px"
                  quality={90}
                />
              ) : (
                <div className="absolute inset-0 bg-black/50" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
