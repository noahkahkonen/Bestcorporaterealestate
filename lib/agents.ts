import { prisma } from "@/lib/prisma";

export async function getAgentBySlugOrId(slugOrId: string) {
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
  });
  return agent;
}

export async function getAllAgentSlugs(): Promise<string[]> {
  const agents = await prisma.agent.findMany({
    select: { slug: true, id: true },
  });
  return agents.map((a) => a.slug || a.id).filter(Boolean);
}
