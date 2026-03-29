/**
 * Long-form copy for /services/[slug] — local market positioning and Central Ohio depth.
 * Keys must match `Service.slug` in `@/lib/services`.
 */
export const SERVICE_DETAIL_LOCAL_COPY: Record<string, string[]> = {
  "seller-representation": [
    "Columbus and Central Ohio are not a single market—they are a mosaic of submarkets, each with its own rent levels, buyer pools, and velocity. We live in those nuances: from the Arena District and CBD office to suburban logistics corridors and neighborhood retail strips. That proximity means we are not guessing from spreadsheets; we are calibrating your disposition against live conversations, tour activity, and lender sentiment on the ground.",
    "A successful sale is rarely only about price—it is timing, story, and counterparty fit. Our team aligns institutional-quality marketing with pragmatic execution so owners see disciplined process, transparent feedback, and advice tuned to how your asset actually trades in this region—not how a generic national comp set suggests it should.",
  ],
  "buyer-representation": [
    "Whether you are pursuing core, value-add, or an owner-user opportunity, success here depends on understanding where growth is landing in Central Ohio: employment clusters, infrastructure projects, zoning realities, and the supply pipeline a year or two ahead. We pair that market map with underwriting discipline and negotiation leverage earned from steady deal flow across office, retail, industrial, and multifamily.",
    "Because we operate daily in this footprint, we can surface off-market paths, challenge assumptions early, and keep your mandate focused on assets that match your risk, hold period, and operational reality—rather than chasing headlines. Your advisor should shorten the distance between question and actionable insight; that is what our local presence is built to deliver.",
  ],
  "landlord-representation": [
    "Leasing in Central Ohio is a balance of headline rents, concession structures, and tenant credit in a market that varies block by block. Landlords need representation that understands not only comparable leases but how tenants evaluate commute, labor access, and future optionality. We build leasing strategies around your capital plan—whether stabilizing a core asset, repositioning a tired building, or filling a development.",
    "Our work sits at the intersection of brokerage and asset strategy: we bring network depth across tenant prospects and brokers, clear communication with ownership, and the persistence required to move negotiations from interest to a signed lease that holds up through delivery and occupancy.",
  ],
  "tenant-representation": [
    "Tenant advisory is about translating your business plan into space, economics, and flexibility. In Central Ohio, that requires reading both traditional CBD and suburban options, understanding how hybrid work has reshaped demand, and knowing where landlords are prepared to compete on structure—not just rate. We represent your interests in every term sheet conversation so the lease supports growth, not friction.",
    "Being local means faster tours, honest assessments of alternatives, and leverage drawn from continuous dialogue with ownership and listing teams across the region. We aim to leave you with a lease you can operate under confidently, not one negotiated in isolation from how this market actually behaves.",
  ],
  "business-brokerage-consulting": [
    "Business sales blend finance, operations, and emotion. In Central Ohio’s main-street and middle-market lanes, buyers and sellers need advisors who understand how small changes in structure—earnouts, working capital, real estate ties—show up at closing. We stay close to owner operators, professional buyers, and the professionals who surround deals, so recommendations reflect how transactions close here, not just how they are modeled in theory.",
    "Our consulting and brokerage support is grounded in consistent deal practice through the region: we can help you prepare for diligence, sequence confidentiality, and maintain momentum when issues arise—because we have seen the same patterns across industries and size ranges in this market.",
  ],
  "property-management": [
    "Property management is where strategy meets the custodial work: collections, vendor relationships, capex planning, and tenant experience. Central Ohio owners need partners who know local vendors, seasonal maintenance realities, and how tenants expect responsiveness in each submarket. We emphasize clarity in reporting and proactive communication so investors know what is happening on-site, not only at quarter-end.",
    "A deep local bench means faster resolution, better cost discipline, and recommendations that reflect code, climate, and tenant norms specific to Ohio—not generic playbooks imported from other states.",
  ],
  "residential-services": [
    "Residential transactions are personal; they also benefit from the same market rigor as commercial work. We bring neighborhood-level knowledge across Columbus and the surrounding communities—pricing trends, inspection norms, timing around schools and commuting patterns—so buyers and sellers make decisions with context, not anxiety.",
    "Because we are embedded in Central Ohio, we can coordinate with lenders, inspectors, and attorneys efficiently, anticipate friction before it slows a closing, and advocate for you in negotiations with a clear view of what similar homes are actually achieving today.",
  ],
};

export function getServiceLocalCopy(slug: string): string[] {
  return SERVICE_DETAIL_LOCAL_COPY[slug] ?? [];
}
