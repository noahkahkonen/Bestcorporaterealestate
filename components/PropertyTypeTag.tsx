const PROPERTY_TYPE_VARS: Record<string, string> = {
  Retail: "var(--property-retail)",
  Industrial: "var(--property-industrial)",
  Office: "var(--property-office)",
  Multifamily: "var(--property-multifamily)",
  Land: "var(--property-land)",
  Specialty: "var(--property-specialty)",
  Residential: "var(--property-residential)",
  Business: "var(--property-business)",
};

interface PropertyTypeTagProps {
  propertyType: string;
  className?: string;
}

export default function PropertyTypeTag({ propertyType, className = "" }: PropertyTypeTagProps) {
  const color = PROPERTY_TYPE_VARS[propertyType] ?? "var(--charcoal)";
  return (
    <span className={className} style={{ color }}>
      {propertyType}
    </span>
  );
}
