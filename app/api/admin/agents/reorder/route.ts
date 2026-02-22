import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const agentIds = body.agentIds;
    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ error: "agentIds array required" }, { status: 400 });
    }

    await prisma.$transaction(
      agentIds.map((id: string, index: number) =>
        prisma.agent.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const agents = await prisma.agent.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(agents);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
