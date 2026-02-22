import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

function resolveId(raw: string): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const id = raw.includes("|") ? raw.split("|")[0]!.trim() : raw.trim();
  if (id.length >= 15 && id.length <= 30 && /^[a-z0-9]+$/i.test(id)) return id;
  return null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = resolveId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const existing = await prisma.ndaSubmission.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const { status, notes } = body;

    if (status === "approved") {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.ndaSubmission.update({
        where: { id },
        data: {
          status: "approved",
          approvalToken: token,
          notes: notes?.trim() || null,
          updatedAt: new Date(),
        },
      });
      const updated = await prisma.ndaSubmission.findUnique({ where: { id } });
      return NextResponse.json(updated);
    }

    if (status === "rejected") {
      await prisma.ndaSubmission.update({
        where: { id },
        data: {
          status: "rejected",
          approvalToken: null,
          notes: notes?.trim() || null,
          updatedAt: new Date(),
        },
      });
      const updated = await prisma.ndaSubmission.findUnique({ where: { id } });
      return NextResponse.json(updated);
    }

    return NextResponse.json(existing);
  } catch (err) {
    console.error("NDA update error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
