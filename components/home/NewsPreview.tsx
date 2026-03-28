import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/news";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface NewsPreviewProps {
  articles: NewsItem[];
}

export default function NewsPreview({ articles }: NewsPreviewProps) {
  return (
    <section className="relative z-10 border-b border-[var(--border)] bg-[var(--surface-muted)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Latest from Best CRE
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
              News & Insights
            </h2>
            <p className="mt-4 max-w-xl text-[var(--charcoal-light)]">
              Market updates and thought leadership from our team.
            </p>
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-[var(--navy)] hover:underline"
          >
            View all news →
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
              <p className="text-[var(--charcoal-light)]">No news stories yet. Check back soon.</p>
            </div>
          ) : (
            articles.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all hover:border-[var(--navy)]/20 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.imageUrl || "/images/news/news-story.png"}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col border-l-4 border-[var(--navy)] p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    {formatDate(item.publishedAt || item.createdAt)}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-bold text-[var(--charcoal)] transition-colors group-hover:text-[var(--navy)]">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--charcoal-light)]">
                      {item.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)]">
                    Read more
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
