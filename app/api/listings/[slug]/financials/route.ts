import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token?.trim()) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const submission = await prisma.ndaSubmission.findFirst({
    where: { approvalToken: token, listingSlug: slug, status: "approved" },
  });

  if (!submission) {
    return NextResponse.json({ error: "Access denied or invalid link" }, { status: 403 });
  }

  const listing = await prisma.listing.findFirst({
    where: { slug, published: true },
  });

  if (!listing?.financialDocPath) {
    return NextResponse.json({ error: "Financial document not available" }, { status: 404 });
  }

  try {
    const relPath = listing.financialDocPath.startsWith("/") ? listing.financialDocPath.slice(1) : listing.financialDocPath;
    const filePath = path.join(process.cwd(), "public", relPath);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="financials-${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Financial doc read error:", err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
