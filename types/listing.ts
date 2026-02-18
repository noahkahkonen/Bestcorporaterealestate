export interface Broker {
  id: string;
  name: string;
  title: string | null;
  email: string;
  phone: string | null;
  ext: string | null;
  credentials: string | null;
  headshot: string | null;
}

export interface InvestmentMetrics {
  noi: number;   // Net Operating Income (annual)
  price: number; // Purchase/sale price
  capRate: number; // Cap rate as decimal (e.g. 0.08 for 8%)
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  landSubcategory?: string;
  listingType: string;
  price?: number | null;
  priceNegotiable?: boolean;
  noi?: number | null;
  leaseType?: string | null;
  leasePricePerSf?: number | null;
  leaseNnnCharges?: number | null;
  squareFeet: number | null;
  acreage: number | null;
  occupancy?: string | null; // Owner User, Investment, Owner User/Investment
  features: string[];
  heroImage: string;
  galleryImages: string[];
  brochure?: string | null;
  youtubeLink?: string | null;
  description: string;
  investmentMetrics?: InvestmentMetrics;
  brokers?: Broker[];
}

export const PROPERTY_TYPES = [
  "Retail",
  "Industrial",
  "Office",
  "Multifamily",
  "Land",
  "Specialty",
  "Residential",
  "Business",
] as const;

export const LISTING_TYPES = ["For Sale", "For Lease", "Sale/Lease"] as const;

export const LAND_SUBCATEGORIES = ["Retail", "Office", "Industrial", "Specialty", "Residential"] as const;
