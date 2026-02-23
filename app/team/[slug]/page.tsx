import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAgentBySlugOrId } from "@/lib/agents";
import { formatPhone } from "@/lib/format-phone";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try {
    const agents = await prisma.agent.findMany({ select: { slug: true, id: true } });
    return agents.map((a) => ({ slug: a.slug || a.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlugOrId(slug);
  if (!agent) return { title: "Team Member" };
  return {
    title: agent.name,
    description: agent.description || agent.title || `Meet ${agent.name} at Best Corporate Real Estate.`,
  };
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const agent = await getAgentBySlugOrId(slug);
  if (!agent) notFound();

  const notableDeals: string[] = agent.notableDealsJson ? (JSON.parse(agent.notableDealsJson) as string[]) : [];

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/team" className="text-sm text-[var(--navy)] hover:underline">
            ← Our Team
          </Link>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="relative aspect-square w-64 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-muted)] sm:w-80">
              {agent.headshot ? (
                <Image
                  src={agent.headshot}
                  alt={agent.name}
                  fill
                  className="object-cover object-top"
                  sizes="320px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-[var(--muted)]">
                  {agent.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
                {agent.name}
                {agent.credentials && (
                  <span className="ml-2 text-xl font-normal text-[var(--charcoal-light)]">
                    {agent.credentials}
                  </span>
                )}
              </h1>
              <p className="mt-2 text-lg text-[var(--navy)]">{agent.title || "Team Member"}</p>
              <div className="mt-8 space-y-3">
                <a
                  href={`mailto:${agent.email}`}
                  className="block text-base text-[var(--charcoal)] hover:text-[var(--navy)] hover:underline"
                >
                  {agent.email}
                </a>
                {agent.phone && (
                  <a
                    href={`tel:+1${agent.phone.replace(/\D/g, "").slice(-10)}`}
                    className="block text-base text-[var(--charcoal)] hover:text-[var(--navy)] hover:underline"
                  >
                    {formatPhone(agent.phone)}
                    {agent.ext && ` Ext. ${agent.ext}`}
                  </a>
                )}
                {agent.linkedIn && (
                  <a
                    href={agent.linkedIn.startsWith("http") ? agent.linkedIn : `https://${agent.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base text-[var(--muted)] transition-opacity hover:opacity-70"
                    aria-label={`${agent.name} on LinkedIn`}
                  >
                    <LinkedInIcon className="h-6 w-6 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {agent.description && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--charcoal)]">About</h2>
            <div className="mt-4 whitespace-pre-wrap text-[var(--charcoal-light)]">{agent.description}</div>
          </section>
        )}

        {notableDeals.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[var(--charcoal)]">Notable Deals</h2>
            <ul className="mt-4 space-y-2">
              {notableDeals.map((deal, i) => (
                <li key={i} className="flex items-start gap-2 text-[var(--charcoal-light)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--navy)]" />
                  {deal}
                </li>
              ))}
            </ul>
          </section>
        )}

        {!agent.description && notableDeals.length === 0 && (
          <p className="text-[var(--charcoal-light)]">More information coming soon.</p>
        )}
      </div>
    </div>
  );
}
