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
    <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#065f46]">
      {hasRealImages && currentSrc.startsWith("/") && currentSrc !== "/placeholder" ? (
        <Image
          src={currentSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
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
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[var(--charcoal)] shadow hover:bg-white"
        aria-label="Previous image"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[var(--charcoal)] shadow hover:bg-white"
        aria-label="Next image"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
        {displayImages.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded transition-opacity ${
              i === index ? "ring-2 ring-white opacity-100" : "bg-white/20 opacity-70 hover:opacity-90"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            {src.startsWith("/") && src !== "/placeholder" ? (
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
