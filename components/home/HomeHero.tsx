"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
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

  const reveal = "transition-all duration-700 ease-out";
  const hidden = "opacity-0";
  const visible = "opacity-100";

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden"
      style={{
        background: "linear-gradient(to right, rgba(0, 71, 51, 0.9) 15%, rgba(0, 71, 51, 0.6) 50%, rgba(0, 71, 51, 0.3)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000') center/cover",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #004733 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-8 py-20">
        <div className="max-w-5xl">
          <div
            className={`flex items-center gap-6 text-[var(--accent)] mb-10 ${reveal} ${inView ? visible : hidden}`}
          >
            <span className="h-[2px] w-16 bg-[var(--accent)]" />
            <span className="uppercase tracking-[0.5em] text-xs font-black">Columbus, Ohio</span>
          </div>
          <h1
            className={`font-display text-6xl font-bold leading-[0.95] tracking-tight text-[var(--corporate-white)] sm:text-7xl lg:text-8xl xl:text-9xl ${reveal} ${
              inView ? `${visible} translate-y-0` : `${hidden} translate-y-8`
            }`}
            style={{ transitionDelay: inView ? "80ms" : "0ms" }}
          >
            Best{" "}
            <span className="text-[var(--corporate-white)]">Corporate</span>{" "}
            <span className="text-[var(--accent)]">Real Estate</span>
          </h1>
          <p
            className={`mt-10 mb-14 max-w-2xl text-xl font-light leading-relaxed text-slate-200 md:text-2xl ${reveal} ${
              inView ? `${visible} translate-y-0` : `${hidden} translate-y-6`
            }`}
            style={{ transitionDelay: inView ? "160ms" : "0ms" }}
          >
            Best Corporate Real Estate delivers high-conviction insights and capital solutions through deep local market expertise across Central Ohio.
          </p>
          <div
            className={`flex flex-col gap-4 sm:flex-row sm:gap-4 ${reveal} ${inView ? `${visible} translate-y-0 scale-100` : `${hidden} translate-y-4 scale-[0.98]`}`}
            style={{ transitionDelay: inView ? "260ms" : "0ms" }}
          >
            <div className="flex max-w-2xl flex-1 items-center gap-0 overflow-hidden rounded-sm border border-[var(--corporate-white)]/20 bg-[var(--corporate-white)]/10 p-2 shadow-2xl backdrop-blur-xl">
              <input
                type="text"
                placeholder="Search markets, sectors, or asset types..."
                className="w-full border-none bg-transparent px-6 py-4 text-lg text-[var(--corporate-white)] placeholder:text-slate-300 focus:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value;
                    window.location.href = q ? `/listings?q=${encodeURIComponent(q)}` : "/listings";
                  }
                }}
              />
              <Link
                href="/listings"
                className="shrink-0 rounded-sm bg-[var(--accent)] px-12 py-4 text-sm font-black uppercase tracking-widest text-[var(--navy)] shadow-lg transition-all hover:bg-[var(--corporate-white)]"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-12 h-1/2 w-px bg-gradient-to-t from-[var(--accent)] to-transparent" />
    </section>
  );
}
