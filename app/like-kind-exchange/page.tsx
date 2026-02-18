import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is a 1031 Like-Kind Exchange?",
  description: "Learn how a 1031 like-kind exchange can defer capital gains tax when selling investment property. Our team can connect you with qualified intermediaries and help you find your next property.",
};

export default function Exchange1031Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
        What is a 1031 Like-Kind Exchange?
      </h1>

      <div className="mt-8 space-y-6 text-[var(--charcoal-light)]">
        <p className="text-xl leading-relaxed">
          A <strong className="text-[var(--charcoal)]">1031 like-kind exchange</strong> is an IRS-regulated strategy that allows real estate investors to defer federal capital gains taxes when selling an investment property by reinvesting the proceeds into a replacement property of &quot;like kind.&quot; By identifying a qualifying replacement property within 45 days and closing within 180 days of the sale, investors can preserve their equity and compound wealth through successive exchanges.
        </p>

        <p className="text-xl leading-relaxed">
          To execute a 1031 exchange, you must work with a <strong className="text-[var(--charcoal)]">qualified intermediary</strong> (also called an exchange accommodator or facilitator). The intermediary holds the proceeds from your sale in escrow until you close on the replacement property, ensuring compliance with IRS rules. They handle the documentation, timing requirements, and structural details so your exchange meets regulatory standards.
        </p>

        <p className="text-xl leading-relaxed">
          Our team at Best Corporate Real Estate works closely with experienced qualified intermediaries throughout the Columbus and central Ohio market. We can introduce you to trusted exchangors and guide you through the entire process—from selling your current property to identifying and acquiring your replacement asset. Whether you&apos;re trading retail, industrial, office, or multifamily properties, we help you find the right fit within your exchange timeline.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-8">
        <h2 className="text-2xl font-semibold text-[var(--charcoal)]">
          Connect with an advisor
        </h2>
        <p className="mt-3 text-xl leading-relaxed text-[var(--charcoal-light)]">
          Our advisors understand 1031 exchanges and can connect you with qualified intermediaries while helping you identify properties that meet your investment goals.
        </p>
        <Link
          href="/team"
          className="mt-6 inline-flex items-center rounded-lg bg-[var(--navy)] px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          Find an Advisor
        </Link>
      </div>
    </div>
  );
}
