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
    <span
      className={`inline-block rounded-md px-2 py-0.5 ${className}`}
      style={{
        color: `color-mix(in srgb, ${color} 75%, white)`,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
        textShadow: `0 0 2px color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {propertyType}
    </span>
  );
}
