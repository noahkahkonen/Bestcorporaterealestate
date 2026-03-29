/**
 * Service categories for /services mega navigation and page layout.
 * Each `items[].slug` must exist in `SERVICES` (`@/lib/services`).
 */
export interface ServiceGroupItem {
  slug: string;
  /** Shown on cards / dropdown; falls back to service title if omitted in UI. */
  cardSummary: string;
  /** Card / dropdown thumbnail (remote URL allowed via next.config). */
  image: string;
  imageAlt: string;
}

export interface ServiceGroup {
  id: string;
  label: string;
  /** Short line under label in dropdown header. */
  tagline: string;
  /** Hero / highlight section. */
  coverImage: string;
  coverAlt: string;
  items: ServiceGroupItem[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "investment-sales",
    label: "Investment Sales",
    tagline: "Dispositions and acquisitions with institutional-grade execution.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1600",
    coverAlt: "Modern high-rise office towers",
    items: [
      {
        slug: "seller-representation",
        cardSummary: "Marketing, negotiation, and closing to maximize asset value.",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Commercial building facade",
      },
      {
        slug: "buyer-representation",
        cardSummary: "Market intelligence and disciplined negotiation for acquirers.",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Blueprints and architectural planning",
      },
    ],
  },
  {
    id: "leasing-tenant",
    label: "Leasing & Tenant Advisory",
    tagline: "Landlord leasing strategy and tenant-side representation across product types.",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=85&w=1600",
    coverAlt: "Bright open office workspace",
    items: [
      {
        slug: "landlord-representation",
        cardSummary: "Leasing programs that stabilize income and protect asset value.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Office lobby and reception",
      },
      {
        slug: "tenant-representation",
        cardSummary: "Economics, flexibility, and space aligned to your growth plans.",
        image:
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Collaborative office seating",
      },
    ],
  },
  {
    id: "property-management",
    label: "Property Management",
    tagline: "Operations, reporting, and tenant experience for stabilized assets.",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1600",
    coverAlt: "Residential and commercial property exterior",
    items: [
      {
        slug: "property-management",
        cardSummary: "Day-to-day operations and investor reporting you can rely on.",
        image:
          "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Property maintenance and building systems",
      },
    ],
  },
  {
    id: "business-advisory",
    label: "Business Advisory",
    tagline: "Transitions, valuations, and deal structure for operating companies.",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=85&w=1600",
    coverAlt: "Business meeting and collaboration",
    items: [
      {
        slug: "business-brokerage-consulting",
        cardSummary: "Buy-side and sell-side guidance from main street to middle market.",
        image:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Handshake closing a business deal",
      },
    ],
  },
  {
    id: "residential",
    label: "Residential",
    tagline: "Local brokerage and advisory for Central Ohio homeowners and buyers.",
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1600",
    coverAlt: "Modern suburban home exterior",
    items: [
      {
        slug: "residential-services",
        cardSummary: "Buyers and sellers supported with market insight and care.",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=900",
        imageAlt: "Contemporary home with yard",
      },
    ],
  },
];

/** Resolve a service slug to its group + card metadata (hero image, summaries). */
export function getServiceGroupItemBySlug(
  slug: string
): { group: ServiceGroup; item: ServiceGroupItem } | null {
  for (const group of SERVICE_GROUPS) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) return { group, item };
  }
  return null;
}
