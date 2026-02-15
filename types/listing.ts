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
  latitude: number;
  longitude: number;
  propertyType: string;
  listingType: string;
  squareFeet: number | null;
  acreage: number | null;
  features: string[];
  heroImage: string;
  galleryImages: string[];
  description: string;
  investmentMetrics?: InvestmentMetrics;
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
