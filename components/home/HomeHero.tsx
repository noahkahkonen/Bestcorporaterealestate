"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const HERO_VIDEO = "/videos/hero-video.mp4";

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.play().catch(() => {});
  }, []);

  const reveal = "transition-all duration-700 ease-out";
  const hidden = "opacity-0";
  const visible = "opacity-100";

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col justify-end overflow-hidden bg-[#065f46] text-white"
      style={{ aspectRatio: "21 / 9" }}
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#065f46]/90 via-[#065f46]/30 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
        <p
          className={`text-base font-medium uppercase tracking-widest text-white/80 lg:text-lg ${reveal} ${
            inView ? `${visible} translate-x-0` : `${hidden} -translate-x-8`
          }`}
          style={{
            transitionDelay: inView ? "0ms" : "0ms",
            textShadow: "2px 0 6px rgba(0,0,0,0.5), -2px 0 6px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.5), 0 -2px 6px rgba(0,0,0,0.5), 2px 2px 6px rgba(0,0,0,0.5), -2px 2px 6px rgba(0,0,0,0.5), 2px -2px 6px rgba(0,0,0,0.5), -2px -2px 6px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.35), 0 0 32px rgba(0,0,0,0.2)",
          }}
        >
          Columbus, Ohio
        </p>
        <h1
          className={`mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${reveal} ${
            inView ? `${visible} translate-y-0` : `${hidden} translate-y-8`
          }`}
          style={{
            transitionDelay: inView ? "120ms" : "0ms",
            textShadow: "2px 0 4px rgba(0,0,0,0.3), -2px 0 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3), 0 -2px 4px rgba(0,0,0,0.3), 2px 2px 4px rgba(0,0,0,0.3), -2px 2px 4px rgba(0,0,0,0.3), 2px -2px 4px rgba(0,0,0,0.3), -2px -2px 4px rgba(0,0,0,0.3), 0 0 12px rgba(0,0,0,0.2), 0 0 24px rgba(0,0,0,0.12)",
          }}
        >
          Best Corporate
          <br />
          Real Estate
        </h1>
        <p
          className={`mt-4 max-w-xl text-base text-white/90 sm:mt-5 lg:text-lg ${reveal} ${
            inView ? `${visible} translate-y-0` : `${hidden} translate-y-6`
          }`}
          style={{
            transitionDelay: inView ? "240ms" : "0ms",
            textShadow: "2px 0 6px rgba(0,0,0,0.5), -2px 0 6px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.5), 0 -2px 6px rgba(0,0,0,0.5), 2px 2px 6px rgba(0,0,0,0.5), -2px 2px 6px rgba(0,0,0,0.5), 2px -2px 6px rgba(0,0,0,0.5), -2px -2px 6px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.35), 0 0 32px rgba(0,0,0,0.2)",
          }}
        >
          Full-service brokerage and advisory for office, retail, industrial, multifamily, and land. Your partner in Central Ohio commercial real estate.
        </p>
        <div
          className={`mt-8 ${reveal} ${inView ? `${visible} translate-y-0 scale-100` : `${hidden} translate-y-4 scale-[0.98]`}`}
          style={{ transitionDelay: inView ? "380ms" : "0ms" }}
        >
          <Link
            href="/listings"
            className="inline-flex rounded-md bg-white px-6 py-3 text-base font-semibold text-[#065f46] transition-opacity hover:opacity-90"
          >
            View Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
