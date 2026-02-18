import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_FEATURES = [
  "High Visibility",
  "On-Site Parking",
  "Drive-Thru",
  "Dock High",
  "Outdoor Storage",
  "Build-Out Ready",
  "Pedestrian Traffic",
  "Single Tenant",
  "High Traffic Corridor",
  "Parking",
  "Assumable Financing",
  "32' Clear Height",
  "I-71 / I-270 Access",
  "Expandable",
  "Fitness Center",
  "Conference Center",
  "Parking Garage",
  "Full Floor Option",
  "Walkable to Arena",
  "Balconies",
  "In-Unit Laundry",
  "Pet Friendly",
  "Stabilized",
  "Walkable to Retail",
  "Highway Frontage",
  "Utilities at Street",
  "Zoned Commercial",
  "Pad-Ready",
  "Investment",
];

const TEAM_AGENTS = [
  { name: "Valerie Tivin", title: "Managing Broker", email: "vtivin@bestcorporaterealestate.com", phone: "614-559-3350", ext: "110", headshot: "/images/team/valerie-tivin.png", order: 0 },
  { name: "Randy Best", title: "Principal Broker", credentials: "CCIM, SIOR", email: "rbest@bestcorporaterealestate.com", phone: "614-559-3350", ext: "112", headshot: "/images/team/randy-best.png", order: 1 },
  { name: "James Mangas", title: "Senior Advisor", credentials: "CCIM", email: "jmangas@bestcorporaterealestate.com", phone: "614-559-3350", ext: "115", headshot: "/images/team/james-mangas.png", order: 2 },
  { name: "Rebecca Withrow", title: "Advisor", credentials: "CCIM", email: "rwithrow@bestcorporaterealestate.com", phone: "614-559-3350", ext: "111", headshot: "/images/team/rebecca-withrow.png", order: 3 },
  { name: "Glenn Garland", title: "Advisor", email: "ggarland@bestcorporaterealestate.com", phone: "614-559-3350", ext: "123", headshot: "/images/team/glenn-garland.png", order: 4 },
  { name: "Jack Holstein", title: "Advisor", email: "jdh@bizcorp1.com", phone: "614-559-3350", ext: "116", headshot: "/images/team/jack-holstein.png", order: 5 },
  { name: "Richard Barth", title: "Advisor", credentials: "CBI, CBC, CMEA, CSBA", email: "rbarth@bestcorporaterealestate.com", phone: "614-559-3350", ext: "120", website: "www.jrbarth.com", headshot: "/images/team/richard-barth.png", order: 6 },
  { name: "Sandra Azeez", title: "Advisor", email: "sazeez@bestcorporaterealestate.com", phone: "614-559-3350", ext: "121", headshot: "/images/team/sandra-azeez.png", order: 7 },
];

async function main() {
  for (const label of DEFAULT_FEATURES) {
    await prisma.featureOption.upsert({
      where: { label },
      create: { label },
      update: {},
    });
  }
  console.log("Seeded feature options.");

  for (const agent of TEAM_AGENTS) {
    const existing = await prisma.agent.findFirst({ where: { email: agent.email } });
    if (!existing) {
      await prisma.agent.create({
        data: {
          name: agent.name,
          title: agent.title,
          email: agent.email,
          phone: agent.phone,
          ext: agent.ext,
          credentials: (agent as any).credentials || null,
          website: (agent as any).website || null,
          headshot: (agent as any).headshot || null,
          order: agent.order,
        },
      });
      console.log("Added agent:", agent.name);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
