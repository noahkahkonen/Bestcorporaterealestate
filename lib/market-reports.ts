export interface MarketReport {
  id: string;
  submarket: string;
  sector: string;
  vacancy: number;
  absorption: number;
  underConstruction: number;
  lat?: number;
  lng?: number;
  year: number;
  quarter: string;
  notes?: string;
}

const DEFAULT_MARKET_REPORTS: MarketReport[] = [
  {
    id: "r1",
    submarket: "New Albany",
    sector: "Industrial",
    vacancy: 2.4,
    absorption: 1.2,
    underConstruction: 4.8,
    lat: 40.0813,
    lng: -82.8087,
    year: 2023,
    quarter: "Q3",
    notes: "Industrial Tech Corridor",
  },
  {
    id: "r2",
    submarket: "Easton",
    sector: "Retail",
    vacancy: 5.1,
    absorption: 0.8,
    underConstruction: 0.5,
    lat: 40.0479,
    lng: -82.9161,
    year: 2023,
    quarter: "Q3",
    notes: "Lifestyle center",
  },
  {
    id: "r3",
    submarket: "Dublin",
    sector: "Office",
    vacancy: 12.3,
    absorption: -0.3,
    underConstruction: 0.2,
    lat: 40.0992,
    lng: -83.1141,
    year: 2023,
    quarter: "Q3",
  },
  {
    id: "r4",
    submarket: "Downtown Columbus",
    sector: "Office",
    vacancy: 18.5,
    absorption: 0.5,
    underConstruction: 1.2,
    lat: 39.9612,
    lng: -82.9988,
    year: 2023,
    quarter: "Q3",
  },
];

export function getMarketReports(): MarketReport[] {
  return [...DEFAULT_MARKET_REPORTS];
}

export const OCCUPANCY_DATA = [
  { label: "Industrial", pct: 92, sub: "Historical Peak", color: "text-[var(--navy)]" },
  { label: "Retail", pct: 80, sub: "Stable Growth", color: "text-[var(--navy-light)]" },
  { label: "Office", pct: 71, sub: "Post-Pandemic Correction", color: "text-emerald-600" },
] as const;
