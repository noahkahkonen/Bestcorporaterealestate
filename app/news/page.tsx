import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Market updates and thought leadership from Best Corporate Real Estate in Columbus, Ohio.",
};

const ARTICLES = [
  { title: "Central Ohio Market Report Q4 2024", date: "Jan 15, 2025", excerpt: "Overview of commercial real estate activity and trends across Columbus and Central Ohio.", slug: "market-report-q4", image: "/images/news/news-story.png" },
  { title: "Industrial Demand Continues in Polaris Corridor", date: "Jan 8, 2025", excerpt: "Strong leasing and investment activity in the Polaris submarket.", slug: "industrial-polaris", image: "/images/news/news-story.png" },
  { title: "Downtown Office Trends: What Tenants Want", date: "Dec 20, 2024", excerpt: "How workplace preferences are shaping office demand in the Arena District and downtown.", slug: "downtown-office", image: "/images/news/news-story.png" },
  { title: "Retail Recap: High Street and Suburban Nodes", date: "Dec 10, 2024", excerpt: "Retail market update for Columbus core and suburban corridors.", slug: "retail-recap", image: "/images/news/news-story.png" },
  { title: "Multifamily Investment in Central Ohio", date: "Nov 28, 2024", excerpt: "Capital flows and cap rate trends in the multifamily sector.", slug: "multifamily-investment", image: "/images/news/news-story.png" },
];

export default function NewsPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            News & Insights
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Market updates, reports, and thought leadership from our team.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-md sm:flex-row"
            >
              <div className="relative h-48 w-full flex-shrink-0 sm:h-52 sm:w-72">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 288px"
                  quality={90}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6">
                <p className="text-xs font-medium text-[var(--muted)]">{article.date}</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--charcoal)]">
                  {article.title}
                </h2>
                <p className="mt-2 text-[var(--charcoal-light)]">{article.excerpt}</p>
                <Link
                  href="#"
                  className="mt-3 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
                >
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
