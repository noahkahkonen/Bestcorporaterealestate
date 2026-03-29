/** Query `?advisor=` on `/contact` — lowercase keys match `propertyType` slugs. */
export const ADVISOR_PREFILL_MESSAGE: Record<string, string> = {
  retail: "I would like to connect with a Retail Advisor.",
  industrial: "I would like to connect with an Industrial Advisor.",
  office: "I would like to connect with an Office Advisor.",
  multifamily: "I would like to connect with a Multifamily Advisor.",
  land: "I would like to connect with a Land Advisor.",
  specialty: "I would like to connect with a Specialist.",
  business: "I would like to connect with a Business Advisor.",
  residential: "I would like to connect with a Realtor®.",
};

export function getAdvisorPrefillMessage(advisor: string | undefined): string | undefined {
  if (!advisor?.trim()) return undefined;
  return ADVISOR_PREFILL_MESSAGE[advisor.trim().toLowerCase()];
}
