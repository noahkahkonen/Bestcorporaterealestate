"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "best-cre-privacy-accepted";

export default function PrivacyDataPopup() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const accepted = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    setVisible(!accepted);
  }, [mounted]);

  function acceptWithoutEmail() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "accepted");
      setVisible(false);
    }
  }

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
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, "accepted");
        }
        setTimeout(() => setVisible(false), 1200);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--navy)]/10 bg-[var(--surface)] shadow-2xl"
      role="dialog"
      aria-label="Privacy & newsletter signup"
    >
      <div className="mx-auto max-w-4xl px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--navy)]/10 text-[var(--navy)]">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--charcoal)] sm:text-2xl">
                  Privacy &amp; Data
                </h3>
                <p className="mt-0.5 text-sm text-[var(--charcoal-light)]">
                  We use cookies and analytics to improve your experience. Get updates on Central Ohio commercial real estate.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full shrink-0 sm:w-[340px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="popup-email" className="sr-only">
                Email for Central Ohio CRE updates
              </label>
              <input
                id="popup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for market updates"
                required
                disabled={status === "sending"}
                className="min-h-[48px] w-full rounded-sm border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20 disabled:opacity-70"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="min-h-[48px] flex-1 rounded-sm bg-[var(--navy)] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:bg-[var(--navy-light)] disabled:opacity-70"
                >
                  {status === "sending" ? "Subscribing…" : status === "success" ? "Subscribed" : "Get Updates"}
                </button>
                <button
                  type="button"
                  onClick={acceptWithoutEmail}
                  disabled={status === "sending"}
                  className="min-h-[48px] rounded-sm border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--charcoal-light)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-70"
                >
                  Maybe later
                </button>
              </div>
            </form>
            {status === "success" && (
              <p className="mt-2 text-sm font-medium text-[var(--navy)]">
                Thanks! You’ll receive updates on Central Ohio commercial real estate.
              </p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm font-medium text-red-500">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
