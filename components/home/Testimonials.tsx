const TESTIMONIALS = [
  {
    quote: "Best Corporate Real Estate delivered a seamless sale process and achieved above our expectations.",
    author: "Private Owner",
    context: "Industrial disposition, Columbus",
  },
  {
    quote: "Their knowledge of the Central Ohio market and attention to detail made our lease negotiation efficient and successful.",
    author: "Corporate Tenant",
    context: "Office lease, Arena District",
  },
];

const SOLD_SAMPLE = [
  "85,000 SF Industrial – Sale – Polaris",
  "12,000 SF Retail – Lease – Dublin",
  "42,000 SF Office – Sale/Lease – Downtown",
];

export default function Testimonials() {
  return (
    <section className="border-b border-[var(--border)] bg-gray-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
          Sold Transactions & Testimonials
        </h2>
        <p className="mt-2 text-base text-[var(--charcoal-light)] lg:text-lg">
          Recent activity and client feedback.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Recent Transactions
            </h3>
            <ul className="mt-4 space-y-2">
              {SOLD_SAMPLE.map((t, i) => (
                <li key={i} className="text-[var(--charcoal)]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              What Clients Say
            </h3>
            <div className="mt-4 space-y-6">
              {TESTIMONIALS.map((t, i) => (
                <blockquote key={i} className="border-l-2 border-[var(--navy)] pl-4">
                  <p className="text-[var(--charcoal)]">"{t.quote}"</p>
                  <footer className="mt-2 text-sm text-[var(--charcoal-light)]">
                    — {t.author}, {t.context}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
