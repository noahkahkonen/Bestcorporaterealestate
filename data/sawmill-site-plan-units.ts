import type { SitePlanUnit } from "@/types/site-plan";

// 3-unit retail/restaurant building: Take-Out Restaurant (2,400 SF), two Restaurants (1,300 SF each). Total 5,000 SF.
export const SAWMILL_SITE_PLAN_UNITS: SitePlanUnit[] = [
  { id: "1", tenantName: "Proposed Take-Out Restaurant", use: "Take-Out Restaurant", sizeSf: 2400, rentPsfNnn: "TBD", leaseExpiration: "—" },
  { id: "2", tenantName: "Proposed Restaurant", use: "Restaurant", sizeSf: 1300, rentPsfNnn: "TBD", leaseExpiration: "—" },
  { id: "3", tenantName: "Proposed Restaurant", use: "Restaurant", sizeSf: 1300, rentPsfNnn: "TBD", leaseExpiration: "—" },
];
