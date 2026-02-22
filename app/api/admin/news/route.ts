import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const news = await prisma.news.findMany({
    include: { links: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, excerpt, content, imageUrl, publishedAt, links } = body;

    const slug = body.slug?.trim() || slugify(title || "untitled");
    const existing = await prisma.news.findUnique({ where: { slug } });
    let finalSlug = slug;
    if (existing) {
      let n = 1;
      while (await prisma.news.findUnique({ where: { slug: `${slug}-${n}` } })) n++;
      finalSlug = `${slug}-${n}`;
    }

    const news = await prisma.news.create({
      data: {
        slug: finalSlug,
        title: title?.trim() || "Untitled",
        excerpt: excerpt?.trim() || null,
        content: content?.trim() || "",
        imageUrl: imageUrl?.trim() || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    const linkRows = Array.isArray(links)
      ? links
          .filter((l: { label?: string; url?: string }) => l?.label?.trim() && l?.url?.trim())
          .map((l: { label: string; url: string }, i: number) => ({
            newsId: news.id,
            label: String(l.label).trim(),
            url: String(l.url).trim(),
            order: i,
          }))
      : [];

    if (linkRows.length > 0) {
      await prisma.newsLink.createMany({ data: linkRows });
    }

    const created = await prisma.news.findUnique({
      where: { id: news.id },
      include: { links: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(created);
  } catch (err) {
    console.error("News create error:", err);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
