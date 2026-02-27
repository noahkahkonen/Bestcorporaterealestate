"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const isRealImage = (s: string) => (s.startsWith("/") || s.startsWith("https://")) && s !== "/placeholder";
  // Preserve order: first image is always the hero/main photo from listing
  const displayImages = images.length ? images : ["/placeholder"];
  const hasRealImages = displayImages.some(isRealImage);

  const goPrev = () => setIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  const goNext = () => setIndex((i) => (i + 1) % displayImages.length);

  return (
    <div className="w-full space-y-3">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-[#065f46]">
        {hasRealImages ? (
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {displayImages.map((src, i) =>
              isRealImage(src) ? (
                <div key={i} className="relative h-full min-w-full flex-shrink-0">
                  <Image
                    src={src}
                    alt={`${title} – image ${i + 1}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    quality={90}
                    priority={i === 0}
                  />
                </div>
              ) : (
                <div key={i} className="min-w-full flex-shrink-0" />
              )
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            Property image gallery
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
        <div className="flex flex-wrap gap-1.5">
          {displayImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative block h-12 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-colors sm:h-14 sm:w-20 ${
                i === index
                  ? "border-[var(--navy)] ring-2 ring-[var(--navy)]/30"
                  : "border-transparent hover:border-[var(--border)]"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {isRealImage(src) ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="80px"
                  quality={75}
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
