"use client";

import Image from "next/image";
import Link from "next/link";

interface PropertyGalleryGridProps {
  images: string[];
  title: string;
}

const isRealImage = (s: string) => (s.startsWith("/") || s.startsWith("https://")) && s !== "/placeholder";

export default function PropertyGalleryGrid({ images, title }: PropertyGalleryGridProps) {
  const displayImages = images.length ? images : ["/placeholder"];
  const count = displayImages.filter(isRealImage).length;
  const img0 = displayImages[0];
  const img1 = displayImages[1] ?? img0;
  const img2 = displayImages[2] ?? img0;
  const img3 = displayImages[3] ?? img0;

  return (
    <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-xl sm:h-[500px]">
      {/* Main large image */}
      <div className="group relative col-span-2 row-span-2 overflow-hidden">
        {img0 && isRealImage(img0) ? (
          <Image
            src={img0}
            alt={`${title} – main`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
            Property Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 transition-all group-hover:bg-transparent" />
      </div>

      {/* Top-right */}
      <div className="group relative overflow-hidden">
        {img1 && isRealImage(img1) ? (
          <Image
            src={img1}
            alt={`${title} – image 2`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--surface-muted)]" />
        )}
      </div>

      {/* Middle-right */}
      <div className="group relative overflow-hidden">
        {img2 && isRealImage(img2) ? (
          <Image
            src={img2}
            alt={`${title} – image 3`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--surface-muted)]" />
        )}
      </div>

      {/* Bottom spanning two cols - View All Photos badge */}
      <div className="group relative col-span-2 overflow-hidden">
        {img3 && isRealImage(img3) ? (
          <Image
            src={img3}
            alt={`${title} – image 4`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--surface-muted)]" />
        )}
        {count > 1 && (
          <Link
            href="#gallery"
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-[var(--charcoal)] shadow backdrop-blur transition-opacity hover:bg-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            View All Photos ({count})
          </Link>
        )}
      </div>
    </div>
  );
}
