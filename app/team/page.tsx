import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPhone } from "@/lib/format-phone";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the commercial real estate professionals at Best Corporate Real Estate in Columbus, Ohio.",
};

export default async function TeamPage() {
  const agents = await prisma.agent.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Our Team
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Experienced professionals dedicated to commercial real estate advisory in Columbus and Central Ohio.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <article
              key={agent.id}
              className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/team/${agent.slug || agent.id}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                  {agent.headshot ? (
                    <Image
                      src={agent.headshot}
                      alt={agent.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      quality={90}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[var(--muted)]">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 p-4">
                  <p className="font-semibold text-[var(--charcoal)]">
                    {agent.name}
                    {agent.credentials && (
                      <span className="ml-1 font-normal text-[var(--charcoal-light)]">
                        {agent.credentials}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-[var(--navy)]">{agent.title || "Team Member"}</p>
                </div>
              </Link>
              <div className="min-w-0 px-4 pb-4">
                {agent.phone && (
                  <p className="text-sm text-[var(--charcoal-light)]">
                    {formatPhone(agent.phone)}
                    {agent.ext && ` Ext. ${agent.ext}`}
                  </p>
                )}
                <a
                  href={`mailto:${agent.email}`}
                  className="mt-1 block whitespace-nowrap text-sm text-[var(--navy)] hover:underline"
                >
                  {agent.email}
                </a>
                {agent.website && (
                  <a
                    href={agent.website.startsWith("http") ? agent.website : `https://${agent.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-[var(--navy)] hover:underline"
                  >
                    {agent.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
