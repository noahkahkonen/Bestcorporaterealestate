export interface MapStyle {
  featureType?: string;
  elementType?: string;
  stylers?: { [key: string]: unknown }[];
}

// Grey theme with green accents
const MAP_STYLES: MapStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  // Water - grey with subtle green tint
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8c4c0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6b7b76" }] },
  // Landscape - greys with light green for parks
  { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#e2e8e4" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#ededed" }] },
  // Roads - clean greys
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d4d4d4" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#a8a8a8" }] },
  // Admin / boundaries - green accent
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#9caa96" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#6b7b76" }] },
];

// Dark mode - dark grey theme (no green)
const MAP_STYLES_DARK: MapStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  // Water - dark grey
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#374151" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  // Landscape - dark greys
  { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#374151" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#1f2937" }] },
  // Roads
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#374151" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#4b5563" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#4b5563" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#6b7280" }] },
  // Admin - dark grey
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#4b5563" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  // Text
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#1f2937" }] },
];

export { MAP_STYLES, MAP_STYLES_DARK };
