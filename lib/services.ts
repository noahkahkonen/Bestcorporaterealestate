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
    title: "Broker Price Opinion",
    slug: "brokers-price-opinion",
    description:
      "An objective broker price opinion helps owners and capital partners align on probable value before a full marketing process. We pair recent Central Ohio comparables, rent and cap assumptions, and property-specific factors into a clear, defensible range you can use for planning, reporting, or internal approvals.",
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
    title: "Site Analysis",
    slug: "site-analysis",
    description:
      "Before you commit capital, you need a clear read on the parcel, zoning, access, utilities, and competitive context. Our site analysis translates maps, ordinances, and market fundamentals into practical guidance—so you understand constraints, upside, and how the location fits your investment or development thesis.",
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
    title: "Business Evaluation",
    slug: "business-evaluation",
    description:
      "A structured business evaluation helps owners and buyers agree on an informed view of earnings quality, risk, and transferable value. We synthesize financials, operations, and market comps so you can prioritize improvements, set expectations, or prepare for conversations with lenders and counterparties.",
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
  {
    title: "Market Value Analysis",
    slug: "market-value-analysis",
    description:
      "A market value analysis looks at active listings, recent closings, and neighborhood trends to bracket what your home is likely worth today—not a full appraisal, but a disciplined snapshot for sellers pricing strategically or buyers calibrating offers in Central Ohio’s evolving residential market.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
