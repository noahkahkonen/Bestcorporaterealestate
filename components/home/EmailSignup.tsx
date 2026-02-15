"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-b border-[var(--border)] bg-[#065f46] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Stay up to date
        </h2>
        <p className="mt-3 text-base text-white/90 lg:text-lg">
          Enter your email to get the latest news and insights in Columbus commercial real estate.
        </p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={status === "sending"}
              className="min-h-[48px] flex-1 rounded-lg border border-white/30 bg-white/10 px-4 text-base text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="min-h-[48px] rounded-lg bg-white px-6 py-3 text-base font-semibold text-[#065f46] transition-opacity hover:opacity-90 disabled:opacity-70"
            >
              {status === "sending" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {status === "success" && (
            <p className="mt-4 text-sm font-medium text-white/90">
              Thanks! We’ll keep you in the loop.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm font-medium text-white/90">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
