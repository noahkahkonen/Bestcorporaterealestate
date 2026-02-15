import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the commercial real estate professionals at Best Corporate Real Estate in Columbus, Ohio.",
};

const TEAM = [
  { name: "Senior Advisor", role: "Principal", bio: "Commercial real estate professional with deep experience in Central Ohio office and industrial markets." },
  { name: "Advisor", role: "Associate", bio: "Focused on retail and multifamily transactions across Columbus and surrounding submarkets." },
  { name: "Advisor", role: "Associate", bio: "Tenant and landlord representation for office and industrial clients." },
  { name: "Market Analyst", role: "Research", bio: "Market research and analytics supporting our advisory and listing efforts." },
];

export default function TeamPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Our Team
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Experienced professionals dedicated to commercial real estate advisory in Columbus and Central Ohio.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <article
              key={i}
              className="rounded-lg border border-[var(--border)] bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="placeholder-img aspect-square w-full">
                <div className="flex h-full w-full items-center justify-center text-sm text-[var(--charcoal-light)]">
                  Headshot
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[var(--charcoal)]">{member.name}</p>
                <p className="text-sm text-[var(--navy)]">{member.role}</p>
                <p className="mt-2 text-sm text-[var(--charcoal-light)]">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
