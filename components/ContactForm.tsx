"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

const SERVICE_OPTIONS = [
  "Seller Representation",
  "Landlord Representation",
  "Buyer Representation",
  "Tenant Representation",
  "General Inquiry",
];

const inputClass =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-base text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20 transition-shadow";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRecaptchaError(false);

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && !recaptchaToken) {
      setRecaptchaError(true);
      return;
    }

    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body: Record<string, string> = Object.fromEntries(formData.entries()) as Record<string, string>;
    if (recaptchaToken) body.recaptchaToken = recaptchaToken;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        setRecaptchaToken(null);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[var(--charcoal)]">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--charcoal)]">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-[var(--charcoal)]">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(614) 555-0000"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-[var(--charcoal)]">
          Service needed
        </label>
        <select
          id="service"
          name="service"
          className={inputClass}
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[var(--charcoal)]">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
          className={inputClass + " resize-y min-h-[120px]"}
        />
      </div>

      {siteKey && (
        <div>
          <ReCAPTCHA
            sitekey={siteKey}
            theme="light"
            size="normal"
            onChange={(token) => {
              setRecaptchaToken(token);
              setRecaptchaError(false);
            }}
            onExpired={() => setRecaptchaToken(null)}
          />
          {recaptchaError && (
            <p className="mt-2 text-sm font-medium text-red-600">Please complete the reCAPTCHA.</p>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">
          Thank you. We’ll be in touch soon.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800">
          Something went wrong. Please try again.
        </div>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-[var(--navy)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
