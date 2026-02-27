import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "News" };
  return {
    title: article.title,
    description: article.excerpt || undefined,
  };
}

export const dynamic = "force-dynamic";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <div className="pb-16">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/news" className="text-sm text-[var(--navy)] hover:underline">
          ← Back to News
        </Link>
        <p className="mt-4 text-sm font-medium text-[var(--muted)]">
          {formatDate(article.publishedAt || article.createdAt)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
          {article.title}
        </h1>
        {article.imageUrl && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}
        {article.excerpt && (
          <p className="mt-6 text-lg text-[var(--charcoal-light)]">{article.excerpt}</p>
        )}
        <div className="prose prose-[var(--charcoal)] mt-8 max-w-none">
          {(article.content || "").split("\n").map((para, i) => (
            <p key={i} className="mb-4 text-[var(--charcoal-light)]">
              {para}
            </p>
          ))}
        </div>
        {article.links.length > 0 && (
          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <p className="text-sm font-semibold text-[var(--muted)]">Related coverage</p>
            <ul className="mt-2 space-y-2">
              {article.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--navy)] hover:underline"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
