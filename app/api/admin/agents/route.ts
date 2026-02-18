import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agents = await prisma.agent.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(agents);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, title, email, phone, ext, credentials, website, headshot } = body;
    const agent = await prisma.agent.create({
      data: {
        name,
        title: title || null,
        email,
        phone: phone || null,
        ext: ext || null,
        credentials: credentials || null,
        website: website || null,
        headshot: headshot || null,
      },
    });
    return NextResponse.json(agent);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
