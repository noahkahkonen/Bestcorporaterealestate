export interface Service {
  title: string;
  slug: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    title: "Seller Representation",
    slug: "seller-representation",
    description:
      "We advise property owners through every step of the disposition process. From valuation and marketing strategy to negotiation and closing, our team delivers institutional-quality execution and maximum value for your asset.",
  },
  {
    title: "Landlord Representation",
    slug: "landlord-representation",
    description:
      "Full-service leasing and asset management for office, retail, and industrial properties. We develop and execute leasing strategy, negotiate terms, and maintain strong tenant relationships to optimize occupancy and income.",
  },
  {
    title: "Buyer Representation",
    slug: "buyer-representation",
    description:
      "Dedicated advisory for investors and owner-users acquiring commercial real estate. We provide market intelligence, underwriting support, and disciplined negotiation to secure the right asset on the right terms.",
  },
  {
    title: "Tenant Representation",
    slug: "tenant-representation",
    description:
      "We represent tenants in lease negotiations across office, retail, and industrial product types. Our advisory ensures you secure favorable economics, flexibility, and space that supports your business objectives.",
  },
  {
    title: "Business Brokerage and Consulting",
    slug: "business-brokerage-consulting",
    description:
      "Advisory and transaction support for buying and selling businesses. We help owners and acquirers navigate valuations, due diligence, and deal structure. From main street to middle market, we provide strategic guidance through every stage of a business transition.",
  },
  {
    title: "Property Management",
    slug: "property-management",
    description:
      "Full-service property management for commercial and multifamily assets. We handle day-to-day operations, tenant relations, maintenance and repairs, financial reporting, and strategic oversight to maximize value and streamline ownership for investors.",
  },
  {
    title: "Residential Services",
    slug: "residential-services",
    description:
      "Residential real estate brokerage and advisory for home buyers and sellers in Central Ohio. We combine local market expertise with attentive service to guide you through every step of your residential transaction.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
