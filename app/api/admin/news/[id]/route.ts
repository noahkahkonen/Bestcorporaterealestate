import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function resolveId(raw: string): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const id = raw.includes("|") ? raw.split("|")[0]!.trim() : raw.trim();
  if (id.length >= 15 && id.length <= 30 && /^[a-z0-9]+$/i.test(id)) return id;
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = resolveId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const news = await prisma.news.findUnique({
    where: { id },
    include: { links: { orderBy: { order: "asc" } } },
  });
  if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(news);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = resolveId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, publishedAt, links } = body;

    const data: Record<string, unknown> = {};
    if (title != null) data.title = String(title).trim() || existing.title;
    if (slug != null && String(slug).trim()) data.slug = String(slug).trim();
    if (excerpt !== undefined) data.excerpt = excerpt?.trim() || null;
    if (content !== undefined) data.content = String(content ?? "").trim();
    if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;
    if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : null;

    if (Object.keys(data).length > 0) {
      await prisma.news.update({ where: { id }, data: data as Parameters<typeof prisma.news.update>[0]["data"] });
    }

    if (Array.isArray(links)) {
      await prisma.newsLink.deleteMany({ where: { newsId: id } });
      const linkRows = links
        .filter((l: { label?: string; url?: string }) => l?.label?.trim() && l?.url?.trim())
        .map((l: { label: string; url: string }, i: number) => ({
          newsId: id,
          label: String(l.label).trim(),
          url: String(l.url).trim(),
          order: i,
        }));
      if (linkRows.length > 0) {
        await prisma.newsLink.createMany({ data: linkRows });
      }
    }

    const updated = await prisma.news.findUnique({
      where: { id },
      include: { links: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(updated ?? existing);
  } catch (err) {
    console.error("News update error:", err);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = resolveId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("News delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
