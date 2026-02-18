import Link from "next/link";
import Image from "next/image";

const PLACEHOLDER_ITEMS = [
  { title: "Central Ohio Market Report Q4 2024", date: "Jan 15, 2025", slug: "market-report-q4", image: "/images/news/news-story.png" },
  { title: "Industrial Demand Continues in Polaris Corridor", date: "Jan 8, 2025", slug: "industrial-polaris", image: "/images/news/news-story.png" },
  { title: "Downtown Office Trends: What Tenants Want", date: "Dec 20, 2024", slug: "downtown-office", image: "/images/news/news-story.png" },
];

export default function NewsPreview() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
              News & Insights
            </h2>
            <p className="mt-2 text-base text-[var(--charcoal-light)] lg:text-lg">
              Market updates and thought leadership from our team.
            </p>
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-[var(--navy)] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href="/news"
              className="group flex overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-md sm:flex-col"
            >
              <div className="relative h-40 w-full flex-shrink-0 sm:h-44">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  quality={90}
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-[var(--muted)]">{item.date}</p>
                <h3 className="mt-2 font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
