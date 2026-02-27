import { prisma } from "@/lib/prisma";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  links: { id: string; label: string; url: string; order: number }[];
};

export async function getNews(): Promise<NewsItem[]> {
  try {
    const rows = await prisma.news.findMany({
      include: { links: { orderBy: { order: "asc" } } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      content: r.content,
      imageUrl: r.imageUrl,
      publishedAt: r.publishedAt,
      createdAt: r.createdAt,
      links: r.links.map((l) => ({ id: l.id, label: l.label, url: l.url, order: l.order })),
    }));
  } catch (err) {
    console.error("getNews error:", err);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const row = await prisma.news.findUnique({
      where: { slug },
      include: { links: { orderBy: { order: "asc" } } },
    });
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      imageUrl: row.imageUrl,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      links: row.links.map((l) => ({ id: l.id, label: l.label, url: l.url, order: l.order })),
    };
  } catch (err) {
    console.error("getNewsBySlug error:", err);
    return null;
  }
}
