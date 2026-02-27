import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Market updates and thought leadership from Best Corporate Real Estate in Columbus, Ohio.",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function NewsPage() {
  const articles = await getNews();
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
        {articles.length === 0 ? (
          <p className="text-center text-[var(--charcoal-light)]">No news stories yet. Check back soon.</p>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-md sm:flex-row"
              >
                <div className="relative h-48 w-full flex-shrink-0 sm:h-52 sm:w-72">
                  <Image
                    src={article.imageUrl || "/images/news/news-story.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 288px"
                    quality={90}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <p className="text-xs font-medium text-[var(--muted)]">
                    {formatDate(article.publishedAt || article.createdAt)}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--charcoal)]">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-2 text-[var(--charcoal-light)]">{article.excerpt}</p>
                  )}
                  <Link
                    href={`/news/${article.slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
