"use client";

import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";
import { useMapStyles } from "@/lib/use-map-styles";
import type { Listing } from "@/types/listing";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const COLUMBUS_CENTER = { lat: 39.9612, lng: -83.0007 };

function getMarkerIcon() {
  if (typeof google === "undefined" || !google.maps) return undefined;
  return {
    url: "/images/map-marker.svg",
    scaledSize: new google.maps.Size(56, 56),
    anchor: new google.maps.Point(28, 56),
  };
}

function PropertyMapContent({ listing }: { listing: Listing }) {
  const styles = useMapStyles();
  const lat = listing.latitude;
  const lng = listing.longitude;
  const position =
    lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng) && (lat !== 0 || lng !== 0)
      ? { lat, lng }
      : COLUMBUS_CENTER;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={position}
      zoom={16}
      options={{
        zoomControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        styles: styles as google.maps.MapTypeStyle[],
      }}
    >
      <Marker position={position} title={listing.title} icon={getMarkerIcon()} />
    </GoogleMap>
  );
}

export default function PropertyMap({ listing }: { listing: Listing }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "your_google_maps_api_key_here") {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
        <p className="px-4 text-center text-sm">
          Map unavailable. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local.
        </p>
      </div>
    );
  }

  return (
    <LoadScriptNext googleMapsApiKey={apiKey}>
      <div className="relative h-[320px] w-full overflow-hidden rounded-lg">
        <PropertyMapContent listing={listing} />
      </div>
    </LoadScriptNext>
  );
}
