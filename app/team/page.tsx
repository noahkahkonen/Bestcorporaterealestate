import type { Metadata } from "next";
import Image from "next/image";
import { formatPhone } from "@/lib/format-phone";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the commercial real estate professionals at Best Corporate Real Estate in Columbus, Ohio.",
};

const MAIN_PHONE = "614-559-3350";

const TEAM = [
  {
    name: "Valerie Tivin",
    title: "Managing Broker",
    image: "/images/team/valerie-tivin.png",
    phone: MAIN_PHONE,
    ext: "110",
    email: "vtivin@bestcorporaterealestate.com",
  },
  {
    name: "Randy Best",
    title: "Principal Broker",
    credentials: "CCIM, SIOR",
    image: "/images/team/randy-best.png",
    phone: MAIN_PHONE,
    ext: "112",
    email: "rbest@bestcorporaterealestate.com",
  },
  {
    name: "James Mangas",
    title: "Senior Advisor",
    credentials: "CCIM",
    image: "/images/team/james-mangas.png",
    phone: MAIN_PHONE,
    ext: "115",
    email: "jmangas@bestcorporaterealestate.com",
  },
  {
    name: "Rebecca Withrow",
    title: "Advisor",
    credentials: "CCIM",
    image: "/images/team/rebecca-withrow.png",
    phone: MAIN_PHONE,
    ext: "111",
    email: "rwithrow@bestcorporaterealestate.com",
  },
  {
    name: "Glenn Garland",
    title: "Advisor",
    image: "/images/team/glenn-garland.png",
    phone: MAIN_PHONE,
    ext: "123",
    email: "ggarland@bestcorporaterealestate.com",
  },
  {
    name: "Jack Holstein",
    title: "Advisor",
    image: "/images/team/jack-holstein.png",
    phone: MAIN_PHONE,
    ext: "116",
    email: "jdh@bizcorp1.com",
  },
  {
    name: "Richard Barth",
    title: "Advisor",
    credentials: "CBI, CBC, CMEA, CSBA",
    image: "/images/team/richard-barth.png",
    phone: MAIN_PHONE,
    ext: "120",
    email: "rbarth@bestcorporaterealestate.com",
    website: "www.jrbarth.com",
  },
  {
    name: "Sandra Azeez",
    title: "Advisor",
    image: "/images/team/sandra-azeez.png",
    phone: MAIN_PHONE,
    ext: "121",
    email: "sazeez@bestcorporaterealestate.com",
  },
];

export default function TeamPage() {
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
          {TEAM.map((member) => (
            <article
              key={member.email}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  quality={90}
                />
              </div>
              <div className="min-w-0 p-4">
                <p className="font-semibold text-[var(--charcoal)]">
                  {member.name}
                  {member.credentials && (
                    <span className="ml-1 font-normal text-[var(--charcoal-light)]">
                      {member.credentials}
                    </span>
                  )}
                </p>
                <p className="text-sm text-[var(--navy)]">{member.title}</p>
                <p className="mt-1 text-sm text-[var(--charcoal-light)]">
                  {formatPhone(member.phone)}{member.ext && ` Ext. ${member.ext}`}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-1 block whitespace-nowrap text-sm text-[var(--navy)] hover:underline"
                >
                  {member.email}
                </a>
                {member.website && (
                  <a
                    href={`https://${member.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-[var(--navy)] hover:underline"
                  >
                    {member.website}
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
